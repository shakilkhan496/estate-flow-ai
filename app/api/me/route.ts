import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import OrganizationMember from '@/lib/models/OrganizationMember';
import { getUserPermissions, getUserRole, isSuperAdmin } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(auth.user.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const memberships = await OrganizationMember.find({ 
      userId: user._id, 
      isActive: true 
    })
      .populate('organizationId', 'name type')
      .populate('roleId', 'name key');

    const organizations = memberships.map(m => ({
      id: (m.organizationId as unknown as { _id: string; name: string; type: string })._id,
      name: (m.organizationId as unknown as { name: string }).name,
      type: (m.organizationId as unknown as { type: string }).type,
      role: {
        id: (m.roleId as unknown as { _id: string })._id,
        name: (m.roleId as unknown as { name: string }).name,
        key: (m.roleId as unknown as { key: string }).key,
      },
    }));

    let permissions: Array<{ permissionKey: string; scope: string }> = [];
    let currentRole = null;
    let activeOrganization = null;

    if (user.activeOrganizationId) {
      permissions = await getUserPermissions(user._id, user.activeOrganizationId);
      currentRole = await getUserRole(user._id, user.activeOrganizationId);
      
      const org = await Organization.findById(user.activeOrganizationId);
      if (org) {
        activeOrganization = {
          id: org._id,
          name: org.name,
          type: org.type,
        };
      }
    }

    const isSuper = await isSuperAdmin(user._id);

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        activeOrganizationId: user.activeOrganizationId,
      },
      activeOrganization,
      currentRole,
      organizations,
      permissions,
      isSuperAdmin: isSuper,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { activeOrganizationId } = body;

    if (!activeOrganizationId) {
      return NextResponse.json({ error: 'activeOrganizationId is required' }, { status: 400 });
    }

    const membership = await OrganizationMember.findOne({
      userId: auth.user.id,
      organizationId: activeOrganizationId,
      isActive: true,
    });

    if (!membership) {
      return NextResponse.json({ 
        error: 'You are not a member of this organization' 
      }, { status: 403 });
    }

    const user = await User.findByIdAndUpdate(
      auth.user.id,
      { activeOrganizationId },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating active organization:', error);
    return NextResponse.json({ error: 'Failed to update active organization' }, { status: 500 });
  }
}
