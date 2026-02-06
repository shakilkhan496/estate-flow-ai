import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskList from '@/lib/models/TaskList';
import TaskStatus from '@/lib/models/TaskStatus';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get('spaceId');

  await connectDB();

  const filter: Record<string, unknown> = { isArchived: false };
  if (spaceId) filter.spaceId = spaceId;

  const lists = await TaskList.find(filter).sort({ position: 1 });
  return NextResponse.json({ lists });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['admin', 'manager'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'Only managers and admins can create lists' }, { status: 403 });
  }

  const body = await request.json();
  const { name, spaceId, description, color } = body;

  if (!name?.trim() || !spaceId) {
    return NextResponse.json({ error: 'Name and spaceId are required' }, { status: 400 });
  }

  await connectDB();

  const maxPos = await TaskList.findOne({ spaceId, isArchived: false }).sort({ position: -1 });
  const position = (maxPos?.position ?? -1) + 1;

  const list = await TaskList.create({
    name: name.trim(),
    description: description || '',
    spaceId,
    color: color || '#06b6d4',
    createdById: auth.user.id,
    position,
  });

  const defaultStatuses = [
    { name: 'To Do', color: '#64748b', type: 'open', position: 0 },
    { name: 'In Progress', color: '#f59e0b', type: 'in_progress', position: 1 },
    { name: 'Review', color: '#8b5cf6', type: 'in_progress', position: 2 },
    { name: 'Blocked', color: '#ef4444', type: 'blocked', position: 3 },
    { name: 'Done', color: '#22c55e', type: 'done', position: 4 },
  ];

  await TaskStatus.insertMany(
    defaultStatuses.map((s) => ({ ...s, listId: list._id }))
  );

  return NextResponse.json({ list }, { status: 201 });
}
