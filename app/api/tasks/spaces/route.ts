import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskSpace from '@/lib/models/TaskSpace';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const spaces = await TaskSpace.find({ isArchived: false }).sort({ position: 1 });
  return NextResponse.json({ spaces });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['admin', 'manager'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'Only managers and admins can create spaces' }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, color, icon } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Space name is required' }, { status: 400 });
  }

  await connectDB();

  const maxPos = await TaskSpace.findOne({ isArchived: false }).sort({ position: -1 });
  const position = (maxPos?.position ?? -1) + 1;

  const space = await TaskSpace.create({
    name: name.trim(),
    description: description || '',
    color: color || '#06b6d4',
    icon: icon || 'folder',
    createdById: auth.user.id,
    position,
  });

  return NextResponse.json({ space }, { status: 201 });
}
