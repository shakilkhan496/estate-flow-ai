import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type StatusType = 'open' | 'in_progress' | 'blocked' | 'done';

export interface ITaskStatus extends Document {
  name: string;
  color: string;
  type: StatusType;
  listId: Types.ObjectId;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskStatusSchema = new Schema<ITaskStatus>(
  {
    name: {
      type: String,
      required: [true, 'Status name is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '#64748b',
    },
    type: {
      type: String,
      enum: ['open', 'in_progress', 'blocked', 'done'],
      default: 'open',
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskList',
      required: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

TaskStatusSchema.index({ listId: 1, position: 1 });

const TaskStatus: Model<ITaskStatus> =
  mongoose.models.TaskStatus || mongoose.model<ITaskStatus>('TaskStatus', TaskStatusSchema);

export default TaskStatus;
