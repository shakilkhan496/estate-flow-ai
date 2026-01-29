'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Search, Mail, Phone, MoreVertical, TrendingUp, FileText, Shield } from 'lucide-react';

const sampleTeamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@mcapilot.com',
    phone: '(555) 123-4567',
    role: 'admin',
    status: 'Active',
    dealsThisMonth: 12,
    totalFunded: '$845,000',
    joinedAt: '2024-06-15',
  },
  {
    id: 2,
    name: 'Mike Wilson',
    email: 'mike@mcapilot.com',
    phone: '(555) 234-5678',
    role: 'manager',
    status: 'Active',
    dealsThisMonth: 8,
    totalFunded: '$520,000',
    joinedAt: '2024-08-20',
  },
  {
    id: 3,
    name: 'Tom Brown',
    email: 'tom@mcapilot.com',
    phone: '(555) 345-6789',
    role: 'broker',
    status: 'Active',
    dealsThisMonth: 6,
    totalFunded: '$380,000',
    joinedAt: '2024-10-01',
  },
  {
    id: 4,
    name: 'Emily Chen',
    email: 'emily@mcapilot.com',
    phone: '(555) 456-7890',
    role: 'broker',
    status: 'Active',
    dealsThisMonth: 9,
    totalFunded: '$610,000',
    joinedAt: '2024-09-10',
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'david@mcapilot.com',
    phone: '(555) 567-8901',
    role: 'user',
    status: 'Inactive',
    dealsThisMonth: 0,
    totalFunded: '$150,000',
    joinedAt: '2024-11-15',
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa@mcapilot.com',
    phone: '(555) 678-9012',
    role: 'broker',
    status: 'Active',
    dealsThisMonth: 4,
    totalFunded: '$290,000',
    joinedAt: '2025-01-05',
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

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = sampleTeamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'broker': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <Button className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleTeamMembers.length}</p>
              <p className="text-sm text-gray-500">Total Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleTeamMembers.filter(m => m.status === 'Active').length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleTeamMembers.reduce((sum, m) => sum + m.dealsThisMonth, 0)}</p>
              <p className="text-sm text-gray-500">Deals This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">$2.8M</p>
              <p className="text-sm text-gray-500">Total Funded</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadge(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{member.dealsThisMonth}</p>
                    <p className="text-xs text-gray-500">Deals This Month</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{member.totalFunded}</p>
                    <p className="text-xs text-gray-500">Total Funded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredMembers.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500">No team members found.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
