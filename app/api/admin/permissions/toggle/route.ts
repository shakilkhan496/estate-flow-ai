import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RolePermission from '@/lib/models/RolePermission';
import Permission from '@/lib/models/Permission';
import { hasPermission, createAuditLog, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';
import { PermissionScope } from '@/lib/models/RolePermission';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { roleId, permissionId, allowed, scope } = body;

    if (!roleId || !permissionId) {
      return NextResponse.json({ error: 'roleId and permissionId are required' }, { status: 400 });
    }

    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }

    let rolePermission = await RolePermission.findOne({ roleId, permissionId });

    if (rolePermission) {
      if (allowed !== undefined) rolePermission.allowed = allowed;
      if (scope) rolePermission.scope = scope as PermissionScope;
      await rolePermission.save();
    } else {
      rolePermission = await RolePermission.create({
        roleId,
        permissionId,
        allowed: allowed !== undefined ? allowed : true,
        scope: scope || 'OWN',
      });
    }

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'PERMISSION_TOGGLED',
      entityType: 'RolePermission',
      entityId: rolePermission._id.toString(),
      metadata: { roleId, permissionKey: permission.key, allowed, scope },
    });

    return NextResponse.json({ rolePermission });
  } catch (error) {
    console.error('Error toggling permission:', error);
    return NextResponse.json({ error: 'Failed to toggle permission' }, { status: 500 });
  }
}
