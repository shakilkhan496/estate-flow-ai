import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskComment from '@/lib/models/TaskComment';
import TaskActivity from '@/lib/models/TaskActivity';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const comments = await TaskComment.find({ taskId: id })
    .populate('userId', 'name email')
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { content, parentCommentId, mentions } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
  }

  await connectDB();

  const comment = await TaskComment.create({
    taskId: id,
    userId: auth.user.id,
    content: content.trim(),
    parentCommentId: parentCommentId || null,
    mentions: mentions || [],
  });

  await TaskActivity.create({
    taskId: id,
    userId: auth.user.id,
    action: 'comment_added',
    field: 'comment',
    newValue: content.trim().substring(0, 100),
  });

  const populated = await TaskComment.findById(comment._id)
    .populate('userId', 'name email')
    .lean();

  return NextResponse.json({ comment: populated }, { status: 201 });
}
