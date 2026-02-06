import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ICrmLink {
  type: 'lead' | 'merchant' | 'submission' | 'deal' | 'offer' | 'funding' | 'iso' | 'lender' | 'underwriter';
  refId: string;
  label: string;
}

export interface IChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assigneeId?: Types.ObjectId;
}

export interface ITask extends Document {
  title: string;
  description: string;
  spaceId: Types.ObjectId;
  listId: Types.ObjectId;
  statusId: Types.ObjectId;
  priority: TaskPriority;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  assigneeId: Types.ObjectId | null;
  createdById: Types.ObjectId;
  watchers: Types.ObjectId[];
  tags: string[];
  points: number | null;
  timeEstimateMinutes: number | null;
  timeTrackedMinutes: number;
  position: number;
  parentTaskId: Types.ObjectId | null;
  checklist: IChecklistItem[];
  crmLinks: ICrmLink[];
  customFields: Record<string, unknown>;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const CrmLinkSchema = new Schema<ICrmLink>(
  {
    type: {
      type: String,
      enum: ['lead', 'merchant', 'submission', 'deal', 'offer', 'funding', 'iso', 'lender', 'underwriter'],
      required: true,
    },
    refId: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    spaceId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskSpace',
      required: true,
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskList',
      required: true,
    },
    statusId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskStatus',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    startDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    watchers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    points: {
      type: Number,
      default: null,
    },
    timeEstimateMinutes: {
      type: Number,
      default: null,
    },
    timeTrackedMinutes: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
    parentTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    checklist: [ChecklistItemSchema],
    crmLinks: [CrmLinkSchema],
    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ listId: 1, statusId: 1, position: 1 });
TaskSchema.index({ spaceId: 1, isArchived: 1 });
TaskSchema.index({ assigneeId: 1, isArchived: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ parentTaskId: 1 });
TaskSchema.index({ 'crmLinks.type': 1, 'crmLinks.refId': 1 });

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
