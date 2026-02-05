import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrganizationMember extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  roleId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

OrganizationMemberSchema.index({ userId: 1, organizationId: 1 }, { unique: true });
OrganizationMemberSchema.index({ organizationId: 1 });
OrganizationMemberSchema.index({ userId: 1 });

const OrganizationMember: Model<IOrganizationMember> = 
  mongoose.models.OrganizationMember || mongoose.model<IOrganizationMember>('OrganizationMember', OrganizationMemberSchema);

export default OrganizationMember;
