import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPolicySnapshot extends Document {
  policyVersionId: Types.ObjectId;
  snapshotJson: Record<string, unknown>;
  createdAt: Date;
}

const PolicySnapshotSchema = new Schema<IPolicySnapshot>(
  {
    policyVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'PolicyVersion',
      required: true,
    },
    snapshotJson: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

PolicySnapshotSchema.index({ policyVersionId: 1 });

const PolicySnapshot: Model<IPolicySnapshot> = 
  mongoose.models.PolicySnapshot || mongoose.model<IPolicySnapshot>('PolicySnapshot', PolicySnapshotSchema);

export default PolicySnapshot;
