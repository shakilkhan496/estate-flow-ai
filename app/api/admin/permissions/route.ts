import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Permission from '@/lib/models/Permission';
import RolePermission from '@/lib/models/RolePermission';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');

    const query: Record<string, unknown> = {};
    if (group) {
      query.group = group;
    }

    const permissions = await Permission.find(query).sort({ group: 1, key: 1 });

    const groups = await Permission.distinct('group');

    return NextResponse.json({ permissions, groups });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
