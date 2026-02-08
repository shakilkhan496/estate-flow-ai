import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskList from '@/lib/models/TaskList';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['admin', 'manager'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'Only managers and admins can edit lists' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();
  const list = await TaskList.findByIdAndUpdate(id, body, { new: true });
  if (!list) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 });
  }

  return NextResponse.json({ list });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['admin', 'manager'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  await TaskList.findByIdAndUpdate(id, { isArchived: true });

  return NextResponse.json({ success: true });
}
