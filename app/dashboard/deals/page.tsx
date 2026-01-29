'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreVertical, Building2, DollarSign, Calendar, User } from 'lucide-react';

const sampleDeals = [
  {
    id: 1,
    businessName: 'Acme Restaurant LLC',
    ownerName: 'John Smith',
    requestedAmount: 75000,
    status: 'Funded',
    stage: 'Closed',
    createdAt: '2025-01-15',
    broker: 'Sarah Johnson',
  },
  {
    id: 2,
    businessName: 'Quick Mart Inc',
    ownerName: 'Maria Garcia',
    requestedAmount: 45000,
    status: 'Pending',
    stage: 'Underwriting',
    createdAt: '2025-01-20',
    broker: 'Mike Wilson',
  },
  {
    id: 3,
    businessName: 'City Auto Repair',
    ownerName: 'David Lee',
    requestedAmount: 120000,
    status: 'Under Review',
    stage: 'Documents',
    createdAt: '2025-01-22',
    broker: 'Sarah Johnson',
  },
  {
    id: 4,
    businessName: 'Downtown Fitness',
    ownerName: 'Emily Chen',
    requestedAmount: 85000,
    status: 'Documents Needed',
    stage: 'Application',
    createdAt: '2025-01-25',
    broker: 'Tom Brown',
  },
  {
    id: 5,
    businessName: 'Tech Solutions Pro',
    ownerName: 'James Wilson',
    requestedAmount: 200000,
    status: 'Approved',
    stage: 'Offer',
    createdAt: '2025-01-26',
    broker: 'Mike Wilson',
  },
  {
    id: 6,
    businessName: 'Green Landscaping',
    ownerName: 'Lisa Anderson',
    requestedAmount: 35000,
    status: 'Declined',
    stage: 'Closed',
    createdAt: '2025-01-10',
    broker: 'Sarah Johnson',
  },
];

const stages = ['All', 'Application', 'Documents', 'Underwriting', 'Offer', 'Closed'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStage, setActiveStage] = useState('All');

  const filteredDeals = sampleDeals.filter((deal) => {
    const matchesSearch = deal.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = activeStage === 'All' || deal.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Funded': return 'bg-green-100 text-green-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Under Review': return 'bg-purple-100 text-purple-700';
      case 'Documents Needed': return 'bg-orange-100 text-orange-700';
      case 'Declined': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">Manage your deal pipeline</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {stages.map((stage) => (
          <Button
            key={stage}
            variant={activeStage === stage ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStage(stage)}
            className="whitespace-nowrap"
          >
            {stage}
          </Button>
        ))}
      </motion.div>

      <motion.div variants={containerVariants} className="grid gap-4">
        {filteredDeals.map((deal) => (
          <motion.div key={deal.id} variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{deal.businessName}</h3>
                        <p className="text-sm text-gray-500">{deal.ownerName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">${deal.requestedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{deal.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{deal.broker}</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(deal.status)}`}>
                      {deal.status}
                    </span>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredDeals.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500">No deals found matching your criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
