import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskActivity from '@/lib/models/TaskActivity';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const activities = await TaskActivity.find({ taskId: id })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ activities });
}
