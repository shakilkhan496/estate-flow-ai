import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskSpace from '@/lib/models/TaskSpace';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['admin', 'manager'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();
  const space = await TaskSpace.findByIdAndUpdate(id, body, { new: true });
  if (!space) {
    return NextResponse.json({ error: 'Space not found' }, { status: 404 });
  }

  return NextResponse.json({ space });
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
  await TaskSpace.findByIdAndUpdate(id, { isArchived: true });

  return NextResponse.json({ success: true });
}
