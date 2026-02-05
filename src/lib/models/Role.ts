import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrgType = 'PLATFORM' | 'ISO' | 'LENDER' | 'MERCHANT' | 'ANY' | 'SYSTEM';

export interface IRole extends Document {
  name: string;
  key: string;
  orgType: OrgType;
  description: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Role key is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    orgType: {
      type: String,
      enum: ['PLATFORM', 'ISO', 'LENDER', 'MERCHANT', 'ANY', 'SYSTEM'],
      required: [true, 'Organization type is required'],
    },
    description: {
      type: String,
      default: '',
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

RoleSchema.index({ key: 1 }, { unique: true });
RoleSchema.index({ orgType: 1 });

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
