import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PolicyVersion from '@/lib/models/PolicyVersion';
import PolicySnapshot from '@/lib/models/PolicySnapshot';
import Role from '@/lib/models/Role';
import Permission from '@/lib/models/Permission';
import RolePermission from '@/lib/models/RolePermission';
import FieldRule from '@/lib/models/FieldRule';
import { hasPermission, createAuditLog, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'POLICY:MANAGE');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { policyVersionId } = body;

    if (!policyVersionId) {
      return NextResponse.json({ error: 'policyVersionId is required' }, { status: 400 });
    }

    const policyVersion = await PolicyVersion.findById(policyVersionId);
    if (!policyVersion) {
      return NextResponse.json({ error: 'Policy version not found' }, { status: 404 });
    }

    const snapshot = await PolicySnapshot.findOne({ policyVersionId });
    if (!snapshot) {
      return NextResponse.json({ error: 'No snapshot found for this policy version' }, { status: 404 });
    }

    const { roles, rolePermissions, fieldRules } = snapshot.snapshotJson as {
      roles: Array<{ _id: string; name: string; key: string; orgType: string; description: string; isSystem: boolean }>;
      rolePermissions: Array<{ roleId: string; permissionId: { _id: string; key: string }; scope: string; allowed: boolean }>;
      fieldRules: Array<{ roleId: string; resource: string; field: string; access: string }>;
    };

    await RolePermission.deleteMany({});
    await FieldRule.deleteMany({});
    
    const existingRoles = await Role.find().lean();
    const existingRoleKeys = new Set(existingRoles.map(r => r.key));
    
    const rolesToCreate = roles.filter(r => !existingRoleKeys.has(r.key));
    if (rolesToCreate.length > 0) {
      await Role.insertMany(rolesToCreate.map(r => ({
        name: r.name,
        key: r.key,
        orgType: r.orgType,
        description: r.description,
        isSystem: r.isSystem,
      })));
    }

    const allRoles = await Role.find().lean();
    const roleKeyToId = new Map(allRoles.map(r => [r.key, r._id.toString()]));
    
    const permissions = await Permission.find().lean();
    const permKeyToId = new Map(permissions.map(p => [p.key, p._id.toString()]));

    const newRolePermissions = rolePermissions
      .map(rp => {
        const roleFromSnapshot = roles.find(r => r._id === rp.roleId.toString());
        const roleKey = roleFromSnapshot?.key;
        const newRoleId = roleKey ? roleKeyToId.get(roleKey) : null;
        
        const permKey = rp.permissionId?.key;
        const newPermId = permKey ? permKeyToId.get(permKey) : null;

        if (!newRoleId || !newPermId) return null;

        return {
          roleId: newRoleId,
          permissionId: newPermId,
          scope: rp.scope,
          allowed: rp.allowed,
        };
      })
      .filter(Boolean);

    if (newRolePermissions.length > 0) {
      await RolePermission.insertMany(newRolePermissions);
    }

    const newFieldRules = fieldRules
      .map(fr => {
        const roleFromSnapshot = roles.find(r => r._id === fr.roleId.toString());
        const roleKey = roleFromSnapshot?.key;
        const newRoleId = roleKey ? roleKeyToId.get(roleKey) : null;

        if (!newRoleId) return null;

        return {
          roleId: newRoleId,
          resource: fr.resource,
          field: fr.field,
          access: fr.access,
        };
      })
      .filter(Boolean);

    if (newFieldRules.length > 0) {
      await FieldRule.insertMany(newFieldRules);
    }

    const latestVersion = await PolicyVersion.findOne({ 
      organizationId: policyVersion.organizationId 
    }).sort({ versionNumber: -1 });

    const newVersion = await PolicyVersion.create({
      organizationId: policyVersion.organizationId,
      status: 'PUBLISHED',
      versionNumber: (latestVersion?.versionNumber || 0) + 1,
      publishedAt: new Date(),
      createdByUserId: userId,
    });

    await PolicySnapshot.create({
      policyVersionId: newVersion._id,
      snapshotJson: snapshot.snapshotJson,
    });

    await PolicyVersion.updateMany(
      { 
        organizationId: policyVersion.organizationId, 
        _id: { $ne: newVersion._id },
        status: 'PUBLISHED' 
      },
      { status: 'ARCHIVED' }
    );

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'POLICY_ROLLBACK',
      entityType: 'PolicyVersion',
      entityId: newVersion._id.toString(),
      metadata: { 
        rolledBackFromVersion: policyVersion.versionNumber,
        newVersion: newVersion.versionNumber,
      },
    });

    return NextResponse.json({ 
      success: true, 
      newPolicyVersion: newVersion,
      rolledBackFrom: policyVersion.versionNumber,
    });
  } catch (error) {
    console.error('Error rolling back policy:', error);
    return NextResponse.json({ error: 'Failed to rollback policy' }, { status: 500 });
  }
}
