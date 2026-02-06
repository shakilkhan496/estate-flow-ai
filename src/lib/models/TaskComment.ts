import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITaskComment extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  parentCommentId: Types.ObjectId | null;
  mentions: Types.ObjectId[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskCommentSchema = new Schema<ITaskComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskComment',
      default: null,
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TaskCommentSchema.index({ taskId: 1, createdAt: -1 });

const TaskComment: Model<ITaskComment> =
  mongoose.models.TaskComment || mongoose.model<ITaskComment>('TaskComment', TaskCommentSchema);

export default TaskComment;
