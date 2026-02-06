import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import TaskActivity from '@/lib/models/TaskActivity';
import TaskStatus from '@/lib/models/TaskStatus';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const task = await Task.findById(id)
    .populate('assigneeId', 'name email')
    .populate('createdById', 'name email')
    .populate('statusId', 'name color type')
    .populate('watchers', 'name email')
    .lean();

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const subtasks = await Task.find({ parentTaskId: id, isArchived: false })
    .populate('assigneeId', 'name email')
    .populate('statusId', 'name color type')
    .sort({ position: 1 })
    .lean();

  return NextResponse.json({ task, subtasks });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();

  const existingTask = await Task.findById(id);
  if (!existingTask) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const activities: Array<{ taskId: string; userId: string; action: string; field: string; oldValue: string; newValue: string }> = [];

  if (body.statusId && body.statusId !== existingTask.statusId?.toString()) {
    const oldStatus = await TaskStatus.findById(existingTask.statusId);
    const newStatus = await TaskStatus.findById(body.statusId);
    activities.push({
      taskId: id,
      userId: auth.user.id,
      action: 'status_changed',
      field: 'status',
      oldValue: oldStatus?.name || '',
      newValue: newStatus?.name || '',
    });

    if (newStatus?.type === 'done' && !existingTask.completedAt) {
      body.completedAt = new Date();
    } else if (newStatus?.type !== 'done') {
      body.completedAt = null;
    }
  }

  if (body.assigneeId !== undefined && body.assigneeId !== existingTask.assigneeId?.toString()) {
    activities.push({
      taskId: id,
      userId: auth.user.id,
      action: 'assignee_changed',
      field: 'assignee',
      oldValue: existingTask.assigneeId?.toString() || '',
      newValue: body.assigneeId || '',
    });
  }

  if (body.priority && body.priority !== existingTask.priority) {
    activities.push({
      taskId: id,
      userId: auth.user.id,
      action: 'priority_changed',
      field: 'priority',
      oldValue: existingTask.priority,
      newValue: body.priority,
    });
  }

  if (body.dueDate !== undefined) {
    activities.push({
      taskId: id,
      userId: auth.user.id,
      action: 'due_date_changed',
      field: 'dueDate',
      oldValue: existingTask.dueDate?.toISOString() || '',
      newValue: body.dueDate || '',
    });
  }

  const task = await Task.findByIdAndUpdate(id, body, { new: true })
    .populate('assigneeId', 'name email')
    .populate('createdById', 'name email')
    .populate('statusId', 'name color type')
    .lean();

  if (activities.length > 0) {
    await TaskActivity.insertMany(activities);
  }

  return NextResponse.json({ task });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  await Task.findByIdAndUpdate(id, { isArchived: true });
  await Task.updateMany({ parentTaskId: id }, { isArchived: true });

  return NextResponse.json({ success: true });
}
