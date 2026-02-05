import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type PolicyStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IPolicyVersion extends Document {
  organizationId: Types.ObjectId | null;
  status: PolicyStatus;
  versionNumber: number;
  publishedAt: Date | null;
  createdByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PolicyVersionSchema = new Schema<IPolicyVersion>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    versionNumber: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PolicyVersionSchema.index({ organizationId: 1, status: 1 });
PolicyVersionSchema.index({ organizationId: 1, versionNumber: 1 });

const PolicyVersion: Model<IPolicyVersion> = 
  mongoose.models.PolicyVersion || mongoose.model<IPolicyVersion>('PolicyVersion', PolicyVersionSchema);

export default PolicyVersion;
