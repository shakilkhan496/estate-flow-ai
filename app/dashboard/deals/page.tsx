'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Plus, Search, Download, Upload, MoreVertical, Check, X, 
  Building2, Users, MapPin, FileText, Settings, Trash2, UserPlus
} from 'lucide-react';

interface Owner {
  id: string;
  name: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  homeAddress: string;
  percentOwned: number;
}

interface Deal {
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
}

const createEmptyOwner = (): Owner => ({
  id: Math.random().toString(36).substring(2, 9),
  name: '',
  phone: '',
  ssn: '',
  dateOfBirth: '',
  homeAddress: '',
  percentOwned: 0,
});

const initialDeals: Deal[] = [
  {
    id: 1,
    dealId: 'M4763',
    company: 'BLACK RHINO ENERGY SERVICES INC',
    dba: '',
    status: 'Declined',
    flags: ['Stiplisted'],
    owner: 'Cesar Carmen',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '23 hours ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 843173.00,
    originator: 'Main Wills',
    closer: '',
    owners: [{ id: '1', name: 'Cesar Carmen', phone: '', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 100 }],
  },
  {
    id: 2,
    dealId: 'M4700',
    company: 'BLACK RHINO ENERGY SERVICES INC',
    dba: '',
    status: 'Ready to Submit',
    flags: ['Awaiting Additional Documents'],
    owner: 'Cesar Carmen',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '23 hours ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 843727.00,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 3,
    dealId: 'N33444',
    company: 'Fulcrum Markets Dispute Resolution Clinic',
    dba: '',
    status: 'Approved',
    flags: [],
    owner: 'John Hazard',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '4 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 805471.04,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 4,
    dealId: 'N33483',
    company: 'MCKINLEY BLOCKS LLC',
    dba: '',
    status: 'Ready to Submit',
    flags: ['Awaiting Additional Documents'],
    owner: 'Brandon Vill',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '5 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 801887.75,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 5,
    dealId: 'N42451',
    company: 'DEV LLC',
    dba: '',
    status: 'Approved',
    flags: ['Awaiting Additional Documents'],
    owner: 'Thomas McClain',
    phone: '(977) 448-2742',
    email: 'thomas.mcclain@dev.com',
    products: '',
    notes: '',
    originators: '',
    closers: '10',
    dateCreated: '6 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 336893.73,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 6,
    dealId: 'N12418',
    company: 'BYC GLOBAL INC',
    dba: '',
    status: 'Ready to Submit',
    flags: ['Awaiting Additional Documents'],
    owner: 'Stephen Northrup',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '6 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 471202.17,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 7,
    dealId: 'N12084',
    company: 'allan gilbert builders',
    dba: '',
    status: 'Processing',
    flags: ['Awaiting Additional Documents'],
    owner: 'Allan gilbert',
    phone: '(202) 394-1181',
    email: 'agilbert@builders.com',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '6 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 382900.00,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
  {
    id: 8,
    dealId: 'N52130',
    company: 'Move The Nine Inc',
    dba: '',
    status: 'Withdrawn',
    flags: ['Awaiting Additional Documents'],
    owner: 'Lisa Taggart',
    phone: '(943) 278-9844',
    email: 'ltaggart@email.com',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '8 days ago',
    dateUpdated: '',
    gurl: 7,
    maxOffer: 193820.00,
    monthlyRev: 644882.21,
    originator: 'Main Wills',
    closer: '',
    owners: [],
  },
];

const statusOptionsList = ['Ready to Submit', 'Pending', 'Processing', 'Approved', 'Funded', 'Declined', 'Withdrawn'];
const flagOptionsList = ['Awaiting Additional Documents', 'Stiplisted', 'Priority', 'VIP Client', 'Needs Review'];
const originatorOptionsList = ['Main Wills', 'Sarah Johnson', 'Mike Chen', 'Marc Willis'];
const closerOptionsList = ['Tom Brown', 'Lisa Wong', 'David Miller'];
const industryOptions = ['Restaurant', 'Retail', 'Construction', 'Healthcare', 'Transportation', 'Technology', 'Manufacturing', 'Other'];
const legalStructureOptions = ['LLC', 'Corporation', 'Sole Proprietorship', 'Partnership', 'S-Corp', 'C-Corp'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const statusOptions = ['All', 'Ready to Submit', 'Pending', 'Processing', 'Approved', 'Funded', 'Declined', 'Withdrawn'];
const flagOptions = ['All', 'Awaiting Additional Documents', 'Stiplisted', 'Priority', 'VIP Client', 'Needs Review'];
const originatorOptions = ['All', 'Main Wills', 'Sarah Johnson', 'Mike Chen'];
const closerOptions = ['All', 'Tom Brown', 'Lisa Wong', 'David Miller'];

type EditingField = {
  dealId: number;
  field: string;
} | null;

interface EditModalProps {
  deal: Deal;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}

function EditDealModal({ deal, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Deal>({ 
    ...deal, 
    owners: deal.owners || [] 
  });

  const handleChange = (field: keyof Deal, value: string | string[] | number | null | Owner[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const toggleFlag = (flag: string) => {
    const hasFlag = formData.flags.includes(flag);
    const newFlags = hasFlag 
      ? formData.flags.filter(f => f !== flag)
      : [...formData.flags, flag];
    handleChange('flags', newFlags);
  };

  const addOwner = () => {
    const newOwner = createEmptyOwner();
    handleChange('owners', [...formData.owners, newOwner]);
  };

  const removeOwner = (ownerId: string) => {
    handleChange('owners', formData.owners.filter(o => o.id !== ownerId));
  };

  const updateOwner = (ownerId: string, field: keyof Owner, value: string | number) => {
    const updatedOwners = formData.owners.map(owner => 
      owner.id === ownerId ? { ...owner, [field]: value } : owner
    );
    handleChange('owners', updatedOwners);
  };

  const selectClassName = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputClassName = "h-10 border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Deal</h2>
              <p className="text-sm text-gray-500">{formData.dealId} - {formData.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-green-600" />
                </div>
                <CardTitle className="text-base">Business Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Deal ID</Label>
                  <Input
                    value={formData.dealId}
                    onChange={(e) => handleChange('dealId', e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">DBA</Label>
                  <Input
                    value={formData.dba}
                    onChange={(e) => handleChange('dba', e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Owner</Label>
                  <Input
                    value={formData.owner}
                    onChange={(e) => handleChange('owner', e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <CardTitle className="text-base">Status & Flags</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className={selectClassName}
                >
                  {statusOptionsList.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Flags</Label>
                <div className="flex flex-wrap gap-2">
                  {flagOptionsList.map((flag) => (
                    <Badge
                      key={flag}
                      variant={formData.flags.includes(flag) ? 'default' : 'outline'}
                      className={`cursor-pointer ${formData.flags.includes(flag) ? 'bg-blue-600' : ''}`}
                      onClick={() => toggleFlag(flag)}
                    >
                      {flag}
                      {formData.flags.includes(flag) && <Check className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <CardTitle className="text-base">Team Assignment</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Originator</Label>
                  <select
                    value={formData.originator}
                    onChange={(e) => handleChange('originator', e.target.value)}
                    className={selectClassName}
                  >
                    {originatorOptionsList.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Closer</Label>
                  <select
                    value={formData.closer}
                    onChange={(e) => handleChange('closer', e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Select...</option>
                    {closerOptionsList.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Owner Information</CardTitle>
                    <CardDescription className="text-xs">Add business owners and their details</CardDescription>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addOwner}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Owner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.owners.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No owners added yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Owner" to add business owner information</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.owners.map((owner, index) => (
                    <div key={owner.id} className="border rounded-lg p-4 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Owner {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOwner(owner.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Owner Name</Label>
                          <Input
                            value={owner.name}
                            onChange={(e) => updateOwner(owner.id, 'name', e.target.value)}
                            placeholder="Full legal name"
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                          <Input
                            value={owner.phone}
                            onChange={(e) => updateOwner(owner.id, 'phone', e.target.value)}
                            placeholder="(XXX) XXX-XXXX"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">SSN</Label>
                          <Input
                            value={owner.ssn}
                            onChange={(e) => updateOwner(owner.id, 'ssn', e.target.value)}
                            placeholder="XXX-XX-XXXX"
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">% Owned</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={owner.percentOwned}
                            onChange={(e) => updateOwner(owner.id, 'percentOwned', parseFloat(e.target.value) || 0)}
                            placeholder="0-100"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                          <Input
                            type="date"
                            value={owner.dateOfBirth}
                            onChange={(e) => updateOwner(owner.id, 'dateOfBirth', e.target.value)}
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Home Address</Label>
                          <Input
                            value={owner.homeAddress}
                            onChange={(e) => updateOwner(owner.id, 'homeAddress', e.target.value)}
                            placeholder="Full home address"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <CardTitle className="text-base">Additional Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Products</Label>
                  <Input
                    value={formData.products}
                    onChange={(e) => handleChange('products', e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">GURL</Label>
                  <Input
                    type="number"
                    value={formData.gurl}
                    onChange={(e) => handleChange('gurl', parseInt(e.target.value) || 0)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Max Offer</Label>
                  <Input
                    type="number"
                    value={formData.maxOffer || ''}
                    onChange={(e) => handleChange('maxOffer', e.target.value ? parseFloat(e.target.value) : null)}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Monthly Revenue</Label>
                  <Input
                    type="number"
                    value={formData.monthlyRev || ''}
                    onChange={(e) => handleChange('monthlyRev', e.target.value ? parseFloat(e.target.value) : null)}
                    className={inputClassName}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 rounded-b-xl flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [dealIdFilter, setDealIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [flagsFilter, setFlagsFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [originatorFilter, setOriginatorFilter] = useState('All');
  const [closerFilter, setCloserFilter] = useState('All');
  
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = !searchQuery || 
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDealId = !dealIdFilter || 
      deal.dealId.toLowerCase().includes(dealIdFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
      deal.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesFlags = flagsFilter === 'All' || 
      deal.flags.some(f => f.toLowerCase().includes(flagsFilter.toLowerCase()));
    const matchesOwner = !ownerFilter || 
      deal.owner.toLowerCase().includes(ownerFilter.toLowerCase());
    const matchesOriginator = originatorFilter === 'All' || 
      deal.originator === originatorFilter;
    const matchesCloser = closerFilter === 'All' || 
      deal.closer === closerFilter;
    
    return matchesSearch && matchesDealId && matchesStatus && matchesFlags && matchesOwner && matchesOriginator && matchesCloser;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'funded': return 'bg-green-500 text-white';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'ready to submit': return 'bg-blue-100 text-blue-700';
      case 'pending': 
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'declined': return 'bg-red-500 text-white';
      case 'withdrawn': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFlagColor = (flag: string) => {
    if (flag.toLowerCase().includes('awaiting') || flag.toLowerCase().includes('additional')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    if (flag.toLowerCase().includes('stip')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (flag.toLowerCase().includes('priority')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (flag.toLowerCase().includes('vip')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const startEditing = (dealId: number, field: string, currentValue: string) => {
    setEditing({ dealId, field });
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditing(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (!editing) return;
    
    setDeals(deals.map(deal => {
      if (deal.id === editing.dealId) {
        return { ...deal, [editing.field]: editValue };
      }
      return deal;
    }));
    setEditing(null);
    setEditValue('');
  };

  const updateDealField = (dealId: number, field: string, value: string | string[]) => {
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        return { ...deal, [field]: value };
      }
      return deal;
    }));
  };

  const toggleFlag = (dealId: number, flag: string) => {
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        const hasFlag = deal.flags.includes(flag);
        const newFlags = hasFlag 
          ? deal.flags.filter(f => f !== flag)
          : [...deal.flags, flag];
        return { ...deal, flags: newFlags };
      }
      return deal;
    }));
  };

  const isEditing = (dealId: number, field: string) => {
    return editing?.dealId === dealId && editing?.field === field;
  };

  const handleSaveDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
  };

  const renderEditableCell = (deal: Deal, field: keyof Deal, displayValue: string) => {
    if (isEditing(deal.id, field)) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-7 text-sm w-32"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEditing();
            }}
          />
          <button onClick={saveEdit} className="text-green-600 hover:text-green-700 cursor-pointer">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={cancelEditing} className="text-red-600 hover:text-red-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return (
      <span
        onClick={() => startEditing(deal.id, field, String(deal[field] || ''))}
        className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 px-1 py-0.5 rounded transition-colors"
        title="Click to edit"
      >
        {displayValue || '-'}
      </span>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <AnimatePresence>
        {editingDeal && (
          <EditDealModal
            deal={editingDeal}
            onClose={() => setEditingDeal(null)}
            onSave={handleSaveDeal}
          />
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Deals</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Link href="/dashboard/deals/new">
            <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              New deal
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white border rounded-lg p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[140px] max-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[100px] max-w-[120px]">
            <Input
              placeholder="Deal"
              value={dealIdFilter}
              onChange={(e) => setDealIdFilter(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 border rounded text-sm bg-white min-w-[100px] cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'All' ? 'Status' : opt}</option>
            ))}
          </select>
          <select
            value={flagsFilter}
            onChange={(e) => setFlagsFilter(e.target.value)}
            className="h-8 px-2 border rounded text-sm bg-white min-w-[80px] cursor-pointer"
          >
            {flagOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'All' ? 'Flags' : opt}</option>
            ))}
          </select>
          <div className="flex-1 min-w-[100px] max-w-[120px]">
            <Input
              placeholder="Owner"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <select
            value={originatorFilter}
            onChange={(e) => setOriginatorFilter(e.target.value)}
            className="h-8 px-2 border rounded text-sm bg-white min-w-[100px] cursor-pointer"
          >
            {originatorOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'All' ? 'Originators' : opt}</option>
            ))}
          </select>
          <select
            value={closerFilter}
            onChange={(e) => setCloserFilter(e.target.value)}
            className="h-8 px-2 border rounded text-sm bg-white min-w-[80px] cursor-pointer"
          >
            {closerOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'All' ? 'Closers' : opt}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-10 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[180px] max-w-[180px]">COMPANY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[80px]">Deal</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[120px]">STATUS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">FLAGS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">DBA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">OWNER</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">PHONE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">EMAIL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Products</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Originators</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Closers</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Date Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Date Updated</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">GURL</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">MAX OFFER</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">MONTHLY REV</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">ORIGINATOR</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">CLOSER</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 whitespace-nowrap">OWNERS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal, index) => (
                <motion.tr
                  key={deal.id}
                  variants={itemVariants}
                  className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-2 py-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 cursor-pointer hover:bg-gray-200"
                      onClick={() => setEditingDeal(deal)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap min-w-[180px] max-w-[180px]">
                    <div className="truncate" title={deal.company}>
                      {isEditing(deal.id, 'company') ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-7 text-sm w-32"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEditing();
                            }}
                          />
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-700 cursor-pointer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEditing} className="text-red-600 hover:text-red-700 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => startEditing(deal.id, 'company', deal.company)}
                          className="cursor-pointer hover:text-blue-600 block truncate"
                          title={deal.company}
                        >
                          {deal.company}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap min-w-[80px]">
                    {renderEditableCell(deal, 'dealId', deal.dealId)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap min-w-[120px]">
                    <select
                      value={deal.status}
                      onChange={(e) => updateDealField(deal.id, 'status', e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded border-0 cursor-pointer ${getStatusColor(deal.status)}`}
                    >
                      {statusOptionsList.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-gray-900">{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap min-w-[200px] max-w-[280px]">
                    <div className="flex items-center gap-1 flex-wrap">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleFlag(deal.id, e.target.value);
                          }
                        }}
                        className="h-6 px-1 text-xs border rounded bg-white cursor-pointer flex-shrink-0"
                      >
                        <option value="">+ Flag</option>
                        {flagOptionsList.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {deal.flags.map((flag, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className={`text-xs cursor-pointer hover:opacity-70 flex-shrink-0 ${getFlagColor(flag)}`}
                          onClick={() => toggleFlag(deal.id, flag)}
                          title="Click to remove"
                        >
                          <span className="truncate max-w-[150px]">{flag}</span>
                          <X className="w-3 h-3 ml-1 flex-shrink-0" />
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'dba', deal.dba)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'owner', deal.owner)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'phone', deal.phone)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[180px]">
                    {renderEditableCell(deal, 'email', deal.email)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'products', deal.products)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'notes', deal.notes)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'originators', deal.originators)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'closers', deal.closers)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dateCreated}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dateUpdated || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{deal.gurl || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{formatCurrency(deal.maxOffer)}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{formatCurrency(deal.monthlyRev)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'originator', deal.originator)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {renderEditableCell(deal, 'closer', deal.closer)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <Badge 
                      variant="outline" 
                      className="bg-teal-50 text-teal-700 border-teal-200 cursor-pointer"
                      onClick={() => setEditingDeal(deal)}
                      title="Click to view/edit owners"
                    >
                      {deal.owners?.length || 0} owner{(deal.owners?.length || 0) !== 1 ? 's' : ''}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <div>
            Showing {filteredDeals.length} of {deals.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="cursor-pointer">Previous</Button>
            <Button variant="outline" size="sm" className="cursor-pointer">Next</Button>
          </div>
        </div>
      </motion.div>

      {filteredDeals.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No deals found matching your criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
