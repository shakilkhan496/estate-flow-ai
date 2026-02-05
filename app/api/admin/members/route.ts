import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import OrganizationMember from '@/lib/models/OrganizationMember';
import Role from '@/lib/models/Role';
import { hasPermission, createAuditLog, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || auth.user.activeOrganizationId;

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    const members = await OrganizationMember.find({ organizationId })
      .populate('userId', 'name email isActive')
      .populate('roleId', 'name key')
      .sort({ createdAt: -1 });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
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

    const permResult = await hasPermission(userId, activeOrgId, 'ORG:MANAGE_USERS');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { email, name, roleId, organizationId } = body;

    if (!email || !roleId) {
      return NextResponse.json({ error: 'Email and roleId are required' }, { status: 400 });
    }

    const orgId = organizationId || activeOrgId;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || email.split('@')[0],
        isActive: true,
        activeOrganizationId: orgId,
      });
    }

    const existingMember = await OrganizationMember.findOne({
      userId: user._id,
      organizationId: orgId,
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this organization' }, { status: 400 });
    }

    const member = await OrganizationMember.create({
      userId: user._id,
      organizationId: orgId,
      roleId,
      isActive: true,
    });

    await createAuditLog({
      actorUserId: userId,
      organizationId: orgId,
      action: 'MEMBER_ADDED',
      entityType: 'OrganizationMember',
      entityId: member._id.toString(),
      metadata: { email, roleId },
    });

    const populatedMember = await OrganizationMember.findById(member._id)
      .populate('userId', 'name email isActive')
      .populate('roleId', 'name key');

    return NextResponse.json({ member: populatedMember }, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ORG:MANAGE_USERS');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { memberId, roleId, isActive } = body;

    if (!memberId) {
      return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
    }

    const member = await OrganizationMember.findById(memberId)
      .populate('roleId', 'key');

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const currentRole = member.roleId as unknown as { key: string };
    if (currentRole?.key === 'SUPER_ADMIN' && isActive === false) {
      const superAdminCount = await OrganizationMember.countDocuments({
        organizationId: member.organizationId,
        isActive: true,
      }).populate({
        path: 'roleId',
        match: { key: 'SUPER_ADMIN' }
      });

      const platformOrg = await Organization.findOne({ type: 'PLATFORM' });
      if (platformOrg && member.organizationId.toString() === platformOrg._id.toString()) {
        const activeSuperAdmins = await OrganizationMember.find({
          organizationId: platformOrg._id,
          isActive: true,
        }).populate('roleId');

        const superAdminMembers = activeSuperAdmins.filter(m => {
          const role = m.roleId as unknown as { key: string };
          return role?.key === 'SUPER_ADMIN';
        });

        if (superAdminMembers.length <= 1) {
          return NextResponse.json({ 
            error: 'Cannot disable the last Super Admin' 
          }, { status: 400 });
        }
      }
    }

    if (roleId) member.roleId = roleId;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'MEMBER_UPDATED',
      entityType: 'OrganizationMember',
      entityId: memberId,
      metadata: { roleId, isActive },
    });

    const updatedMember = await OrganizationMember.findById(memberId)
      .populate('userId', 'name email isActive')
      .populate('roleId', 'name key');

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}
