import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Role from '@/lib/models/Role';
import Permission from '@/lib/models/Permission';
import RolePermission from '@/lib/models/RolePermission';
import { verifyAuth } from '@/lib/auth';
import { hasPermission, isSuperAdmin } from '@/lib/rbac';

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

    const roleQuery: Record<string, unknown> = {};
    if (orgType) {
      roleQuery.orgType = orgType;
    }

    const [roles, permissions, rolePermissions] = await Promise.all([
      Role.find(roleQuery).sort({ orgType: 1, name: 1 }).lean(),
      Permission.find().sort({ group: 1, key: 1 }).lean(),
      RolePermission.find().lean(),
    ]);

    const matrix: Record<string, Record<string, { allowed: boolean; scope: string }>> = {};

    for (const role of roles) {
      matrix[role._id.toString()] = {};
      for (const perm of permissions) {
        const rp = rolePermissions.find(
          rp => rp.roleId.toString() === role._id.toString() && 
                rp.permissionId.toString() === perm._id.toString()
        );
        matrix[role._id.toString()][perm._id.toString()] = {
          allowed: rp?.allowed ?? false,
          scope: rp?.scope ?? 'OWN',
        };
      }
    }

    const groups = [...new Set(permissions.map(p => p.group))];

    return NextResponse.json({ roles, permissions, matrix, groups });
  } catch (error) {
    console.error('Error fetching permission matrix:', error);
    return NextResponse.json({ error: 'Failed to fetch permission matrix' }, { status: 500 });
  }
}
