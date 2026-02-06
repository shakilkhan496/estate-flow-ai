import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TaskSpace from '@/lib/models/TaskSpace';
import TaskList from '@/lib/models/TaskList';
import TaskStatus from '@/lib/models/TaskStatus';
import Task from '@/lib/models/Task';

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  await connectDB();

  const existingSpaces = await TaskSpace.countDocuments({ isArchived: false });
  if (existingSpaces > 0) {
    return NextResponse.json({ message: 'Task data already exists' });
  }

  const spaces = await TaskSpace.insertMany([
    { name: 'Sales Ops', description: 'Sales operations and lead management', color: '#06b6d4', icon: 'trending-up', createdById: auth.user.id, position: 0 },
    { name: 'Underwriting', description: 'Deal underwriting and review', color: '#8b5cf6', icon: 'shield', createdById: auth.user.id, position: 1 },
    { name: 'Funding & Collections', description: 'Funding management and collections', color: '#22c55e', icon: 'dollar-sign', createdById: auth.user.id, position: 2 },
  ]);

  const lists = await TaskList.insertMany([
    { name: 'Lead Intake', spaceId: spaces[0]._id, color: '#06b6d4', createdById: auth.user.id, position: 0 },
    { name: 'Submission Packaging', spaceId: spaces[0]._id, color: '#f59e0b', createdById: auth.user.id, position: 1 },
    { name: 'Underwriting Review', spaceId: spaces[1]._id, color: '#8b5cf6', createdById: auth.user.id, position: 0 },
    { name: 'Offer Follow-up', spaceId: spaces[1]._id, color: '#ec4899', createdById: auth.user.id, position: 1 },
    { name: 'Funding & Closing', spaceId: spaces[2]._id, color: '#22c55e', createdById: auth.user.id, position: 0 },
    { name: 'Renewals', spaceId: spaces[2]._id, color: '#f97316', createdById: auth.user.id, position: 1 },
  ]);

  const statusSets = [];
  for (const list of lists) {
    const statuses = await TaskStatus.insertMany([
      { name: 'To Do', color: '#64748b', type: 'open', listId: list._id, position: 0 },
      { name: 'In Progress', color: '#f59e0b', type: 'in_progress', listId: list._id, position: 1 },
      { name: 'Review', color: '#8b5cf6', type: 'in_progress', listId: list._id, position: 2 },
      { name: 'Blocked', color: '#ef4444', type: 'blocked', listId: list._id, position: 3 },
      { name: 'Done', color: '#22c55e', type: 'done', listId: list._id, position: 4 },
    ]);
    statusSets.push(statuses);
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  await Task.insertMany([
    {
      title: 'Review new merchant application - ABC Corp',
      description: 'New lead came in via referral. Review application docs and verify business info.',
      spaceId: spaces[0]._id, listId: lists[0]._id, statusId: statusSets[0][0]._id,
      priority: 'high', dueDate: tomorrow, createdById: auth.user.id, assigneeId: auth.user.id,
      tags: ['new-lead', 'referral'], position: 0,
      checklist: [
        { id: '1', text: 'Verify business name and EIN', completed: false },
        { id: '2', text: 'Check credit score', completed: false },
        { id: '3', text: 'Review bank statements (3 months)', completed: false },
        { id: '4', text: 'Confirm daily revenue average', completed: false },
      ],
    },
    {
      title: 'Follow up with XYZ Industries lead',
      description: 'Called twice, no response. Send follow-up email.',
      spaceId: spaces[0]._id, listId: lists[0]._id, statusId: statusSets[0][1]._id,
      priority: 'medium', dueDate: now, createdById: auth.user.id,
      tags: ['follow-up'], position: 1,
    },
    {
      title: 'Collect missing bank statements - Metro Retail',
      description: 'Merchant needs to provide 3 additional months of bank statements.',
      spaceId: spaces[0]._id, listId: lists[1]._id, statusId: statusSets[1][0]._id,
      priority: 'urgent', dueDate: tomorrow, createdById: auth.user.id, assigneeId: auth.user.id,
      tags: ['missing-docs'], position: 0,
      checklist: [
        { id: '1', text: 'Request statements from merchant', completed: true },
        { id: '2', text: 'Verify statement authenticity', completed: false },
        { id: '3', text: 'Upload to CRM', completed: false },
      ],
    },
    {
      title: 'Prepare submission package - QuickServe LLC',
      description: 'All docs collected. Package for funder submission.',
      spaceId: spaces[0]._id, listId: lists[1]._id, statusId: statusSets[1][1]._id,
      priority: 'high', dueDate: tomorrow, createdById: auth.user.id,
      tags: ['submission-ready'], position: 1,
    },
    {
      title: 'Underwrite Deal #1042 - FastFood Co',
      description: 'Review financials, check industry risk, calculate offer terms.',
      spaceId: spaces[1]._id, listId: lists[2]._id, statusId: statusSets[2][0]._id,
      priority: 'high', dueDate: nextWeek, createdById: auth.user.id, assigneeId: auth.user.id,
      tags: ['underwriting', 'deal-review'], position: 0,
    },
    {
      title: 'Risk assessment - BrightClean Services',
      description: 'Flagged for high NSF count. Needs senior review.',
      spaceId: spaces[1]._id, listId: lists[2]._id, statusId: statusSets[2][3]._id,
      priority: 'urgent', dueDate: now, createdById: auth.user.id,
      tags: ['risk', 'nsf-flag'], position: 1,
    },
    {
      title: 'Send offer to DataFlow Inc - Deal #1038',
      description: 'Approved offer: $75K, 1.35 factor, 12 months. Call merchant.',
      spaceId: spaces[1]._id, listId: lists[3]._id, statusId: statusSets[3][0]._id,
      priority: 'medium', dueDate: tomorrow, createdById: auth.user.id,
      tags: ['offer-pending'], position: 0,
    },
    {
      title: 'Process funding for CityWide Plumbing',
      description: 'Contracts signed. Wire $50K to merchant account.',
      spaceId: spaces[2]._id, listId: lists[4]._id, statusId: statusSets[4][1]._id,
      priority: 'urgent', dueDate: now, createdById: auth.user.id, assigneeId: auth.user.id,
      tags: ['funding', 'wire-pending'], position: 0,
    },
    {
      title: 'Renewal outreach - GreenLeaf Landscaping',
      description: '80% paid off. Schedule renewal discussion.',
      spaceId: spaces[2]._id, listId: lists[5]._id, statusId: statusSets[5][0]._id,
      priority: 'low', dueDate: nextWeek, createdById: auth.user.id,
      tags: ['renewal', 'outreach'], position: 0,
    },
  ]);

  return NextResponse.json({ message: 'Task module seeded successfully' }, { status: 201 });
}
