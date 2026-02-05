import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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
    const roleId = searchParams.get('roleId');
    const resource = searchParams.get('resource');

    const query: Record<string, unknown> = {};
    if (roleId) query.roleId = roleId;
    if (resource) query.resource = resource;

    const fieldRules = await FieldRule.find(query)
      .populate('roleId', 'name key')
      .sort({ resource: 1, field: 1 });

    return NextResponse.json({ fieldRules });
  } catch (error) {
    console.error('Error fetching field rules:', error);
    return NextResponse.json({ error: 'Failed to fetch field rules' }, { status: 500 });
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

    const permResult = await hasPermission(userId, activeOrgId, 'ROLE:EDIT');
    const isSuper = await isSuperAdmin(userId);
    
    if (!permResult.allowed && !isSuper) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { roleId, resource, field, access } = body;

    if (!roleId || !resource || !field || !access) {
      return NextResponse.json({ 
        error: 'roleId, resource, field, and access are required' 
      }, { status: 400 });
    }

    let fieldRule = await FieldRule.findOne({ roleId, resource, field });

    if (fieldRule) {
      fieldRule.access = access;
      await fieldRule.save();
    } else {
      fieldRule = await FieldRule.create({ roleId, resource, field, access });
    }

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'FIELD_RULE_UPDATED',
      entityType: 'FieldRule',
      entityId: fieldRule._id.toString(),
      metadata: { roleId, resource, field, access },
    });

    return NextResponse.json({ fieldRule });
  } catch (error) {
    console.error('Error creating field rule:', error);
    return NextResponse.json({ error: 'Failed to create field rule' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Field rule ID is required' }, { status: 400 });
    }

    const fieldRule = await FieldRule.findByIdAndDelete(id);

    if (!fieldRule) {
      return NextResponse.json({ error: 'Field rule not found' }, { status: 404 });
    }

    await createAuditLog({
      actorUserId: userId,
      organizationId: activeOrgId,
      action: 'FIELD_RULE_DELETED',
      entityType: 'FieldRule',
      entityId: id,
      metadata: { roleId: fieldRule.roleId, resource: fieldRule.resource, field: fieldRule.field },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting field rule:', error);
    return NextResponse.json({ error: 'Failed to delete field rule' }, { status: 500 });
  }
}
