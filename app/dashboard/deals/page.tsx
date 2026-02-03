'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Upload, MoreVertical } from 'lucide-react';

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
}

const sampleDeals: Deal[] = [
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
  },
  {
    id: 9,
    dealId: 'N30178',
    company: 'KNA Enterprises LLC',
    dba: '',
    status: 'Approved',
    flags: ['Awaiting Additional Documents'],
    owner: 'Abdur Kronovetter',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '15',
    dateCreated: '9 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 106326.72,
    originator: 'Main Wills',
    closer: '',
  },
  {
    id: 10,
    dealId: '800008',
    company: 'Jon Fox Custom Homes LLC',
    dba: '',
    status: 'Approved',
    flags: ['Awaiting Additional Documents'],
    owner: 'James Fox',
    phone: '(386) 312-8794',
    email: 'jamesfox@gmail.com',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '9 days ago',
    dateUpdated: '',
    gurl: 10,
    maxOffer: 189500.00,
    monthlyRev: 968459.08,
    originator: 'Main Wills',
    closer: '',
  },
  {
    id: 11,
    dealId: 'P88578',
    company: 'Advanced Tactical Solutions LLC',
    dba: '',
    status: 'Ready to Submit',
    flags: ['Awaiting Additional Documents'],
    owner: 'Faisal Khan',
    phone: '',
    email: '',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '11 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 74363.93,
    originator: 'Main Wills',
    closer: '',
  },
  {
    id: 12,
    dealId: 'R83010',
    company: 'TRUCKING POWER LLC',
    dba: '',
    status: 'Declined',
    flags: ['Awaiting Additional Documents'],
    owner: 'Jorge Aragon',
    phone: '(214) 412-5234',
    email: 'jorge.aragon@trucking.com',
    products: '',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '13 days ago',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 532091.25,
    originator: 'Main Wills',
    closer: '',
  },
];

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

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dealIdFilter, setDealIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [flagsFilter, setFlagsFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [originatorFilter, setOriginatorFilter] = useState('All');
  const [closerFilter, setCloserFilter] = useState('All');

  const filteredDeals = sampleDeals.filter((deal) => {
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
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
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
          <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            New deal
          </Button>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">COMPANY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Deal</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">STATUS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">FLAGS</th>
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
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal, index) => (
                <motion.tr
                  key={deal.id}
                  variants={itemVariants}
                  className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[200px] truncate">
                    {deal.company}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dealId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(deal.status)}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {deal.flags.map((flag, i) => (
                        <Badge key={i} variant="outline" className={`text-xs ${getFlagColor(flag)}`}>
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dba || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.owner}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[180px] truncate">
                    {deal.email || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.products || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.notes || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.originators || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.closers}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dateCreated}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.dateUpdated || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{deal.gurl || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{formatCurrency(deal.maxOffer)}</td>
                  <td className="px-4 py-3 text-gray-600 text-right whitespace-nowrap">{formatCurrency(deal.monthlyRev)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.originator}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{deal.closer || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <div>
            Showing {filteredDeals.length} of {sampleDeals.length} results
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
