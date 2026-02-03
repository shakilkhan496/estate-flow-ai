'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Download, ChevronLeft, ChevronRight, Check, Minus,
  Send, Filter
} from 'lucide-react';

interface Submission {
  id: number;
  dealId: string;
  deal: string;
  funder: string;
  status: 'declined' | 'approved' | 'sent' | 'errored' | 'pending';
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

const statusColors: Record<Submission['status'], string> = {
  declined: 'bg-red-100 text-red-700 border-red-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  sent: 'bg-blue-100 text-blue-700 border-blue-200',
  errored: 'bg-orange-100 text-orange-700 border-orange-200',
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function SubmissionsPage() {
  const [submissions] = useState<Submission[]>(sampleSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [funderFilter, setFunderFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const funders = ['All', ...new Set(submissions.map(s => s.funder))];
  const statuses = ['All', 'declined', 'approved', 'sent', 'errored', 'pending'];

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = !searchQuery || 
      sub.deal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.funder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.dealId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesFunder = funderFilter === 'All' || sub.funder === funderFilter;
    return matchesSearch && matchesStatus && matchesFunder;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <div className="flex items-center gap-2">
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">FUNDER</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">STATUS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[300px]">RESPONSE</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">ERROR</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 whitespace-nowrap">AI</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">ORIGINATOR</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">CLOSERS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">SUBMITTED</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">UPDATED</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">SUBMITTED BY</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">SENDER</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{submission.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900 font-medium">{submission.deal}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{submission.funder}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusColors[submission.status]} border`}>
                      {submission.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[300px]">
                    <div className="whitespace-pre-wrap line-clamp-3" title={submission.response}>
                      {submission.response || '--'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px]">
                    <div className="whitespace-pre-wrap line-clamp-3 text-orange-600" title={submission.error}>
                      {submission.error || '--'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {submission.ai ? (
                      <Check className="w-4 h-4 text-gray-700 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{submission.originator}</td>
                  <td className="px-4 py-3 text-gray-700">{submission.closers}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{submission.submitted}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{submission.updated}</td>
                  <td className="px-4 py-3 text-gray-700">{submission.submittedBy}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{submission.sender}</td>
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
