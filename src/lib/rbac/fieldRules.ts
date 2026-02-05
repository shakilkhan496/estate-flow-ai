import { Types } from 'mongoose';
import dbConnect from '../mongodb';
import FieldRule, { FieldAccess } from '../models/FieldRule';
import OrganizationMember from '../models/OrganizationMember';

export interface FieldRuleResult {
  field: string;
  access: FieldAccess;
}

export async function getFieldRules(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId,
  resource: string
): Promise<FieldRuleResult[]> {
  await dbConnect();

  const membership = await OrganizationMember.findOne({
    userId: new Types.ObjectId(userId.toString()),
    organizationId: new Types.ObjectId(activeOrgId.toString()),
    isActive: true,
  });

  if (!membership) {
    return [];
  }

  const rules = await FieldRule.find({
    roleId: membership.roleId,
    resource,
  });

  return rules.map(r => ({
    field: r.field,
    access: r.access,
  }));
}

export async function applyFieldRules(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId,
  resource: string,
  incomingData: Record<string, unknown>,
  isUpdate: boolean = false
): Promise<{ data: Record<string, unknown>; violations: string[] }> {
  const rules = await getFieldRules(userId, activeOrgId, resource);
  const violations: string[] = [];
  const filteredData = { ...incomingData };

  for (const rule of rules) {
    if (rule.access === 'HIDDEN') {
      if (rule.field in filteredData) {
        violations.push(`Field "${rule.field}" is hidden and cannot be accessed`);
        delete filteredData[rule.field];
      }
    } else if (rule.access === 'READONLY') {
      if (isUpdate && rule.field in filteredData) {
        violations.push(`Field "${rule.field}" is read-only and cannot be modified`);
        delete filteredData[rule.field];
      }
    }
  }

  return { data: filteredData, violations };
}

export async function filterReadFields(
  userId: string | Types.ObjectId,
  activeOrgId: string | Types.ObjectId,
  resource: string,
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const rules = await getFieldRules(userId, activeOrgId, resource);
  const filteredData = { ...data };

  for (const rule of rules) {
    if (rule.access === 'HIDDEN') {
      delete filteredData[rule.field];
    }
  }

  return filteredData;
}

export async function getFieldRulesForRole(
  roleId: string | Types.ObjectId,
  resource?: string
): Promise<FieldRuleResult[]> {
  await dbConnect();

  const query: Record<string, unknown> = { roleId: new Types.ObjectId(roleId.toString()) };
  if (resource) {
    query.resource = resource;
  }

  const rules = await FieldRule.find(query);

  return rules.map(r => ({
    field: r.field,
    access: r.access,
  }));
}
