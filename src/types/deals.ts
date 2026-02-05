export interface Owner {
  id: string;
  name: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  homeAddress: string;
  percentOwned: number;
}

export interface StageTransition {
  fromStage: string;
  toStage: string;
  timestamp: string;
}

export interface Deal {
  id: number;
  dealId: string;
  company: string;
  dba: string;
  status: string;
  flags: string[];
  owner: string;
  phone: string;
  email: string;
  products: string;
  notes: string;
  originators: string;
  closers: string;
  dateCreated: string;
  dateUpdated: string;
  gurl: number;
  maxOffer: number | null;
  monthlyRev: number | null;
  originator: string;
  closer: string;
  owners: Owner[];
  lastActivity: string;
  stageHistory: StageTransition[];
}

export interface DealImport {
  dealId?: string;
  company?: string;
  dba?: string;
  status?: string;
  flags?: string[];
  owner?: string;
  phone?: string;
  email?: string;
  products?: string;
  notes?: string;
  originators?: string;
  closers?: string;
  dateCreated?: string;
  dateUpdated?: string;
  gurl?: number;
  maxOffer?: number | null;
  monthlyRev?: number | null;
  originator?: string;
  closer?: string;
}

export interface ImportHistoryEntry {
  id: string;
  filename: string;
  importedAt: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  duplicatesSkipped: number;
}

export function convertImportToDeal(importData: DealImport, index: number): Deal {
  return {
    id: Date.now() + index,
    dealId: importData.dealId || `IMP-${Date.now()}-${index}`,
    company: importData.company || '',
    dba: importData.dba || '',
    status: importData.status || 'New Application',
    flags: importData.flags || [],
    owner: importData.owner || '',
    phone: importData.phone || '',
    email: importData.email || '',
    products: importData.products || '',
    notes: importData.notes || '',
    originators: importData.originators || '',
    closers: importData.closers || '',
    dateCreated: importData.dateCreated || new Date().toLocaleDateString('en-US'),
    dateUpdated: importData.dateUpdated || '',
    gurl: importData.gurl || 0,
    maxOffer: importData.maxOffer ?? null,
    monthlyRev: importData.monthlyRev ?? null,
    originator: importData.originator || '',
    closer: importData.closer || '',
    owners: [],
    lastActivity: 'Just now',
    stageHistory: [],
  };
}
