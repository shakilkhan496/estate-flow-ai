import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PolicyVersion from '@/lib/models/PolicyVersion';
import PolicySnapshot from '@/lib/models/PolicySnapshot';
import Role from '@/lib/models/Role';
import RolePermission from '@/lib/models/RolePermission';
import FieldRule from '@/lib/models/FieldRule';
import OrganizationMember from '@/lib/models/OrganizationMember';
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

    if (policyVersion.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Policy is already published' }, { status: 400 });
    }

    const [roles, rolePermissions, fieldRules] = await Promise.all([
      Role.find().lean(),
      RolePermission.find().populate('permissionId').lean(),
      FieldRule.find().lean(),
    ]);

    const manageUsersPermRoles = rolePermissions.filter(rp => {
      const perm = rp.permissionId as unknown as { key: string };
      return perm?.key === 'ORG:MANAGE_USERS' && rp.allowed;
    });

    if (manageUsersPermRoles.length === 0) {
      return NextResponse.json({ 
        error: 'Cannot publish: No role has ORG:MANAGE_USERS permission. This would lock out all admins.' 
      }, { status: 400 });
    }

    const snapshotJson = {
      roles,
      rolePermissions,
      fieldRules,
      publishedAt: new Date().toISOString(),
    };

    await PolicySnapshot.create({
      policyVersionId: policyVersion._id,
      snapshotJson,
    });

    await PolicyVersion.updateMany(
      { 
        organizationId: policyVersion.organizationId, 
        status: 'PUBLISHED' 
      },
      { status: 'ARCHIVED' }
    );

    policyVersion.status = 'PUBLISHED';
    policyVersion.publishedAt = new Date();
    await policyVersion.save();

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'POLICY_PUBLISHED',
      entityType: 'PolicyVersion',
      entityId: policyVersionId,
      metadata: { 
        versionNumber: policyVersion.versionNumber,
        rolesCount: roles.length,
        permissionsCount: rolePermissions.length,
      },
    });

    return NextResponse.json({ 
      success: true, 
      policyVersion,
      summary: {
        rolesCount: roles.length,
        permissionsCount: rolePermissions.length,
        fieldRulesCount: fieldRules.length,
      }
    });
  } catch (error) {
    console.error('Error publishing policy:', error);
    return NextResponse.json({ error: 'Failed to publish policy' }, { status: 500 });
  }
}
