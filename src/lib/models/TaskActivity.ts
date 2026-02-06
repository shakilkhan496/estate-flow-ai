import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ActivityAction =
  | 'created'
  | 'status_changed'
  | 'assignee_changed'
  | 'priority_changed'
  | 'due_date_changed'
  | 'description_updated'
  | 'comment_added'
  | 'checklist_updated'
  | 'tag_added'
  | 'tag_removed'
  | 'crm_link_added'
  | 'crm_link_removed'
  | 'archived'
  | 'restored';

export interface ITaskActivity extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  action: ActivityAction;
  field: string;
  oldValue: string;
  newValue: string;
  createdAt: Date;
}

const TaskActivitySchema = new Schema<ITaskActivity>(
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
    action: {
      type: String,
      enum: [
        'created', 'status_changed', 'assignee_changed', 'priority_changed',
        'due_date_changed', 'description_updated', 'comment_added',
        'checklist_updated', 'tag_added', 'tag_removed', 'crm_link_added',
        'crm_link_removed', 'archived', 'restored',
      ],
      required: true,
    },
    field: {
      type: String,
      default: '',
    },
    oldValue: {
      type: String,
      default: '',
    },
    newValue: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

TaskActivitySchema.index({ taskId: 1, createdAt: -1 });

const TaskActivity: Model<ITaskActivity> =
  mongoose.models.TaskActivity || mongoose.model<ITaskActivity>('TaskActivity', TaskActivitySchema);

export default TaskActivity;
