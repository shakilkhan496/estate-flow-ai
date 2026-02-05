import { OrgType } from '../models/Role';
import { PermissionScope } from '../models/RolePermission';

export interface PermissionDef {
  key: string;
  description: string;
  group: string;
}

export interface RoleDef {
  name: string;
  key: string;
  orgType: OrgType;
  description: string;
  isSystem: boolean;
}

export interface RolePermissionDef {
  roleKey: string;
  permissionKey: string;
  scope: PermissionScope;
  allowed: boolean;
}

export const DEFAULT_PERMISSIONS: PermissionDef[] = [
  { key: 'ORG:VIEW', description: 'View organization details', group: 'Organization' },
  { key: 'ORG:MANAGE_USERS', description: 'Manage organization users', group: 'Organization' },
  { key: 'ORG:MANAGE_SETTINGS', description: 'Manage organization settings', group: 'Organization' },
  
  { key: 'SUBMISSION:CREATE', description: 'Create new submissions', group: 'Submission' },
  { key: 'SUBMISSION:VIEW', description: 'View submissions', group: 'Submission' },
  { key: 'SUBMISSION:EDIT', description: 'Edit submissions', group: 'Submission' },
  { key: 'SUBMISSION:ASSIGN', description: 'Assign submissions to users', group: 'Submission' },
  { key: 'SUBMISSION:SET_STATUS', description: 'Change submission status', group: 'Submission' },
  { key: 'SUBMISSION:ADD_NOTES', description: 'Add notes to submissions', group: 'Submission' },
  
  { key: 'DOC:UPLOAD', description: 'Upload documents', group: 'Document' },
  { key: 'DOC:VIEW', description: 'View documents', group: 'Document' },
  { key: 'DOC:REQUEST', description: 'Request documents', group: 'Document' },
  { key: 'DOC:DELETE', description: 'Delete documents', group: 'Document' },
  
  { key: 'OFFER:VIEW', description: 'View offers', group: 'Offer' },
  { key: 'OFFER:ISSUE', description: 'Issue new offers', group: 'Offer' },
  { key: 'OFFER:COUNTER', description: 'Counter offers', group: 'Offer' },
  { key: 'OFFER:APPROVE', description: 'Approve offers', group: 'Offer' },
  { key: 'OFFER:DECLINE', description: 'Decline offers', group: 'Offer' },
  { key: 'OFFER:ACCEPT', description: 'Accept offers', group: 'Offer' },
  { key: 'OFFER:WITHDRAW', description: 'Withdraw offers', group: 'Offer' },
  
  { key: 'DEAL:VIEW', description: 'View deals', group: 'Deal' },
  { key: 'DEAL:ADVANCE_STAGE', description: 'Advance deal stages', group: 'Deal' },
  { key: 'DEAL:FUND', description: 'Fund deals', group: 'Deal' },
  { key: 'DEAL:UPDATE_PERFORMANCE', description: 'Update deal performance', group: 'Deal' },
  
  { key: 'COMMISSION:VIEW', description: 'View commissions', group: 'Commission' },
  { key: 'COMMISSION:CALCULATE', description: 'Calculate commissions', group: 'Commission' },
  { key: 'COMMISSION:MARK_PAID', description: 'Mark commissions as paid', group: 'Commission' },
  { key: 'COMMISSION:DISPUTE', description: 'Dispute commissions', group: 'Commission' },
  
  { key: 'AUDIT:VIEW', description: 'View audit logs', group: 'Audit' },
  { key: 'AUDIT:WRITE', description: 'Write audit logs', group: 'Audit' },
  
  { key: 'EXPORT:SUBMISSIONS', description: 'Export submissions', group: 'Export' },
  { key: 'EXPORT:DEALS', description: 'Export deals', group: 'Export' },
  { key: 'EXPORT:FINANCIALS', description: 'Export financial data', group: 'Export' },
  
  { key: 'MESSAGE:SEND', description: 'Send messages', group: 'Message' },
  { key: 'MESSAGE:VIEW', description: 'View messages', group: 'Message' },
  
  { key: 'ROLE:VIEW', description: 'View roles', group: 'Admin' },
  { key: 'ROLE:CREATE', description: 'Create roles', group: 'Admin' },
  { key: 'ROLE:EDIT', description: 'Edit roles', group: 'Admin' },
  { key: 'ROLE:DELETE', description: 'Delete roles', group: 'Admin' },
  { key: 'POLICY:MANAGE', description: 'Manage policy versions', group: 'Admin' },
];

export const DEFAULT_ROLES: RoleDef[] = [
  { name: 'Super Admin', key: 'SUPER_ADMIN', orgType: 'PLATFORM', description: 'Full platform access', isSystem: true },
  { name: 'Platform Support', key: 'PLATFORM_SUPPORT', orgType: 'PLATFORM', description: 'Platform support staff', isSystem: true },
  { name: 'Compliance Auditor', key: 'COMPLIANCE_AUDITOR', orgType: 'PLATFORM', description: 'Compliance and audit access', isSystem: true },
  { name: 'Accounting', key: 'ACCOUNTING', orgType: 'PLATFORM', description: 'Financial operations', isSystem: true },
  
  { name: 'ISO Owner', key: 'ISO_OWNER', orgType: 'ISO', description: 'ISO organization owner', isSystem: true },
  { name: 'ISO Manager', key: 'ISO_MANAGER', orgType: 'ISO', description: 'ISO team manager', isSystem: true },
  { name: 'Senior Broker', key: 'SENIOR_BROKER', orgType: 'ISO', description: 'Senior broker with full deal access', isSystem: true },
  { name: 'Junior Broker', key: 'JUNIOR_BROKER', orgType: 'ISO', description: 'Junior broker with limited access', isSystem: true },
  
  { name: 'Lender Admin', key: 'LENDER_ADMIN', orgType: 'LENDER', description: 'Lender organization admin', isSystem: true },
  { name: 'Underwriter', key: 'UNDERWRITER', orgType: 'LENDER', description: 'Underwriting specialist', isSystem: true },
  { name: 'Funding Desk', key: 'FUNDING_DESK', orgType: 'LENDER', description: 'Funding operations', isSystem: true },
  { name: 'Portfolio Manager', key: 'PORTFOLIO_MANAGER', orgType: 'LENDER', description: 'Portfolio management', isSystem: true },
  
  { name: 'Merchant', key: 'MERCHANT', orgType: 'MERCHANT', description: 'Merchant user', isSystem: true },
  
  { name: 'Closing Agent', key: 'CLOSING_AGENT', orgType: 'ANY', description: 'Deal closing specialist', isSystem: true },
  
  { name: 'System Bot', key: 'SYSTEM_BOT', orgType: 'SYSTEM', description: 'Automated system processes', isSystem: true },
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionDef[] = [
  ...DEFAULT_PERMISSIONS.map(p => ({ roleKey: 'SUPER_ADMIN', permissionKey: p.key, scope: 'GLOBAL' as PermissionScope, allowed: true })),
  
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'ORG:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'SUBMISSION:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'OFFER:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'DEAL:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'DOC:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'MESSAGE:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'PLATFORM_SUPPORT', permissionKey: 'MESSAGE:SEND', scope: 'GLOBAL', allowed: true },
  
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'AUDIT:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'ORG:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'SUBMISSION:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'DEAL:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'DOC:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'COMPLIANCE_AUDITOR', permissionKey: 'OFFER:VIEW', scope: 'GLOBAL', allowed: true },
  
  { roleKey: 'ACCOUNTING', permissionKey: 'DEAL:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'ACCOUNTING', permissionKey: 'COMMISSION:VIEW', scope: 'GLOBAL', allowed: true },
  { roleKey: 'ACCOUNTING', permissionKey: 'COMMISSION:CALCULATE', scope: 'GLOBAL', allowed: true },
  { roleKey: 'ACCOUNTING', permissionKey: 'COMMISSION:MARK_PAID', scope: 'GLOBAL', allowed: true },
  { roleKey: 'ACCOUNTING', permissionKey: 'EXPORT:FINANCIALS', scope: 'GLOBAL', allowed: true },
  { roleKey: 'ACCOUNTING', permissionKey: 'AUDIT:VIEW', scope: 'GLOBAL', allowed: true },
  
  { roleKey: 'ISO_OWNER', permissionKey: 'ORG:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'ORG:MANAGE_USERS', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'ORG:MANAGE_SETTINGS', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:CREATE', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:EDIT', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:ASSIGN', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:SET_STATUS', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'SUBMISSION:ADD_NOTES', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DOC:UPLOAD', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DOC:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DOC:REQUEST', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DOC:DELETE', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'OFFER:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'OFFER:ACCEPT', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'OFFER:COUNTER', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DEAL:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'DEAL:ADVANCE_STAGE', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'COMMISSION:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'EXPORT:SUBMISSIONS', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'EXPORT:DEALS', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'MESSAGE:SEND', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_OWNER', permissionKey: 'MESSAGE:VIEW', scope: 'ORG', allowed: true },
  
  { roleKey: 'ISO_MANAGER', permissionKey: 'ORG:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:CREATE', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:EDIT', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:ASSIGN', scope: 'TEAM', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:SET_STATUS', scope: 'TEAM', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'SUBMISSION:ADD_NOTES', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'DOC:UPLOAD', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'DOC:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'DOC:REQUEST', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'OFFER:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'DEAL:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'MESSAGE:SEND', scope: 'ORG', allowed: true },
  { roleKey: 'ISO_MANAGER', permissionKey: 'MESSAGE:VIEW', scope: 'ORG', allowed: true },
  
  { roleKey: 'SENIOR_BROKER', permissionKey: 'SUBMISSION:CREATE', scope: 'OWN', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'SUBMISSION:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'SUBMISSION:EDIT', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'SUBMISSION:ADD_NOTES', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'DOC:UPLOAD', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'DOC:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'DOC:REQUEST', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'OFFER:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'OFFER:ACCEPT', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'OFFER:COUNTER', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'DEAL:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'COMMISSION:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'MESSAGE:SEND', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'SENIOR_BROKER', permissionKey: 'MESSAGE:VIEW', scope: 'ASSIGNED', allowed: true },
  
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'SUBMISSION:CREATE', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'SUBMISSION:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'SUBMISSION:EDIT', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'SUBMISSION:ADD_NOTES', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'DOC:UPLOAD', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'DOC:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'OFFER:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'DEAL:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'MESSAGE:SEND', scope: 'OWN', allowed: true },
  { roleKey: 'JUNIOR_BROKER', permissionKey: 'MESSAGE:VIEW', scope: 'OWN', allowed: true },
  
  { roleKey: 'LENDER_ADMIN', permissionKey: 'ORG:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'ORG:MANAGE_USERS', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'ORG:MANAGE_SETTINGS', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'SUBMISSION:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'OFFER:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'OFFER:ISSUE', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'OFFER:APPROVE', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'OFFER:DECLINE', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'DEAL:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'DEAL:FUND', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'DOC:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'DOC:REQUEST', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'MESSAGE:SEND', scope: 'ORG', allowed: true },
  { roleKey: 'LENDER_ADMIN', permissionKey: 'MESSAGE:VIEW', scope: 'ORG', allowed: true },
  
  { roleKey: 'UNDERWRITER', permissionKey: 'SUBMISSION:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'UNDERWRITER', permissionKey: 'SUBMISSION:ADD_NOTES', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'UNDERWRITER', permissionKey: 'DOC:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'UNDERWRITER', permissionKey: 'DOC:REQUEST', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'UNDERWRITER', permissionKey: 'OFFER:VIEW', scope: 'ASSIGNED', allowed: true },
  
  { roleKey: 'FUNDING_DESK', permissionKey: 'DEAL:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'DEAL:FUND', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'DOC:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'DOC:REQUEST', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'DOC:UPLOAD', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'MESSAGE:SEND', scope: 'ORG', allowed: true },
  { roleKey: 'FUNDING_DESK', permissionKey: 'MESSAGE:VIEW', scope: 'ORG', allowed: true },
  
  { roleKey: 'PORTFOLIO_MANAGER', permissionKey: 'DEAL:VIEW', scope: 'ORG', allowed: true },
  { roleKey: 'PORTFOLIO_MANAGER', permissionKey: 'DEAL:UPDATE_PERFORMANCE', scope: 'ORG', allowed: true },
  { roleKey: 'PORTFOLIO_MANAGER', permissionKey: 'EXPORT:DEALS', scope: 'ORG', allowed: true },
  
  { roleKey: 'MERCHANT', permissionKey: 'SUBMISSION:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'MERCHANT', permissionKey: 'DOC:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'MERCHANT', permissionKey: 'DOC:UPLOAD', scope: 'OWN', allowed: true },
  { roleKey: 'MERCHANT', permissionKey: 'OFFER:VIEW', scope: 'OWN', allowed: true },
  { roleKey: 'MERCHANT', permissionKey: 'MESSAGE:VIEW', scope: 'OWN', allowed: true },
  
  { roleKey: 'CLOSING_AGENT', permissionKey: 'DEAL:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'CLOSING_AGENT', permissionKey: 'DEAL:ADVANCE_STAGE', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'CLOSING_AGENT', permissionKey: 'DOC:VIEW', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'CLOSING_AGENT', permissionKey: 'DOC:UPLOAD', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'CLOSING_AGENT', permissionKey: 'MESSAGE:SEND', scope: 'ASSIGNED', allowed: true },
  { roleKey: 'CLOSING_AGENT', permissionKey: 'MESSAGE:VIEW', scope: 'ASSIGNED', allowed: true },
];

export const DEFAULT_FIELD_RULES = [
  { roleKey: 'JUNIOR_BROKER', resource: 'Submission', field: 'commissionSplit', access: 'HIDDEN' as const },
  { roleKey: 'JUNIOR_BROKER', resource: 'Submission', field: 'buyRate', access: 'HIDDEN' as const },
  { roleKey: 'JUNIOR_BROKER', resource: 'Submission', field: 'lenderRouting', access: 'READONLY' as const },
  { roleKey: 'JUNIOR_BROKER', resource: 'Deal', field: 'fundingAmount', access: 'READONLY' as const },
  
  { roleKey: 'MERCHANT', resource: 'Submission', field: 'buyRate', access: 'HIDDEN' as const },
  { roleKey: 'MERCHANT', resource: 'Submission', field: 'commissionSplit', access: 'HIDDEN' as const },
  { roleKey: 'MERCHANT', resource: 'Deal', field: 'commission', access: 'HIDDEN' as const },
];
