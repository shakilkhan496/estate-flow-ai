import { Types } from 'mongoose';
import dbConnect from '../mongodb';
import AuditLog from '../models/AuditLog';

export interface AuditLogEntry {
  actorUserId: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  await dbConnect();

  await AuditLog.create({
    actorUserId: new Types.ObjectId(entry.actorUserId.toString()),
    organizationId: entry.organizationId 
      ? new Types.ObjectId(entry.organizationId.toString()) 
      : null,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    metadata: entry.metadata || {},
  });
}

export async function getAuditLogs(options: {
  organizationId?: string | Types.ObjectId;
  actorUserId?: string | Types.ObjectId;
  entityType?: string;
  entityId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  await dbConnect();

  const query: Record<string, unknown> = {};

  if (options.organizationId) {
    query.organizationId = new Types.ObjectId(options.organizationId.toString());
  }
  if (options.actorUserId) {
    query.actorUserId = new Types.ObjectId(options.actorUserId.toString());
  }
  if (options.entityType) {
    query.entityType = options.entityType;
  }
  if (options.entityId) {
    query.entityId = options.entityId;
  }

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip(options.offset || 0)
    .limit(options.limit || 50)
    .populate('actorUserId', 'name email')
    .lean();

  return {
    logs: logs as unknown as AuditLogEntry[],
    total,
  };
}
