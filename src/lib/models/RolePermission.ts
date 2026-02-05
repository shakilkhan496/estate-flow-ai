import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type PermissionScope = 'OWN' | 'ASSIGNED' | 'TEAM' | 'ORG' | 'GLOBAL';

export interface IRolePermission extends Document {
  roleId: Types.ObjectId;
  permissionId: Types.ObjectId;
  scope: PermissionScope;
  allowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RolePermissionSchema = new Schema<IRolePermission>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
    scope: {
      type: String,
      enum: ['OWN', 'ASSIGNED', 'TEAM', 'ORG', 'GLOBAL'],
      default: 'OWN',
    },
    allowed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });
RolePermissionSchema.index({ roleId: 1 });

const RolePermission: Model<IRolePermission> = 
  mongoose.models.RolePermission || mongoose.model<IRolePermission>('RolePermission', RolePermissionSchema);

export default RolePermission;
