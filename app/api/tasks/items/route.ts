import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import TaskActivity from '@/lib/models/TaskActivity';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');
  const spaceId = searchParams.get('spaceId');
  const assigneeId = searchParams.get('assigneeId');
  const statusId = searchParams.get('statusId');
  const priority = searchParams.get('priority');
  const myTasks = searchParams.get('myTasks');
  const search = searchParams.get('search');
  const parentTaskId = searchParams.get('parentTaskId');
  const dueBefore = searchParams.get('dueBefore');
  const dueAfter = searchParams.get('dueAfter');

  await connectDB();

  const filter: Record<string, unknown> = { isArchived: false };

  if (listId) filter.listId = listId;
  if (spaceId) filter.spaceId = spaceId;
  if (assigneeId) filter.assigneeId = assigneeId;
  if (statusId) filter.statusId = statusId;
  if (priority) filter.priority = priority;
  if (myTasks === 'true') filter.assigneeId = auth.user.id;
  if (parentTaskId) filter.parentTaskId = parentTaskId;
  else if (!parentTaskId) filter.parentTaskId = null;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (dueBefore || dueAfter) {
    filter.dueDate = {};
    if (dueBefore) (filter.dueDate as Record<string, unknown>).$lte = new Date(dueBefore);
    if (dueAfter) (filter.dueDate as Record<string, unknown>).$gte = new Date(dueAfter);
  }

  const tasks = await Task.find(filter)
    .populate('assigneeId', 'name email')
    .populate('createdById', 'name email')
    .populate('statusId', 'name color type')
    .sort({ position: 1 })
    .lean();

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, listId, spaceId, statusId, description, priority, dueDate, startDate, assigneeId, tags, parentTaskId, crmLinks } = body;

  if (!title?.trim() || !listId || !spaceId || !statusId) {
    return NextResponse.json({ error: 'Title, listId, spaceId, and statusId are required' }, { status: 400 });
  }

  await connectDB();

  const maxPos = await Task.findOne({ listId, statusId, parentTaskId: parentTaskId || null, isArchived: false })
    .sort({ position: -1 });
  const position = (maxPos?.position ?? -1) + 1;

  const task = await Task.create({
    title: title.trim(),
    description: description || '',
    listId,
    spaceId,
    statusId,
    priority: priority || 'medium',
    dueDate: dueDate || null,
    startDate: startDate || null,
    assigneeId: assigneeId || null,
    createdById: auth.user.id,
    tags: tags || [],
    parentTaskId: parentTaskId || null,
    crmLinks: crmLinks || [],
    position,
  });

  await TaskActivity.create({
    taskId: task._id,
    userId: auth.user.id,
    action: 'created',
    field: 'task',
    newValue: title.trim(),
  });

  const populated = await Task.findById(task._id)
    .populate('assigneeId', 'name email')
    .populate('createdById', 'name email')
    .populate('statusId', 'name color type')
    .lean();

  return NextResponse.json({ task: populated }, { status: 201 });
}
