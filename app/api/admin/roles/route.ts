import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Role from '@/lib/models/Role';
import RolePermission from '@/lib/models/RolePermission';
import Permission from '@/lib/models/Permission';
import { hasPermission, createAuditLog, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ROLE:VIEW');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const orgType = searchParams.get('orgType');

    const query: Record<string, unknown> = {};
    if (orgType) {
      query.orgType = orgType;
    }

    const roles = await Role.find(query).sort({ orgType: 1, name: 1 });

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ROLE:CREATE');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, key, orgType, description, cloneFromRoleId } = body;

    if (!name || !key || !orgType) {
      return NextResponse.json({ error: 'Name, key, and orgType are required' }, { status: 400 });
    }

    const existingRole = await Role.findOne({ key: key.toUpperCase() });
    if (existingRole) {
      return NextResponse.json({ error: 'Role key already exists' }, { status: 400 });
    }

    const role = await Role.create({
      name,
      key: key.toUpperCase(),
      orgType,
      description: description || '',
      isSystem: false,
    });

    if (cloneFromRoleId) {
      const sourcePermissions = await RolePermission.find({ roleId: cloneFromRoleId });
      const newPermissions = sourcePermissions.map(sp => ({
        roleId: role._id,
        permissionId: sp.permissionId,
        scope: sp.scope,
        allowed: sp.allowed,
      }));
      
      if (newPermissions.length > 0) {
        await RolePermission.insertMany(newPermissions);
      }
    }

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'ROLE_CREATED',
      entityType: 'Role',
      entityId: role._id.toString(),
      metadata: { name, key, orgType, clonedFrom: cloneFromRoleId },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
