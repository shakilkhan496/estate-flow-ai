import { Types } from 'mongoose';
import dbConnect from '../mongodb';
import OrganizationMember from '../models/OrganizationMember';
import RolePermission from '../models/RolePermission';
import Role from '../models/Role';
import Permission from '../models/Permission';
import User from '../models/User';
import { PermissionScope } from '../models/RolePermission';

export interface ResourceContext {
  createdByUserId?: string | Types.ObjectId;
  assignedToUserId?: string | Types.ObjectId;
  teamId?: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
}

export interface PermissionResult {
  allowed: boolean;
  scope: PermissionScope | null;
  reason?: string;
}

export async function hasPermission(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId | null,
  permissionKey: string,
  resourceContext?: ResourceContext
): Promise<PermissionResult> {
  await dbConnect();

  if (!activeOrgId) {
    return { allowed: false, scope: null, reason: 'No active organization' };
  }

  const membership = await OrganizationMember.findOne({
    userId: new Types.ObjectId(userId.toString()),
    organizationId: new Types.ObjectId(activeOrgId.toString()),
    isActive: true,
  }).populate('roleId');

  if (!membership) {
    return { allowed: false, scope: null, reason: 'User is not a member of this organization' };
  }

  const permission = await Permission.findOne({ key: permissionKey });
  if (!permission) {
    return { allowed: false, scope: null, reason: `Permission ${permissionKey} not found` };
  }

  const rolePermission = await RolePermission.findOne({
    roleId: membership.roleId,
    permissionId: permission._id,
    allowed: true,
  });

  if (!rolePermission) {
    return { allowed: false, scope: null, reason: 'Permission not granted to role' };
  }

  if (!resourceContext) {
    return { allowed: rolePermission.allowed, scope: rolePermission.scope };
  }

  const scopeCheck = checkScope(
    rolePermission.scope,
    userId.toString(),
    activeOrgId.toString(),
    resourceContext
  );

  if (!scopeCheck.allowed) {
    return { 
      allowed: false, 
      scope: rolePermission.scope, 
      reason: scopeCheck.reason 
    };
  }

  return { allowed: true, scope: rolePermission.scope };
}

function checkScope(
  scope: PermissionScope,
  userId: string,
  activeOrgId: string,
  context: ResourceContext
): { allowed: boolean; reason?: string } {
  switch (scope) {
    case 'GLOBAL':
      return { allowed: true };

    case 'ORG':
      if (context.organizationId?.toString() === activeOrgId) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Resource does not belong to your organization' };

    case 'TEAM':
      if (context.organizationId?.toString() === activeOrgId) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Resource is not in your team scope' };

    case 'ASSIGNED':
      if (context.assignedToUserId?.toString() === userId) {
        return { allowed: true };
      }
      if (context.createdByUserId?.toString() === userId) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Resource is not assigned to you' };

    case 'OWN':
      if (context.createdByUserId?.toString() === userId) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'You do not own this resource' };

    default:
      return { allowed: false, reason: 'Unknown scope' };
  }
}

export async function getUserPermissions(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId
): Promise<Array<{ permissionKey: string; scope: PermissionScope }>> {
  await dbConnect();

  const membership = await OrganizationMember.findOne({
    userId: new Types.ObjectId(userId.toString()),
    organizationId: new Types.ObjectId(activeOrgId.toString()),
    isActive: true,
  });

  if (!membership) {
    return [];
  }

  const rolePermissions = await RolePermission.find({
    roleId: membership.roleId,
    allowed: true,
  }).populate('permissionId');

  return rolePermissions.map(rp => ({
    permissionKey: (rp.permissionId as unknown as { key: string }).key,
    scope: rp.scope,
  }));
}

export async function getUserRole(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId
): Promise<{ roleKey: string; roleName: string } | null> {
  await dbConnect();

  const membership = await OrganizationMember.findOne({
    userId: new Types.ObjectId(userId.toString()),
    organizationId: new Types.ObjectId(activeOrgId.toString()),
    isActive: true,
  }).populate('roleId');

  if (!membership || !membership.roleId) {
    return null;
  }

  const role = membership.roleId as unknown as { key: string; name: string };
  return { roleKey: role.key, roleName: role.name };
}

export async function isSuperAdmin(
  userId: string | Types.ObjectId
): Promise<boolean> {
  await dbConnect();

  const user = await User.findById(userId).select('role');
  if (user?.role === 'admin') {
    return true;
  }

  const memberships = await OrganizationMember.find({
    userId: new Types.ObjectId(userId.toString()),
    isActive: true,
  }).populate('roleId');

  return memberships.some(m => {
    const role = m.roleId as unknown as { key: string };
    return role?.key === 'SUPER_ADMIN';
  });
}
