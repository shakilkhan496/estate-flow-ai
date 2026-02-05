import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type FieldAccess = 'READONLY' | 'HIDDEN' | 'EDITABLE';

export interface IFieldRule extends Document {
  roleId: Types.ObjectId;
  resource: string;
  field: string;
  access: FieldAccess;
  createdAt: Date;
  updatedAt: Date;
}

const FieldRuleSchema = new Schema<IFieldRule>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      trim: true,
    },
    field: {
      type: String,
      required: [true, 'Field is required'],
      trim: true,
    },
    access: {
      type: String,
      enum: ['READONLY', 'HIDDEN', 'EDITABLE'],
      default: 'EDITABLE',
    },
  },
  {
    timestamps: true,
  }
);

FieldRuleSchema.index({ roleId: 1, resource: 1, field: 1 }, { unique: true });
FieldRuleSchema.index({ roleId: 1 });

const FieldRule: Model<IFieldRule> = 
  mongoose.models.FieldRule || mongoose.model<IFieldRule>('FieldRule', FieldRuleSchema);

export default FieldRule;
