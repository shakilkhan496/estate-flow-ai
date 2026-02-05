import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PolicyVersion from '@/lib/models/PolicyVersion';
import PolicySnapshot from '@/lib/models/PolicySnapshot';
import Role from '@/lib/models/Role';
import RolePermission from '@/lib/models/RolePermission';
import FieldRule from '@/lib/models/FieldRule';
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
    const organizationId = searchParams.get('organizationId');

    const query: Record<string, unknown> = {};
    if (organizationId) {
      query.organizationId = organizationId;
    } else {
      query.organizationId = null;
    }

    const currentPolicy = await PolicyVersion.findOne(query)
      .sort({ versionNumber: -1 })
      .populate('createdByUserId', 'name email');

    const policyHistory = await PolicyVersion.find(query)
      .sort({ versionNumber: -1 })
      .limit(10)
      .populate('createdByUserId', 'name email');

    return NextResponse.json({ currentPolicy, policyHistory });
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
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

    const permResult = await hasPermission(userId, activeOrgId, 'POLICY:MANAGE');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { organizationId } = body;

    const query: Record<string, unknown> = {};
    if (organizationId) {
      query.organizationId = organizationId;
    } else {
      query.organizationId = null;
    }

    const latestPolicy = await PolicyVersion.findOne(query)
      .sort({ versionNumber: -1 });

    const newVersionNumber = latestPolicy ? latestPolicy.versionNumber + 1 : 1;

    const policyVersion = await PolicyVersion.create({
      organizationId: organizationId || null,
      status: 'DRAFT',
      versionNumber: newVersionNumber,
      createdByUserId: userId,
    });

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'POLICY_DRAFT_CREATED',
      entityType: 'PolicyVersion',
      entityId: policyVersion._id.toString(),
      metadata: { versionNumber: newVersionNumber },
    });

    return NextResponse.json({ policyVersion }, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}
