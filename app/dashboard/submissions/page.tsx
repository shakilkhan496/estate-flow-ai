'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Download, ChevronLeft, ChevronRight, Check, Minus,
  Send, Filter, X, ChevronDown
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface StatusDropdownProps {
  value: string;
  options: string[];
  getColor: (status: string) => string;
  onChange: (value: string) => void;
}

function StatusDropdown({ value, options, getColor, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`h-8 px-3 rounded text-sm cursor-pointer w-full flex items-center justify-between gap-2 ${getColor(value)}`}
      >
        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg py-1 min-w-[120px]"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer ${value === opt ? 'bg-gray-50' : ''}`}
              >
                <span className={`px-2 py-0.5 rounded text-xs ${getColor(opt)}`}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Submission {
  id: number;
  dealId: string;
  deal: string;
  funder: string;
  status: string;
  response: string;
  error: string;
  submittedBy: string;
  sender: string;
  ai: boolean;
  originator: string;
  submitted: string;
  updated: string;
  closers: string;
}

type EditingField = {
  submissionId: number;
  field: keyof Submission;
} | null;

const funderOptions = ['Mulligan Funding', 'Fenix', 'Forward', 'Fundworks', 'IOU', 'Fintap', 'LG', 'Radiance', 'Spartan', 'Fundkite', 'Kapitus', 'OnDeck', 'Biz2Credit', 'Wall St Funding', 'Can capital', 'Headway', 'Kalamata'];

const sampleSubmissions: Submission[] = [
  {
    id: 1069754,
    dealId: 'D-1069754',
    deal: 'Concord-Carlisle Dental Associates',
    funder: 'Mulligan Funding',
    status: 'declined',
    response: 'Unfortunately, we are unable to proceed with financing for your client at this time.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '1 hour ago',
    updated: '1 hour ago',
    closers: 'Tom Brown',
  },
  {
    id: 1069753,
    dealId: 'D-1069753',
    deal: 'Concord-Carlisle Dental Associates',
    funder: 'Fenix',
    status: 'declined',
    response: 'WE ARE NO LONGER ACCEPTING YOUR SUBMISSIONS DUE TO LOW CONVERSIONS of approvals/funding. We wish you well on your future endeavours!!',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '1 hour ago',
    updated: '11 minutes ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1069752,
    dealId: 'D-1069752',
    deal: 'Concord-Carlisle Dental Associates',
    funder: 'Forward',
    status: 'approved',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '1 hour ago',
    updated: '1 hour ago',
    closers: 'Tom Brown',
  },
  {
    id: 1069751,
    dealId: 'D-1069751',
    deal: 'Concord-Carlisle Dental Associates',
    funder: 'Fundworks',
    status: 'sent',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '1 hour ago',
    updated: '1 hour ago',
    closers: 'David Miller',
  },
  {
    id: 1069750,
    dealId: 'D-1069750',
    deal: 'Concord-Carlisle Dental Associates',
    funder: 'IOU',
    status: 'declined',
    response: 'Failed credit',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '1 hour ago',
    updated: '28 minutes ago',
    closers: 'Tom Brown',
  },
  {
    id: 1066578,
    dealId: 'D-1066578',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Fintap',
    status: 'declined',
    response: 'Derogatory Credit\nInconsistent Banking\nHeavy Liens & Judgments',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '5 hours ago',
    updated: '5 hours ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1066569,
    dealId: 'D-1066569',
    deal: 'Red Diamond Marketing LLC',
    funder: 'LG',
    status: 'sent',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '6 hours ago',
    updated: '6 hours ago',
    closers: 'Tom Brown',
  },
  {
    id: 1066568,
    dealId: 'D-1066568',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Fundworks',
    status: 'declined',
    response: 'The credit score falls under our minimum threshold of 550.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '6 hours ago',
    updated: '3 hours ago',
    closers: 'David Miller',
  },
  {
    id: 1066567,
    dealId: 'D-1066567',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Radiance',
    status: 'sent',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '6 hours ago',
    updated: '6 hours ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1066178,
    dealId: 'D-1066178',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Spartan',
    status: 'declined',
    response: 'Auto Decline - Previous decline in the last 30 days',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '20 hours ago',
    closers: 'Tom Brown',
  },
  {
    id: 1066177,
    dealId: 'D-1066177',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Forward',
    status: 'declined',
    response: 'History of financial offenses, History of violent offenses',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '20 hours ago',
    closers: 'David Miller',
  },
  {
    id: 1066176,
    dealId: 'D-1066176',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Fundkite',
    status: 'declined',
    response: 'Overleveraged',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '20 hours ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1066175,
    dealId: 'D-1066175',
    deal: 'Red Diamond Marketing LLC',
    funder: 'IOU',
    status: 'declined',
    response: 'Marketing is restricted',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '4 hours ago',
    closers: 'Tom Brown',
  },
  {
    id: 1066174,
    dealId: 'D-1066174',
    deal: 'Red Diamond Marketing LLC',
    funder: 'Kapitus',
    status: 'sent',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '6 hours ago',
    closers: 'David Miller',
  },
  {
    id: 1066173,
    dealId: 'D-1066173',
    deal: 'Red Diamond Marketing LLC',
    funder: 'OnDeck',
    status: 'declined',
    response: 'Stage: CLOSED\nNote: DECLINED\nIneligible Reasons:\n- Derogatory History in LexisNexis Consumer Credit\n- High utilization of available bankcard credit on Transunion Consumer Credit Report\n- Transunion Personal Credit Score is on the lower end of our acceptable range\n- Recent Increase in Consumer Credit Exposure via Transunion\nContact Status: CONTACTED\n(Application Number: 6b9420f4-52aa-4b2e-b9d1-b56e1b72d096)',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '20 hours ago',
    updated: '20 hours ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1062330,
    dealId: 'D-1062330',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'IOU',
    status: 'declined',
    response: 'Your business does not meet our Core Industry type and or is an industry we are unable to lend to at this time.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '1 day ago',
    updated: '1 day ago',
    closers: 'Tom Brown',
  },
  {
    id: 1059145,
    dealId: 'D-1059145',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Fintap',
    status: 'declined',
    response: 'Non-Profit Business',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'David Miller',
  },
  {
    id: 1059144,
    dealId: 'D-1059144',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Forward',
    status: 'declined',
    response: 'Prohibited Business Type Non-Profit.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1059143,
    dealId: 'D-1059143',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Fundworks',
    status: 'declined',
    response: 'Attorneys, law offices, and legal service businesses are on our restricted industries list.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'Tom Brown',
  },
  {
    id: 1059142,
    dealId: 'D-1059142',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Kalamata',
    status: 'sent',
    response: '',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'David Miller',
  },
  {
    id: 1059141,
    dealId: 'D-1059141',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Mulligan Funding',
    status: 'declined',
    response: 'Unable to proceed with financing for your client at this time',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1059140,
    dealId: 'D-1059140',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Biz2Credit',
    status: 'declined',
    response: 'The message does not specify the reason for the decline.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '4 days ago',
    closers: 'Tom Brown',
  },
  {
    id: 1059139,
    dealId: 'D-1059139',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'IOU',
    status: 'declined',
    response: 'This is exclusive only for 2 more days. we can resubmit 1/31',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '4 days ago',
    closers: 'David Miller',
  },
  {
    id: 1059138,
    dealId: 'D-1059138',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Wall St Funding',
    status: 'declined',
    response: 'Excessive submissions: Merchant has been submitted for funding by various ISOs',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'Lisa Wong',
  },
  {
    id: 1059137,
    dealId: 'D-1059137',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Can capital',
    status: 'errored',
    response: 'Missing Required Fields:\n- Business phone number\n- State of formation (required for Corporation)\n- Primary Owner (John Hebner) phone number\n\nValidation Errors:\n- Primary Owner (John Hebner) email is invalid',
    error: 'Missing Required Fields:\n- Business phone number\n- State of formation (required for Corporation)\n- Primary Owner (John Hebner) phone number\n\nValidation Errors:\n- Primary Owner (John Hebner) email is invalid',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: false,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '5 days ago',
    closers: 'Tom Brown',
  },
  {
    id: 1059136,
    dealId: 'D-1059136',
    deal: 'Fulcrum Institute Dispute Resolution Clinic',
    funder: 'Headway',
    status: 'declined',
    response: 'At this time, we are unable to offer a line of credit to Fulcrum Institute Dispute Resolution Clinic because there is a pending application or business is an existing customer.',
    error: '',
    submittedBy: 'Marc Willis',
    sender: 'newdeals@rubycapitalgroup.com',
    ai: true,
    originator: 'Marc Willis',
    submitted: '5 days ago',
    updated: '4 days ago',
    closers: 'David Miller',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(sampleSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [funderFilter, setFunderFilter] = useState('All');
  const [originatorFilter, setOriginatorFilter] = useState('All');
  const [closerFilter, setCloserFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');
  const itemsPerPage = 30;

  const submissionStatusConfig = useAppSelector((state) => state.adminConfig.submissionStatuses);
  const originatorConfig = useAppSelector((state) => state.adminConfig.originators);
  const closerConfig = useAppSelector((state) => state.adminConfig.closers);

  const originatorOptions = originatorConfig.map(o => o.value);
  const closerOptions = closerConfig.map(c => c.value);
  const statusOptions = submissionStatusConfig.map(s => s.value);

  const getStatusColor = (status: string): string => {
    const config = submissionStatusConfig.find(s => s.value.toLowerCase() === status.toLowerCase());
    return config ? `${config.color} border` : 'bg-gray-100 text-gray-700 border';
  };

  const funders = ['All', ...new Set(submissions.map(s => s.funder))];
  const statuses = ['All', ...statusOptions];

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = !searchQuery || 
      sub.deal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.funder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.dealId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesFunder = funderFilter === 'All' || sub.funder === funderFilter;
    const matchesOriginator = originatorFilter === 'All' || sub.originator === originatorFilter;
    const matchesCloser = closerFilter === 'All' || sub.closers === closerFilter;
    return matchesSearch && matchesStatus && matchesFunder && matchesOriginator && matchesCloser;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startEditing = (submissionId: number, field: keyof Submission, currentValue: string) => {
    setEditing({ submissionId, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editing) {
      setSubmissions(prev => prev.map(sub => 
        sub.id === editing.submissionId 
          ? { ...sub, [editing.field]: editValue, updated: 'Just now' }
          : sub
      ));
      setEditing(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const updateField = (submissionId: number, field: keyof Submission, value: string | boolean) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, [field]: value, updated: 'Just now' }
        : sub
    ));
  };

  const isEditing = (submissionId: number, field: keyof Submission) => 
    editing?.submissionId === submissionId && editing?.field === field;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-6 h-6" />
            Submissions
          </h1>
          <p className="text-gray-500 mt-1">Track all funder submissions and responses</p>
        </div>
        <Button variant="outline" className="cursor-pointer flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by deal, funder, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 border rounded text-sm bg-white cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={funderFilter}
              onChange={(e) => setFunderFilter(e.target.value)}
              className="h-9 px-3 border rounded text-sm bg-white cursor-pointer"
            >
              {funders.map((funder) => (
                <option key={funder} value={funder}>
                  {funder === 'All' ? 'All Funders' : funder}
                </option>
              ))}
            </select>
            <select
              value={originatorFilter}
              onChange={(e) => setOriginatorFilter(e.target.value)}
              className="h-9 px-3 border rounded text-sm bg-white cursor-pointer"
            >
              <option value="All">All Originators</option>
              {originatorOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={closerFilter}
              onChange={(e) => setCloserFilter(e.target.value)}
              className="h-9 px-3 border rounded text-sm bg-white cursor-pointer"
            >
              <option value="All">All Closers</option>
              {closerOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">DEAL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[140px]">FUNDER</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[100px]">STATUS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[300px]">RESPONSE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">ERROR</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 whitespace-nowrap">AI</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[130px]">ORIGINATOR</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[130px]">CLOSERS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">SUBMITTED</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">UPDATED</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[130px]">SUBMITTED BY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">SENDER</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{submission.id}</td>
                  
                  <td className="px-4 py-3">
                    {isEditing(submission.id, 'deal') ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' ? saveEdit() : e.key === 'Escape' && cancelEdit()}
                          className="h-7 text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <Check className="w-3 h-3 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <X className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-900 font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => startEditing(submission.id, 'deal', submission.deal)}
                      >
                        {submission.deal}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <select
                      value={submission.funder}
                      onChange={(e) => updateField(submission.id, 'funder', e.target.value)}
                      className="h-8 px-2 border rounded text-sm bg-white cursor-pointer w-full"
                    >
                      {funderOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  
                  <td className="px-4 py-3">
                    <StatusDropdown
                      value={submission.status}
                      options={statusOptions}
                      getColor={getStatusColor}
                      onChange={(val) => updateField(submission.id, 'status', val)}
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[300px]">
                    {isEditing(submission.id, 'response') ? (
                      <div className="flex items-start gap-1">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                          className="w-full h-20 p-2 text-xs border rounded resize-none"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-6 w-6 p-0 cursor-pointer">
                            <Check className="w-3 h-3 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0 cursor-pointer">
                            <X className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="whitespace-pre-wrap line-clamp-3 cursor-pointer hover:text-blue-600" 
                        title={submission.response || 'Click to add response'}
                        onClick={() => startEditing(submission.id, 'response', submission.response)}
                      >
                        {submission.response || '--'}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px]">
                    {isEditing(submission.id, 'error') ? (
                      <div className="flex items-start gap-1">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                          className="w-full h-20 p-2 text-xs border rounded resize-none"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-6 w-6 p-0 cursor-pointer">
                            <Check className="w-3 h-3 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0 cursor-pointer">
                            <X className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="whitespace-pre-wrap line-clamp-3 text-orange-600 cursor-pointer hover:text-orange-800" 
                        title={submission.error || 'Click to add error'}
                        onClick={() => startEditing(submission.id, 'error', submission.error)}
                      >
                        {submission.error || '--'}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateField(submission.id, 'ai', !submission.ai)}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      {submission.ai ? (
                        <Check className="w-4 h-4 text-gray-700 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-400 mx-auto" />
                      )}
                    </button>
                  </td>
                  
                  <td className="px-4 py-3">
                    <select
                      value={submission.originator}
                      onChange={(e) => updateField(submission.id, 'originator', e.target.value)}
                      className="h-8 px-2 border rounded text-sm bg-white cursor-pointer w-full"
                    >
                      {originatorOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  
                  <td className="px-4 py-3">
                    <select
                      value={submission.closers}
                      onChange={(e) => updateField(submission.id, 'closers', e.target.value)}
                      className="h-8 px-2 border rounded text-sm bg-white cursor-pointer w-full"
                    >
                      {closerOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{submission.submitted}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{submission.updated}</td>
                  
                  <td className="px-4 py-3">
                    {isEditing(submission.id, 'submittedBy') ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' ? saveEdit() : e.key === 'Escape' && cancelEdit()}
                          className="h-7 text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <Check className="w-3 h-3 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <X className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-700 cursor-pointer hover:text-blue-600"
                        onClick={() => startEditing(submission.id, 'submittedBy', submission.submittedBy)}
                      >
                        {submission.submittedBy}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    {isEditing(submission.id, 'sender') ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' ? saveEdit() : e.key === 'Escape' && cancelEdit()}
                          className="h-7 text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <Check className="w-3 h-3 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0 cursor-pointer">
                          <X className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-500 text-xs cursor-pointer hover:text-blue-600"
                        onClick={() => startEditing(submission.id, 'sender', submission.sender)}
                      >
                        {submission.sender}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
