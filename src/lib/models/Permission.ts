import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPermission extends Document {
  key: string;
  description: string;
  group: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    key: {
      type: String,
      required: [true, 'Permission key is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Permission description is required'],
    },
    group: {
      type: String,
      required: [true, 'Permission group is required'],
    },
  },
  {
    timestamps: true,
  }
);

PermissionSchema.index({ group: 1 });

const Permission: Model<IPermission> = 
  mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);

export default Permission;
