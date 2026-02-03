'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, MoreHorizontal, DollarSign, 
  User, Clock, GripVertical, ChevronLeft, ChevronRight,
  Building2, Phone, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Owner {
  id: string;
  name: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  homeAddress: string;
  percentOwned: string;
}

interface Deal {
  id: string;
  company: string;
  dealId: string;
  status: string;
  amount: number | null;
  owner: string;
  phone: string;
  email: string;
  dba: string;
  dateCreated: string;
  dateUpdated: string | null;
  owners?: Owner[];
}

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

const sampleDeals: Deal[] = [
  { id: '1', company: 'Plash Transportation', dealId: 'D-001', status: 'new-application', amount: 0, owner: 'Marc Willis', phone: '(555) 123-4567', email: 'contact@plash.com', dba: 'Plash Trans', dateCreated: '3 months ago', dateUpdated: null },
  { id: '2', company: 'Resources Universal Services', dealId: 'D-002', status: 'new-application', amount: null, owner: 'Marc Willis', phone: '(555) 234-5678', email: 'info@rus.com', dba: 'RUS', dateCreated: '4 months ago', dateUpdated: null },
  { id: '3', company: 'New Horizon Contractors', dealId: 'D-003', status: 'new-application', amount: null, owner: 'Marc Willis', phone: '(555) 345-6789', email: 'hello@nhc.com', dba: 'NHC', dateCreated: '2 months ago', dateUpdated: null },
  { id: '4', company: 'A M Casa Electric LLC', dealId: 'D-004', status: 'new-application', amount: null, owner: 'Marc Willis', phone: '(555) 456-7890', email: 'amcasa@email.com', dba: 'AM Casa', dateCreated: '1 month ago', dateUpdated: null },
  { id: '5', company: 'Gold Automotive Group', dealId: 'D-005', status: 'new-application', amount: null, owner: 'Marc Willis', phone: '(555) 567-8901', email: 'gold@auto.com', dba: 'Gold Auto', dateCreated: '1 month ago', dateUpdated: null },
  { id: '6', company: 'Kings Auto Collision Center', dealId: 'D-006', status: 'missing-documents', amount: 35000, owner: 'Marc Willis', phone: '(555) 678-9012', email: 'kings@collision.com', dba: 'Kings Auto', dateCreated: '6 months ago', dateUpdated: null },
  { id: '7', company: 'Bluefit Counters LLC', dealId: 'D-007', status: 'missing-documents', amount: null, owner: 'Marc Willis', phone: '(555) 789-0123', email: 'bluefit@counters.com', dba: 'Bluefit', dateCreated: '6 months ago', dateUpdated: null },
  { id: '8', company: 'C. H. Auto Sales', dealId: 'D-008', status: 'missing-documents', amount: 30000, owner: 'Marc Willis', phone: '(555) 890-1234', email: 'ch@autosales.com', dba: 'CH Auto', dateCreated: '8 months ago', dateUpdated: null },
  { id: '9', company: 'Black Rhino Energy Services Inc', dealId: 'D-009', status: 'ready-to-submit', amount: 0, owner: 'Marc Willis', phone: '(555) 901-2345', email: 'black@rhino.com', dba: 'Black Rhino', dateCreated: '1 day ago', dateUpdated: null },
  { id: '10', company: 'Harry Sandstochne N O.P.A.', dealId: 'D-010', status: 'ready-to-submit', amount: null, owner: 'Marc Willis', phone: '(555) 012-3456', email: 'harry@sand.com', dba: 'NOPA', dateCreated: '22 days ago', dateUpdated: null },
  { id: '11', company: 'Harmony Hills Recreation', dealId: 'D-011', status: 'ready-to-submit', amount: null, owner: 'Marc Willis', phone: '(555) 111-2222', email: 'harmony@hills.com', dba: 'Harmony', dateCreated: '10 days ago', dateUpdated: null },
  { id: '12', company: 'Red Diamond Marketing LLC', dealId: 'D-012', status: 'submitted', amount: null, owner: 'Marc Willis', phone: '(555) 222-3333', email: 'red@diamond.com', dba: 'Red Diamond', dateCreated: '1 month ago', dateUpdated: null },
  { id: '13', company: 'Fulcrum Institute Dispute Resolution', dealId: 'D-013', status: 'submitted', amount: null, owner: 'Marc Willis', phone: '(555) 333-4444', email: 'fulcrum@institute.com', dba: 'Fulcrum', dateCreated: '4 days ago', dateUpdated: null },
  { id: '14', company: 'Global Numeristics', dealId: 'D-014', status: 'submitted', amount: null, owner: 'Marc Willis', phone: '(555) 444-5555', email: 'global@num.com', dba: 'Global Num', dateCreated: '6 months ago', dateUpdated: null },
  { id: '15', company: 'Kvantt Advisors LLC', dealId: 'D-015', status: 'approved', amount: 17521944.47, owner: 'Marc Willis', phone: '(555) 555-6666', email: 'kvantt@advisors.com', dba: 'Kvantt', dateCreated: '1 month ago', dateUpdated: null },
  { id: '16', company: 'About The Wake Inc.', dealId: 'D-016', status: 'approved', amount: null, owner: 'Marc Willis', phone: '(555) 666-7777', email: 'about@wake.com', dba: 'The Wake', dateCreated: '6 days ago', dateUpdated: null },
  { id: '17', company: 'PAAS Group Inc', dealId: 'D-017', status: 'approved', amount: 250000, owner: 'Marc Willis', phone: '(555) 777-8888', email: 'paas@group.com', dba: 'PAAS', dateCreated: '8 months ago', dateUpdated: null },
  { id: '18', company: 'Acuity PMR Consulting LLC', dealId: 'D-018', status: 'offer-selected', amount: 35000, owner: 'Marc Willis', phone: '(555) 888-9999', email: 'acuity@pmr.com', dba: 'Acuity', dateCreated: '6 months ago', dateUpdated: null },
  { id: '19', company: 'Hall Enterprises and Contracting LLC', dealId: 'D-019', status: 'approved', amount: 30000, owner: 'Marc Willis', phone: '(555) 999-0000', email: 'hall@ent.com', dba: 'Hall Ent', dateCreated: '8 months ago', dateUpdated: null },
  { id: '20', company: 'Emergency Teleradiology LLC', dealId: 'D-020', status: 'approved', amount: 150000, owner: 'Marc Willis', phone: '(555) 000-1111', email: 'emerg@tele.com', dba: 'EmTel', dateCreated: '8 months ago', dateUpdated: null },
];

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  if (value === 0) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
}

function DealCard({ deal, onDragStart }: DealCardProps) {
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
          {deal.amount !== null && deal.amount > 0 && (
            <p className="text-sm font-semibold text-green-600 mt-0.5">
              {formatCurrency(deal.amount)}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer shrink-0">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <User className="w-3 h-3" />
        <span className="truncate">{deal.owner}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
        <Clock className="w-3 h-3" />
        <span>{deal.dateCreated}</span>
      </div>
    </motion.div>
  );
}

interface PipelineColumnProps {
  stage: typeof pipelineStages[0];
  deals: Deal[];
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  totalAmount: number;
}

function PipelineColumn({ stage, deals, onDragStart, onDragOver, onDrop, totalAmount }: PipelineColumnProps) {
  return (
    <div 
      className="flex-shrink-0 w-[280px] bg-gray-50 rounded-lg flex flex-col max-h-full"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <div className="p-3 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stage.color}`} />
            <h3 className="font-medium text-gray-900 text-sm">{stage.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {deals.length}
          </Badge>
        </div>
        {totalAmount > 0 && (
          <p className="text-xs text-gray-500">{formatCurrency(totalAmount)}</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
        <AnimatePresence>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
          ))}
        </AnimatePresence>
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const filteredDeals = deals.filter((deal) => {
    if (!searchQuery) return true;
    return deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
           deal.owner.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDealsByStage = (stageId: string) => {
    return filteredDeals.filter(deal => deal.status === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.amount || 0), 0);
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
      setDeals(prev => prev.map(deal => 
        deal.id === draggedDeal.id ? { ...deal, status: stageId } : deal
      ));
      setDraggedDeal(null);
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('pipeline-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('pipeline-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Drag and drop deals between stages</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/deals">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Filter className="w-4 h-4 mr-1" />
              Table View
            </Button>
          </Link>
          <Link href="/dashboard/deals/new">
            <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              New deal
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white border rounded-lg p-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredDeals.length} deals across {pipelineStages.length} stages
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 relative bg-white border rounded-lg overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 rounded-full shadow-lg bg-white cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 rounded-full shadow-lg bg-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div 
          id="pipeline-container"
          className="flex gap-3 p-4 overflow-x-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollBehavior: 'smooth' }}
        >
          {pipelineStages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={getDealsByStage(stage.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              totalAmount={getStageTotal(stage.id)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
