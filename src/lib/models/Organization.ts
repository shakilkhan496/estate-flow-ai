import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrganizationType = 'PLATFORM' | 'ISO' | 'LENDER' | 'MERCHANT';

export interface IOrganization extends Document {
  name: string;
  type: OrganizationType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['PLATFORM', 'ISO', 'LENDER', 'MERCHANT'],
      required: [true, 'Organization type is required'],
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

OrganizationSchema.index({ type: 1 });
OrganizationSchema.index({ name: 1 });

const Organization: Model<IOrganization> = 
  mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;
