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
  Building2, Users, MapPin, FileText, Settings, Trash2, UserPlus,
  LayoutGrid, Table2, ChevronLeft, ChevronRight, User, Clock, MoreHorizontal,
  History, Minimize2, Maximize2, ChevronDown, ChevronUp
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

interface StageTransition {
  fromStage: string;
  toStage: string;
  timestamp: string;
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
  lastActivity: string;
  stageHistory: StageTransition[];
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
    dateCreated: '02/04/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 843173.00,
    originator: 'Main Wills',
    closer: '',
    owners: [{ id: '1', name: 'Cesar Carmen', phone: '', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 100 }],
    lastActivity: '23 hours ago',
    stageHistory: [{ fromStage: 'New Application', toStage: 'Declined', timestamp: '23 hours ago' }],
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
    dateCreated: '02/04/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 843727.00,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '02/01/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 805471.04,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '01/31/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 801887.75,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '01/30/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 336893.73,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '01/30/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 471202.17,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '01/30/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: null,
    monthlyRev: 382900.00,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
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
    dateCreated: '01/28/2026',
    dateUpdated: '',
    gurl: 7,
    maxOffer: 193820.00,
    monthlyRev: 644882.21,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 9,
    dealId: 'N60001',
    company: 'Sunrise Bakery LLC',
    dba: 'Sunrise Bakery',
    status: 'New Application',
    flags: [],
    owner: 'Maria Santos',
    phone: '(555) 123-4567',
    email: 'maria@sunrisebakery.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '02/04/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 75000,
    monthlyRev: 125000,
    originator: 'Marc Willis',
    closer: '',
    owners: [{ id: '9a', name: 'Maria Santos', phone: '(555) 123-4567', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 100 }],
    lastActivity: '1 day ago',
    stageHistory: [],
  },
  {
    id: 10,
    dealId: 'N60002',
    company: 'Metro Auto Repair',
    dba: 'Metro Auto',
    status: 'New Application',
    flags: [],
    owner: 'James Wilson',
    phone: '(555) 234-5678',
    email: 'james@metroauto.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '02/03/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 150000,
    monthlyRev: 280000,
    originator: 'Sarah Johnson',
    closer: '',
    owners: [{ id: '10a', name: 'James Wilson', phone: '(555) 234-5678', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 100 }],
    lastActivity: '2 days ago',
    stageHistory: [],
  },
  {
    id: 11,
    dealId: 'N60003',
    company: 'Fresh Greens Market',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Linda Chen',
    phone: '(555) 345-6789',
    email: 'linda@freshgreens.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '02/02/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 50000,
    monthlyRev: 95000,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 12,
    dealId: 'N60004',
    company: 'Downtown Fitness Center',
    dba: 'DFC Gym',
    status: 'New Application',
    flags: [],
    owner: 'Robert Taylor',
    phone: '(555) 456-7890',
    email: 'robert@dfcgym.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '02/01/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 200000,
    monthlyRev: 350000,
    originator: 'Mike Chen',
    closer: '',
    owners: [{ id: '12a', name: 'Robert Taylor', phone: '(555) 456-7890', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 60 }, { id: '12b', name: 'Susan Taylor', phone: '(555) 456-7891', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 40 }],
    lastActivity: '4 days ago',
    stageHistory: [],
  },
  {
    id: 13,
    dealId: 'N60005',
    company: 'Quick Plumbing Services',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Michael Brown',
    phone: '(555) 567-8901',
    email: 'mike@quickplumbing.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/31/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 85000,
    monthlyRev: 145000,
    originator: 'Marc Willis',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 14,
    dealId: 'N60006',
    company: 'Coastal Seafood Restaurant',
    dba: 'Coastal Eats',
    status: 'New Application',
    flags: [],
    owner: 'Patricia Lee',
    phone: '(555) 678-9012',
    email: 'patricia@coastaleats.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/29/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 175000,
    monthlyRev: 320000,
    originator: 'Sarah Johnson',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 15,
    dealId: 'N60007',
    company: 'Elite Hair Studio',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Jennifer Adams',
    phone: '(555) 789-0123',
    email: 'jen@elitehair.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/29/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 45000,
    monthlyRev: 78000,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 16,
    dealId: 'N60008',
    company: 'Mountain View Landscaping',
    dba: 'MVL',
    status: 'New Application',
    flags: [],
    owner: 'David Martinez',
    phone: '(555) 890-1234',
    email: 'david@mvlandscaping.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/22/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 120000,
    monthlyRev: 210000,
    originator: 'Mike Chen',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 17,
    dealId: 'N60009',
    company: 'Prime Dental Care',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Dr. Sarah Miller',
    phone: '(555) 901-2345',
    email: 'drmiller@primedentalcare.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/22/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 300000,
    monthlyRev: 450000,
    originator: 'Marc Willis',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 18,
    dealId: 'N60010',
    company: 'Urban Coffee House',
    dba: 'Urban Brew',
    status: 'New Application',
    flags: [],
    owner: 'Kevin Park',
    phone: '(555) 012-3456',
    email: 'kevin@urbanbrew.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/15/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 65000,
    monthlyRev: 110000,
    originator: 'Sarah Johnson',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 19,
    dealId: 'N60011',
    company: 'Precision Tech Solutions',
    dba: 'PTS',
    status: 'New Application',
    flags: [],
    owner: 'Angela White',
    phone: '(555) 111-2222',
    email: 'angela@ptsolutions.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/15/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 250000,
    monthlyRev: 380000,
    originator: 'Main Wills',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 20,
    dealId: 'N60012',
    company: 'Green Valley Nursery',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Thomas Green',
    phone: '(555) 222-3333',
    email: 'tom@greenvalley.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/05/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 95000,
    monthlyRev: 165000,
    originator: 'Mike Chen',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 21,
    dealId: 'N60013',
    company: 'Rapid Courier Services',
    dba: 'RCS Delivery',
    status: 'New Application',
    flags: [],
    owner: 'Frank Rodriguez',
    phone: '(555) 333-4444',
    email: 'frank@rcsdelivery.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/05/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 180000,
    monthlyRev: 290000,
    originator: 'Marc Willis',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 22,
    dealId: 'N60014',
    company: 'Harmony Wellness Spa',
    dba: '',
    status: 'New Application',
    flags: [],
    owner: 'Michelle Davis',
    phone: '(555) 444-5555',
    email: 'michelle@harmonyspa.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '01/05/2026',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 110000,
    monthlyRev: 195000,
    originator: 'Sarah Johnson',
    closer: '',
    owners: [],
    lastActivity: '2 hours ago',
    stageHistory: [],
  },
  {
    id: 23,
    dealId: 'N60015',
    company: 'Summit Construction Group',
    dba: 'Summit Builders',
    status: 'New Application',
    flags: [],
    owner: 'William Harris',
    phone: '(555) 555-6666',
    email: 'william@summitbuilders.com',
    products: 'MCA',
    notes: '',
    originators: '',
    closers: '0',
    dateCreated: '12/05/2025',
    dateUpdated: '',
    gurl: 0,
    maxOffer: 400000,
    monthlyRev: 650000,
    originator: 'Main Wills',
    closer: '',
    owners: [{ id: '23a', name: 'William Harris', phone: '(555) 555-6666', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 50 }, { id: '23b', name: 'John Harris', phone: '(555) 555-6667', ssn: '', dateOfBirth: '', homeAddress: '', percentOwned: 50 }],
    lastActivity: '12/05/2025',
    stageHistory: [],
  },
];

const pipelineStages = [
  { id: 'new-application', name: 'New Application', color: 'bg-blue-500' },
  { id: 'missing-documents', name: 'Missing Documents', color: 'bg-orange-500' },
  { id: 'ready-to-submit', name: 'Ready to Submit', color: 'bg-yellow-500' },
  { id: 'submitted', name: 'Submitted', color: 'bg-purple-500' },
  { id: 'resubmitting', name: 'Resubmitting', color: 'bg-pink-500' },
  { id: 'approved', name: 'Approved', color: 'bg-green-500' },
  { id: 'offer-selected', name: 'Offer Selected', color: 'bg-teal-500' },
  { id: 'offer-pitched', name: 'Offer Pitched', color: 'bg-cyan-500' },
  { id: 'repricing', name: 'Repricing', color: 'bg-indigo-500' },
  { id: 'offer-accepted', name: 'Offer Accepted', color: 'bg-emerald-500' },
  { id: 'received-dl-vc', name: 'Received DL/VC', color: 'bg-lime-500' },
  { id: 'contracts-requested', name: 'Contracts Requested', color: 'bg-amber-500' },
  { id: 'contracts-sent', name: 'Contracts Sent', color: 'bg-rose-500' },
  { id: 'contracts-signed', name: 'Contracts Signed', color: 'bg-sky-500' },
  { id: 'final-review', name: 'Final Review', color: 'bg-violet-500' },
];

const statusOptionsList = ['New Application', 'Missing Documents', 'Ready to Submit', 'Submitted', 'Resubmitting', 'Approved', 'Offer Selected', 'Offer Pitched', 'Repricing', 'Offer Accepted', 'Received DL/VC', 'Contracts Requested', 'Contracts Sent', 'Contracts Signed', 'Final Review'];
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

const normalizeStatus = (status: string): string => {
  return status.toLowerCase().replace(/\s+/g, '-');
};

const getStageFromStatus = (status: string): string => {
  const normalized = normalizeStatus(status);
  const stage = pipelineStages.find(s => s.id === normalized);
  return stage ? stage.id : 'new-application';
};

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onMoveToNextStage: (deal: Deal) => void;
  isCompact: boolean;
  isLastStage: boolean;
}

function DealCard({ deal, onDragStart, onEdit, onMoveToNextStage, isCompact, isLastStage }: DealCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  
  const formatAmount = (value: number | null) => {
    if (value === null) return null;
    if (value === 0) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  if (isCompact) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        draggable
        onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, deal)}
        className="bg-white border rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow group"
      >
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-gray-900 text-sm truncate flex-1" title={deal.company}>
            {deal.company}
          </h4>
          {deal.maxOffer !== null && deal.maxOffer > 0 && (
            <span className="text-xs font-semibold text-green-600">
              {formatAmount(deal.maxOffer)}
            </span>
          )}
          {!isLastStage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
              onClick={(e) => { e.stopPropagation(); onMoveToNextStage(deal); }}
              title="Move to next stage"
            >
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, deal)}
      className="bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate" title={deal.company}>
            {deal.company}
          </h4>
          {deal.maxOffer !== null && deal.maxOffer > 0 && (
            <p className="text-sm font-semibold text-green-600 mt-0.5">
              {formatAmount(deal.maxOffer)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isLastStage && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={(e) => { e.stopPropagation(); onMoveToNextStage(deal); }}
              title="Move to next stage"
            >
              Next <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <User className="w-3 h-3" />
        <span className="truncate">{deal.owner}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
        <Clock className="w-3 h-3" />
        <span>Last activity: {deal.lastActivity}</span>
      </div>
      
      {deal.stageHistory.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <button
            onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <History className="w-3 h-3" />
            <span>Stage History ({deal.stageHistory.length})</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1">
                  {deal.stageHistory.map((transition, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-400">{transition.fromStage}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-600">{transition.toStage}</span>
                      <span className="text-gray-300 ml-auto">{transition.timestamp}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

interface PipelineColumnProps {
  stage: typeof pipelineStages[0];
  deals: Deal[];
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  onEdit: (deal: Deal) => void;
  onMoveToNextStage: (deal: Deal) => void;
  totalAmount: number;
  isCompact: boolean;
  isLastStage: boolean;
}

function PipelineColumn({ stage, deals, onDragStart, onDragOver, onDrop, onEdit, onMoveToNextStage, totalAmount, isCompact, isLastStage }: PipelineColumnProps) {
  const formatAmount = (value: number) => {
    if (value === 0) return null;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div 
      className="flex-shrink-0 w-[260px] bg-gray-100 rounded-lg flex flex-col min-h-[150px]"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <div className="p-2 space-y-2">
        <AnimatePresence>
          {deals.map((deal) => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onDragStart={onDragStart} 
              onEdit={onEdit} 
              onMoveToNextStage={onMoveToNextStage}
              isCompact={isCompact}
              isLastStage={isLastStage}
            />
          ))}
        </AnimatePresence>
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

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
  
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');
  const [isCompactView, setIsCompactView] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());
  
  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };
  
  const collapseAllStages = () => {
    setCollapsedStages(new Set(pipelineStages.map(s => s.id)));
  };
  
  const expandAllStages = () => {
    setCollapsedStages(new Set());
  };

  const exportToCSV = () => {
    const headers = [
      'Deal ID', 'Company', 'DBA', 'Status', 'Flags', 'Owner', 'Phone', 'Email',
      'Products', 'Notes', 'Originators', 'Closers', 'Date Created', 'Date Updated',
      'GURL', 'Max Offer', 'Monthly Revenue', 'Originator', 'Closer', 'Owners Count'
    ];

    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = filteredDeals.map(deal => [
      escapeCSV(deal.dealId),
      escapeCSV(deal.company),
      escapeCSV(deal.dba),
      escapeCSV(deal.status),
      escapeCSV(deal.flags.join('; ')),
      escapeCSV(deal.owner),
      escapeCSV(deal.phone),
      escapeCSV(deal.email),
      escapeCSV(deal.products),
      escapeCSV(deal.notes),
      escapeCSV(deal.originators),
      escapeCSV(deal.closers),
      escapeCSV(deal.dateCreated),
      escapeCSV(deal.dateUpdated),
      escapeCSV(deal.gurl),
      escapeCSV(deal.maxOffer),
      escapeCSV(deal.monthlyRev),
      escapeCSV(deal.originator),
      escapeCSV(deal.closer),
      escapeCSV(deal.owners.length)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `deals_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedDeal) {
      const newStatus = pipelineStages.find(s => s.id === stageId)?.name || draggedDeal.status;
      const oldStatus = draggedDeal.status;
      
      if (oldStatus !== newStatus) {
        const newTransition: StageTransition = {
          fromStage: oldStatus,
          toStage: newStatus,
          timestamp: 'Just now'
        };
        
        setDeals(prev => prev.map(deal => 
          deal.id === draggedDeal.id 
            ? { 
                ...deal, 
                status: newStatus,
                lastActivity: 'Just now',
                stageHistory: [newTransition, ...deal.stageHistory]
              } 
            : deal
        ));
      }
      setDraggedDeal(null);
    }
  };
  
  const handleMoveToNextStage = (deal: Deal) => {
    const currentStageId = getStageFromStatus(deal.status);
    const currentIndex = pipelineStages.findIndex(s => s.id === currentStageId);
    
    if (currentIndex < pipelineStages.length - 1) {
      const nextStage = pipelineStages[currentIndex + 1];
      const newStatus = nextStage.name;
      const oldStatus = deal.status;
      
      const newTransition: StageTransition = {
        fromStage: oldStatus,
        toStage: newStatus,
        timestamp: 'Just now'
      };
      
      setDeals(prev => prev.map(d => 
        d.id === deal.id 
          ? { 
              ...d, 
              status: newStatus,
              lastActivity: 'Just now',
              stageHistory: [newTransition, ...d.stageHistory]
            } 
          : d
      ));
    }
  };

  const getDealsByStage = (stageId: string) => {
    return filteredDeals.filter(deal => getStageFromStatus(deal.status) === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.maxOffer || 0), 0);
  };

  const scrollLeft = () => {
    const container = document.getElementById('pipeline-cards');
    const header = document.getElementById('pipeline-header');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
    if (header) {
      header.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('pipeline-cards');
    const header = document.getElementById('pipeline-header');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
    if (header) {
      header.scrollBy({ left: 300, behavior: 'smooth' });
    }
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
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Deals</h1>
          {viewMode === 'pipeline' && (
            <p className="text-sm text-gray-500 mt-1">Drag and drop deals between stages</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button 
              variant={viewMode === 'table' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('table')}
              className={`cursor-pointer h-7 px-3 ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
            >
              <Table2 className="w-4 h-4 mr-1" />
              Table
            </Button>
            <Button 
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('pipeline')}
              className={`cursor-pointer h-7 px-3 ${viewMode === 'pipeline' ? 'bg-white shadow-sm' : ''}`}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Pipeline
            </Button>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={exportToCSV}>
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

      {viewMode === 'pipeline' ? (
        <motion.div 
          key="pipeline-view"
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          className="bg-white border rounded-lg"
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b flex-wrap gap-2">
            <p className="text-sm text-gray-500">
              {isCompactView ? 'Compact View' : 'Expanded View'} - Showing {filteredDeals.length} deals
              {collapsedStages.size > 0 && ` (${collapsedStages.size} stages hidden)`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={collapsedStages.size === pipelineStages.length ? expandAllStages : collapseAllStages}
                className="h-8 px-3 cursor-pointer text-xs text-gray-600"
              >
                {collapsedStages.size === pipelineStages.length ? 'Show All Stages' : 'Hide All Stages'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompactView(!isCompactView)}
                className="h-8 px-3 cursor-pointer flex items-center gap-2"
              >
                {isCompactView ? (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span>Expand Cards</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Compact Cards</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div 
            id="pipeline-header"
            className="flex gap-3 p-4 pb-2 mx-12 overflow-x-auto sticky top-0 bg-white z-10 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              const container = document.getElementById('pipeline-cards');
              if (container) container.scrollLeft = e.currentTarget.scrollLeft;
            }}
          >
            {pipelineStages.map((stage) => {
              const stageDeals = getDealsByStage(stage.id);
              const stageTotal = getStageTotal(stage.id);
              const isCollapsed = collapsedStages.has(stage.id);
              const formatAmount = (value: number) => {
                if (value === 0) return null;
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
              };
              
              if (isCollapsed) {
                return (
                  <div 
                    key={stage.id} 
                    className="flex-shrink-0 w-[50px] p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex flex-col items-center justify-center"
                    onClick={() => toggleStageCollapse(stage.id)}
                    title={`${stage.name} (${stageDeals.length} deals) - Click to expand`}
                  >
                    <div className={`w-2 h-2 rounded-full ${stage.color} mb-1`} />
                    <Badge variant="secondary" className="text-xs">
                      {stageDeals.length}
                    </Badge>
                    <ChevronRight className="w-3 h-3 text-gray-400 mt-1" />
                  </div>
                );
              }
              
              return (
                <div key={stage.id} className="flex-shrink-0 w-[260px] p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <h3 className="font-medium text-gray-900 text-sm">{stage.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {stageDeals.length}
                      </Badge>
                      <button
                        onClick={() => toggleStageCollapse(stage.id)}
                        className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
                        title="Collapse this stage"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  {stageTotal > 0 && (
                    <p className="text-xs text-gray-500">{formatAmount(stageTotal)}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 p-0 rounded-full shadow-lg bg-white hover:bg-gray-50 cursor-pointer border-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 p-0 rounded-full shadow-lg bg-white hover:bg-gray-50 cursor-pointer border-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div 
              id="pipeline-cards"
              className="flex gap-3 p-4 pt-2 mx-12 overflow-x-auto"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={(e) => {
                const header = document.getElementById('pipeline-header');
                if (header) header.scrollLeft = e.currentTarget.scrollLeft;
              }}
            >
              {pipelineStages.map((stage, index) => {
                const isCollapsed = collapsedStages.has(stage.id);
                const isLastStage = index === pipelineStages.length - 1;
                
                if (isCollapsed) {
                  return (
                    <div 
                      key={stage.id}
                      className="flex-shrink-0 w-[50px] bg-gray-100 rounded-lg min-h-[150px] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => toggleStageCollapse(stage.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage.id)}
                      title={`${stage.name} - Click to expand`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                }
                
                return (
                  <PipelineColumn
                    key={stage.id}
                    stage={stage}
                    deals={getDealsByStage(stage.id)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdit={(deal) => setEditingDeal(deal)}
                    onMoveToNextStage={handleMoveToNextStage}
                    totalAmount={getStageTotal(stage.id)}
                    isCompact={isCompactView}
                    isLastStage={isLastStage}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="table-view"
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg border overflow-hidden"
        >
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
      )}

      {filteredDeals.length === 0 && viewMode === 'table' && (
        <motion.div variants={itemVariants} className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No deals found matching your criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
