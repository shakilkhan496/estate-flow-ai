import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Role from '@/lib/models/Role';
import RolePermission from '@/lib/models/RolePermission';
import OrganizationMember from '@/lib/models/OrganizationMember';
import FieldRule from '@/lib/models/FieldRule';
import { hasPermission, createAuditLog, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const permissions = await RolePermission.find({ roleId: id })
      .populate('permissionId');

    const fieldRules = await FieldRule.find({ roleId: id });

    return NextResponse.json({ role, permissions, fieldRules });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ROLE:EDIT');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (name) role.name = name;
    if (description !== undefined) role.description = description;

    await role.save();

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'ROLE_UPDATED',
      entityType: 'Role',
      entityId: id,
      metadata: { name, description },
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ROLE:DELETE');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (role.isSystem) {
      return NextResponse.json({ error: 'Cannot delete system roles' }, { status: 400 });
    }

    const assignedCount = await OrganizationMember.countDocuments({ roleId: id });
    if (assignedCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete role: ${assignedCount} users are assigned to this role` 
      }, { status: 400 });
    }

    await RolePermission.deleteMany({ roleId: id });
    await FieldRule.deleteMany({ roleId: id });
    await Role.findByIdAndDelete(id);

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'ROLE_DELETED',
      entityType: 'Role',
      entityId: id,
      metadata: { roleName: role.name, roleKey: role.key },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
