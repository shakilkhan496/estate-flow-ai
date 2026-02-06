import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';

export async function DELETE(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { taskIds } = body;

  // Validate taskIds is a non-empty array
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return NextResponse.json({ error: 'taskIds must be a non-empty array' }, { status: 400 });
  }

  await connectDB();

  const result = await Task.deleteMany({ _id: { $in: taskIds } });

  return NextResponse.json({ success: true, deletedCount: result.deletedCount }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { taskIds, updates } = body;

  // Validate taskIds is a non-empty array
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return NextResponse.json({ error: 'taskIds must be a non-empty array' }, { status: 400 });
  }

  // Validate updates is a non-empty object
  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'updates must be a non-empty object' }, { status: 400 });
  }

  await connectDB();

  const result = await Task.updateMany({ _id: { $in: taskIds } }, { $set: updates });

  return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 });
}
