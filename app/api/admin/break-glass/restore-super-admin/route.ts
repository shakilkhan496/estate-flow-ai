import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Organization from '@/lib/models/Organization';
import OrganizationMember from '@/lib/models/OrganizationMember';
import Role from '@/lib/models/Role';
import { createAuditLog } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const breakGlassToken = process.env.BREAK_GLASS_TOKEN;
    
    if (!breakGlassToken) {
      return NextResponse.json({ 
        error: 'Break-glass endpoint not configured' 
      }, { status: 503 });
    }

    const authHeader = request.headers.get('x-break-glass-token');
    
    if (authHeader !== breakGlassToken) {
      return NextResponse.json({ 
        error: 'Invalid break-glass token' 
      }, { status: 403 });
    }

    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized - must be logged in' }, { status: 401 });
    }

    await dbConnect();

    const userId = auth.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const platformOrg = await Organization.findOne({ type: 'PLATFORM' });
    if (!platformOrg) {
      return NextResponse.json({ 
        error: 'Platform organization not found. Database may need seeding.' 
      }, { status: 404 });
    }

    const superAdminRole = await Role.findOne({ key: 'SUPER_ADMIN' });
    if (!superAdminRole) {
      return NextResponse.json({ 
        error: 'SUPER_ADMIN role not found. Database may need seeding.' 
      }, { status: 404 });
    }

    let membership = await OrganizationMember.findOne({
      userId: user._id,
      organizationId: platformOrg._id,
    });

    if (membership) {
      membership.roleId = superAdminRole._id;
      membership.isActive = true;
      await membership.save();
    } else {
      membership = await OrganizationMember.create({
        userId: user._id,
        organizationId: platformOrg._id,
        roleId: superAdminRole._id,
        isActive: true,
      });
    }

    user.activeOrganizationId = platformOrg._id;
    await user.save();

    await createAuditLog({
      actorUserId: userId,
      organizationId: platformOrg._id,
      action: 'BREAK_GLASS_SUPER_ADMIN_RESTORE',
      entityType: 'OrganizationMember',
      entityId: membership._id.toString(),
      metadata: { 
        userEmail: user.email,
        emergency: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Super Admin access restored',
      organizationId: platformOrg._id,
    });
  } catch (error) {
    console.error('Break-glass error:', error);
    return NextResponse.json({ error: 'Break-glass operation failed' }, { status: 500 });
  }
}
