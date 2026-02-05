import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import OrganizationMember from '@/lib/models/OrganizationMember';
import { verifyAuth } from '@/lib/auth';
import { hasPermission, isSuperAdmin, createAuditLog } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(userId, activeOrgId, 'ORG:VIEW_MEMBERS');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const members = await OrganizationMember.find({ organizationId: activeOrgId, isActive: true })
      .populate('userId', 'name email isActive role createdAt phone')
      .populate('roleId', 'name key')
      .sort({ createdAt: -1 });

    const users = members.map(m => {
      const userDoc = m.userId as unknown as { _id: string; name: string; email: string; isActive: boolean; phone?: string };
      const roleDoc = m.roleId as unknown as { _id: string; name: string; key: string } | null;
      return {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone || '',
        isActive: userDoc.isActive,
        role: roleDoc?.name || 'User',
        roleKey: roleDoc?.key || 'USER',
        roleId: roleDoc?._id,
        memberId: m._id,
        createdAt: m.createdAt,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
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
    const { email, name, password, roleId, phone } = body;

    if (!email || !name || !password || !roleId) {
      return NextResponse.json({ error: 'Email, name, password, and role are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const existingMember = await OrganizationMember.findOne({
        userId: existingUser._id,
        organizationId: activeOrgId,
      });
      if (existingMember) {
        return NextResponse.json({ error: 'User already exists in this organization' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = existingUser;
    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || '',
        isActive: true,
        activeOrganizationId: activeOrgId,
      });
    }

    if (!activeOrgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    const member = await OrganizationMember.create({
      userId: user!._id,
      organizationId: activeOrgId,
      roleId,
      isActive: true,
    });

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { email, name, roleId },
    });

    return NextResponse.json({ 
      user: {
        _id: user!._id,
        name: user!.name,
        email: user!.email,
        isActive: user!.isActive,
        memberId: member._id,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(currentUserId, activeOrgId, 'ORG:MANAGE_USERS');
    const isSuper = await isSuperAdmin(currentUserId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { userId, name, email, password, roleId, isActive, phone } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (password && password.length >= 6) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    if (roleId) {
      await OrganizationMember.findOneAndUpdate(
        { userId: user._id, organizationId: activeOrgId },
        { roleId }
      );
    }

    await createAuditLog({
      actorUserId: currentUserId,
      organizationId: activeOrgId,
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: userId,
      metadata: { name, email, roleId, isActive, passwordChanged: !!password },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = auth.user.id;
    const activeOrgId = auth.user.activeOrganizationId;

    const permResult = await hasPermission(currentUserId, activeOrgId, 'ORG:MANAGE_USERS');
    const isSuper = await isSuperAdmin(currentUserId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (userId === currentUserId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await OrganizationMember.findOneAndUpdate(
      { userId, organizationId: activeOrgId },
      { isActive: false }
    );

    await createAuditLog({
      actorUserId: currentUserId,
      organizationId: activeOrgId,
      action: 'USER_DEACTIVATED',
      entityType: 'User',
      entityId: userId,
      metadata: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
