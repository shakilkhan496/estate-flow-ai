'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  UserPlus, Search, Mail, Phone, Edit2, TrendingUp, Shield,
  RefreshCw, Eye, EyeOff, Key, X, UserX, UserCheck
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  roleKey: string;
  roleId: string;
  memberId: string;
  isActive: boolean;
  createdAt: string;
}

interface Role {
  _id: string;
  name: string;
  key: string;
  orgType: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/admin/roles'),
      ]);
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      setUsers(usersData.users || []);
      setRoles(rolesData.roles || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', roleId: '' });
    setShowPassword(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      roleId: user.roleId,
    });
    setEditingUser(user);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    resetForm();
  };

  const createUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.roleId) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModals();
        fetchData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser._id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roleId: formData.roleId,
          password: formData.password || undefined,
        }),
      });

      if (response.ok) {
        closeModals();
        fetchData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          isActive: !user.isActive,
        }),
      });

      if (response.ok) {
        fetchData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (roleKey: string) => {
    const key = roleKey.toUpperCase();
    if (key.includes('ADMIN') || key.includes('SUPER')) return 'bg-purple-100 text-purple-700';
    if (key.includes('MANAGER') || key.includes('OWNER')) return 'bg-blue-100 text-blue-700';
    if (key.includes('BROKER') || key.includes('SENIOR')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading} className="cursor-pointer">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateModal} className="cursor-pointer">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div key={user._id} variants={itemVariants}>
              <Card className={`hover:shadow-md transition-shadow ${!user.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className={`font-semibold ${user.isActive ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'}`}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadge(user.roleKey)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`p-1.5 rounded cursor-pointer ${user.isActive ? 'hover:bg-red-100' : 'hover:bg-green-100'}`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4 text-red-500" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500">No users found.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {(showCreateModal || editingUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button onClick={closeModals} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    {editingUser ? 'New Password (optional)' : 'Password'} 
                    {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={closeModals} className="cursor-pointer">
                  Cancel
                </Button>
                <Button 
                  onClick={editingUser ? updateUser : createUser}
                  disabled={saving}
                  className="cursor-pointer"
                >
                  {saving ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
