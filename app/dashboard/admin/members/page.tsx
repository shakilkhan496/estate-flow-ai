'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Plus, Edit2, UserX, UserCheck, Search, RefreshCw,
  Mail, Shield, Building2, Clock
} from 'lucide-react';

interface Member {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
  roleId: {
    _id: string;
    name: string;
    key: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface Role {
  _id: string;
  name: string;
  key: string;
  orgType: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    roleId: '',
  });

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const [membersRes, rolesRes] = await Promise.all([
        fetch('/api/admin/members'),
        fetch('/api/admin/roles'),
      ]);

      const membersData = await membersRes.json();
      const rolesData = await rolesRes.json();

      setMembers(membersData.members || []);
      setRoles(rolesData.roles || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const inviteMember = async () => {
    if (!inviteData.email || !inviteData.roleId) return;

    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData),
      });

      if (response.ok) {
        setShowInviteModal(false);
        setInviteData({ email: '', name: '', roleId: '' });
        fetchMembers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const updateMember = async (memberId: string, updates: { roleId?: string; isActive?: boolean }) => {
    try {
      const response = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, ...updates }),
      });

      if (response.ok) {
        setEditingMember(null);
        fetchMembers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update member');
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const filteredMembers = members.filter(m =>
    searchTerm === '' ||
    m.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.roleId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Organization Members
          </h1>
          <p className="text-gray-500 mt-1">Manage team members and their roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchMembers} disabled={loading} className="cursor-pointer">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowInviteModal(true)} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map(member => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white border rounded-lg p-4 ${!member.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    member.isActive ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {member.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.userId.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {member.userId.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => updateMember(member._id, { isActive: !member.isActive })}
                    className={`p-1 rounded ${member.isActive ? 'hover:bg-red-100' : 'hover:bg-green-100'}`}
                  >
                    {member.isActive ? (
                      <UserX className="w-4 h-4 text-red-500" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700">
                  <Shield className="w-3 h-3 mr-1" />
                  {member.roleId.name}
                </Badge>
                {!member.isActive && (
                  <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                )}
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Joined {formatDate(member.createdAt)}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Invite New Member</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                  <Input
                    value={inviteData.name}
                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={inviteData.roleId}
                    onChange={(e) => setInviteData({ ...inviteData, roleId: e.target.value })}
                    className="w-full h-10 px-3 border rounded-lg cursor-pointer"
                  >
                    <option value="">Select a role...</option>
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>
                        {role.name} ({role.orgType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button 
                  onClick={inviteMember} 
                  disabled={!inviteData.email || !inviteData.roleId}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Edit Member Role</h2>
              
              <div className="mb-4">
                <p className="text-gray-600">{editingMember.userId.name}</p>
                <p className="text-sm text-gray-400">{editingMember.userId.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  defaultValue={editingMember.roleId._id}
                  onChange={(e) => updateMember(editingMember._id, { roleId: e.target.value })}
                  className="w-full h-10 px-3 border rounded-lg cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.name} ({role.orgType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEditingMember(null)} className="cursor-pointer">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
