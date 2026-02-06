import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITaskSpace extends Document {
  name: string;
  description: string;
  color: string;
  icon: string;
  createdById: Types.ObjectId;
  isArchived: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSpaceSchema = new Schema<ITaskSpace>(
  {
    name: {
      type: String,
      required: [true, 'Space name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '#06b6d4',
    },
    icon: {
      type: String,
      default: 'folder',
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

TaskSpaceSchema.index({ isArchived: 1, position: 1 });

const TaskSpace: Model<ITaskSpace> =
  mongoose.models.TaskSpace || mongoose.model<ITaskSpace>('TaskSpace', TaskSpaceSchema);

export default TaskSpace;
