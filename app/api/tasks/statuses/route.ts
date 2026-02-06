import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskStatus from '@/lib/models/TaskStatus';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');

  if (!listId) {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 });
  }

  await connectDB();
  const statuses = await TaskStatus.find({ listId }).sort({ position: 1 });

  return NextResponse.json({ statuses });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, color, type, listId } = body;

  if (!name?.trim() || !listId) {
    return NextResponse.json({ error: 'Name and listId are required' }, { status: 400 });
  }

  await connectDB();

  const maxPos = await TaskStatus.findOne({ listId }).sort({ position: -1 });
  const position = (maxPos?.position ?? -1) + 1;

  const status = await TaskStatus.create({
    name: name.trim(),
    color: color || '#64748b',
    type: type || 'open',
    listId,
    position,
  });

  return NextResponse.json({ status }, { status: 201 });
}
