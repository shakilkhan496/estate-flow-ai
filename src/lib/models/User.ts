import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'broker' | 'user';
  isActive: boolean;
  activeOrganizationId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'broker', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    activeOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
