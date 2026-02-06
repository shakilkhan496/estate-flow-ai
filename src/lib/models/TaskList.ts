import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITaskList extends Document {
  name: string;
  description: string;
  spaceId: Types.ObjectId;
  folderId: Types.ObjectId | null;
  color: string;
  createdById: Types.ObjectId;
  isArchived: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskListSchema = new Schema<ITaskList>(
  {
    name: {
      type: String,
      required: [true, 'List name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    spaceId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskSpace',
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    color: {
      type: String,
      default: '#06b6d4',
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
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

TaskListSchema.index({ spaceId: 1, isArchived: 1, position: 1 });

const TaskList: Model<ITaskList> =
  mongoose.models.TaskList || mongoose.model<ITaskList>('TaskList', TaskListSchema);

export default TaskList;
