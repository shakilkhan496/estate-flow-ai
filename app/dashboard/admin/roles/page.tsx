'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Plus, Edit2, Trash2, ChevronDown, ChevronRight,
  Check, X, Search, Lock, RefreshCw, Sparkles, Zap, Layers
} from 'lucide-react';

interface Role {
  _id: string;
  name: string;
  key: string;
  orgType: string;
  description: string;
  isSystem: boolean;
}

interface Permission {
  _id: string;
  key: string;
  description: string;
  group: string;
}

interface MatrixCell {
  allowed: boolean;
  scope: string;
}

type Matrix = Record<string, Record<string, MatrixCell>>;

const SCOPES = ['OWN', 'ASSIGNED', 'TEAM', 'ORG', 'GLOBAL'];
const ORG_TYPES = ['PLATFORM', 'ISO', 'LENDER', 'MERCHANT', 'ANY', 'SYSTEM'];

export default function RoleBuilderPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOrgType, setSelectedOrgType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  const [newRole, setNewRole] = useState({
    name: '',
    key: '',
    orgType: 'ISO',
    description: '',
    cloneFromRoleId: '',
  });

  const fetchMatrix = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedOrgType) params.set('orgType', selectedOrgType);
      
      const response = await fetch(`/api/admin/permissions/matrix?${params}`);
      const data = await response.json();
      
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setMatrix(data.matrix || {});
      setGroups(data.groups || []);
      setExpandedGroups(new Set(data.groups || []));
    } catch (error) {
      console.error('Error fetching matrix:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedOrgType]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  const togglePermission = async (roleId: string, permissionId: string, currentAllowed: boolean) => {
    const changeKey = `${roleId}-${permissionId}`;
    setPendingChanges(prev => new Set(prev).add(changeKey));

    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: {
          ...prev[roleId][permissionId],
          allowed: !currentAllowed,
        },
      },
    }));

    try {
      await fetch('/api/admin/permissions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId,
          permissionId,
          allowed: !currentAllowed,
        }),
      });
    } catch (error) {
      console.error('Error toggling permission:', error);
      setMatrix(prev => ({
        ...prev,
        [roleId]: {
          ...prev[roleId],
          [permissionId]: {
            ...prev[roleId][permissionId],
            allowed: currentAllowed,
          },
        },
      }));
    } finally {
      setPendingChanges(prev => {
        const next = new Set(prev);
        next.delete(changeKey);
        return next;
      });
    }
  };

  const updateScope = async (roleId: string, permissionId: string, newScope: string) => {
    const changeKey = `${roleId}-${permissionId}-scope`;
    setPendingChanges(prev => new Set(prev).add(changeKey));

    const oldScope = matrix[roleId]?.[permissionId]?.scope;

    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: {
          ...prev[roleId][permissionId],
          scope: newScope,
        },
      },
    }));

    try {
      await fetch('/api/admin/permissions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId,
          permissionId,
          scope: newScope,
        }),
      });
    } catch (error) {
      console.error('Error updating scope:', error);
      setMatrix(prev => ({
        ...prev,
        [roleId]: {
          ...prev[roleId],
          [permissionId]: {
            ...prev[roleId][permissionId],
            scope: oldScope,
          },
        },
      }));
    } finally {
      setPendingChanges(prev => {
        const next = new Set(prev);
        next.delete(changeKey);
        return next;
      });
    }
  };

  const createRole = async () => {
    if (!newRole.name || !newRole.key) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewRole({ name: '', key: '', orgType: 'ISO', description: '', cloneFromRoleId: '' });
        fetchMatrix();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMatrix();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const filteredPermissions = permissions.filter(p =>
    searchTerm === '' ||
    p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissionsByGroup = filteredPermissions.reduce((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getOrgTypeStyle = (type: string) => {
    const styles: Record<string, { bg: string; text: string; glow: string }> = {
      'PLATFORM': { bg: 'bg-purple-500/20', text: 'text-purple-300', glow: 'shadow-purple-500/20' },
      'ISO': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
      'LENDER': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
      'MERCHANT': { bg: 'bg-amber-500/20', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
      'ANY': { bg: 'bg-slate-500/20', text: 'text-slate-300', glow: 'shadow-slate-500/20' },
      'SYSTEM': { bg: 'bg-rose-500/20', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
    };
    return styles[type] || styles['ANY'];
  };

  const getScopeStyle = (scope: string) => {
    const styles: Record<string, string> = {
      'OWN': 'bg-slate-700/50 text-slate-300 border-slate-600',
      'ASSIGNED': 'bg-blue-700/50 text-blue-300 border-blue-600',
      'TEAM': 'bg-amber-700/50 text-amber-300 border-amber-600',
      'ORG': 'bg-emerald-700/50 text-emerald-300 border-emerald-600',
      'GLOBAL': 'bg-purple-700/50 text-purple-300 border-purple-600',
    };
    return styles[scope] || styles['OWN'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -m-6 p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-emerald-900" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                Role Builder
              </h1>
              <p className="text-slate-400 mt-1">Configure permissions and access levels</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={fetchMatrix} 
              disabled={loading}
              className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white cursor-pointer backdrop-blur-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px] max-w-md group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm"
              />
            </div>
          </div>

          <select
            value={selectedOrgType}
            onChange={(e) => setSelectedOrgType(e.target.value)}
            className="h-12 px-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 cursor-pointer backdrop-blur-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Organization Types</option>
            {ORG_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500"
            />
            <p className="text-slate-400 mt-4">Loading permissions matrix...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700/50">
                    <tr className="bg-slate-900/50">
                      <th className="px-6 py-4 text-left font-semibold text-slate-300 min-w-[280px] sticky left-0 bg-slate-900/90 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Permission
                        </div>
                      </th>
                      {roles.map((role, index) => {
                        const style = getOrgTypeStyle(role.orgType);
                        return (
                          <th key={role._id} className="px-3 py-4 text-center font-medium min-w-[140px]">
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-sm">{role.name}</span>
                                {role.isSystem && (
                                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-amber-400" />
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border border-current/20`}>
                                {role.orgType}
                              </span>
                              {!role.isSystem && (
                                <div className="flex items-center gap-1 mt-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditingRole(role)}
                                    className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => deleteRole(role._id)}
                                    className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              )}
                            </motion.div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissionsByGroup).map(([group, perms], groupIndex) => (
                      <>
                        <tr key={`group-${group}`}>
                          <td
                            colSpan={roles.length + 1}
                            className="px-6 py-3 cursor-pointer sticky left-0 bg-slate-800/80 backdrop-blur-sm z-10"
                            onClick={() => setExpandedGroups(prev => {
                              const next = new Set(prev);
                              if (next.has(group)) next.delete(group);
                              else next.add(group);
                              return next;
                            })}
                          >
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: groupIndex * 0.05 }}
                              className="flex items-center gap-3"
                            >
                              <motion.div
                                animate={{ rotate: expandedGroups.has(group) ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-6 h-6 rounded-lg bg-slate-700/50 flex items-center justify-center"
                              >
                                <ChevronRight className="w-4 h-4 text-cyan-400" />
                              </motion.div>
                              <span className="font-semibold text-white">{group}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-300 font-medium">
                                {perms.length}
                              </span>
                            </motion.div>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {expandedGroups.has(group) && perms.map((perm, permIndex) => (
                            <motion.tr 
                              key={perm._id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ delay: permIndex * 0.02 }}
                              className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                            >
                              <td className="px-6 py-3 sticky left-0 bg-slate-800/60 backdrop-blur-sm z-10">
                                <div className="flex flex-col pl-9">
                                  <code className="font-mono text-cyan-300 text-sm">{perm.key}</code>
                                  <span className="text-xs text-slate-500 mt-0.5">{perm.description}</span>
                                </div>
                              </td>
                              {roles.map(role => {
                                const cell = matrix[role._id]?.[perm._id] || { allowed: false, scope: 'OWN' };
                                const changeKey = `${role._id}-${perm._id}`;
                                const isPending = pendingChanges.has(changeKey) || pendingChanges.has(`${changeKey}-scope`);

                                return (
                                  <td key={role._id} className="px-3 py-3 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => togglePermission(role._id, perm._id, cell.allowed)}
                                        disabled={isPending}
                                        className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                          cell.allowed 
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                                            : 'bg-slate-700/50 text-slate-500 hover:bg-slate-600/50 hover:text-slate-300'
                                        } ${isPending ? 'opacity-50 animate-pulse' : ''}`}
                                      >
                                        {cell.allowed ? (
                                          <Check className="w-4 h-4" />
                                        ) : (
                                          <X className="w-4 h-4" />
                                        )}
                                        {cell.allowed && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-300 rounded-full"
                                          />
                                        )}
                                      </motion.button>
                                      {cell.allowed && (
                                        <motion.select
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          value={cell.scope}
                                          onChange={(e) => updateScope(role._id, perm._id, e.target.value)}
                                          disabled={isPending}
                                          className={`text-xs px-2 py-1 rounded-lg border cursor-pointer backdrop-blur-sm ${getScopeStyle(cell.scope)} ${isPending ? 'opacity-50' : ''}`}
                                        >
                                          {SCOPES.map(scope => (
                                            <option key={scope} value={scope} className="bg-slate-800">{scope}</option>
                                          ))}
                                        </motion.select>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative max-w-lg w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Role</h2>
                      <p className="text-sm text-slate-400">Define a new role with custom permissions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Role Name</label>
                      <Input
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        placeholder="e.g., Sales Manager"
                        className="h-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Role Key</label>
                      <Input
                        value={newRole.key}
                        onChange={(e) => setNewRole({ ...newRole, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                        placeholder="e.g., SALES_MANAGER"
                        className="h-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500 font-mono"
                      />
                      <p className="text-xs text-slate-500 mt-1.5">Unique identifier (uppercase, underscores)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Organization Type</label>
                      <select
                        value={newRole.orgType}
                        onChange={(e) => setNewRole({ ...newRole, orgType: e.target.value })}
                        className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white cursor-pointer focus:border-cyan-500 focus:outline-none"
                      >
                        {ORG_TYPES.filter(t => t !== 'SYSTEM').map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <Input
                        value={newRole.description}
                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                        placeholder="Brief description of this role"
                        className="h-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clone From (Optional)</label>
                      <select
                        value={newRole.cloneFromRoleId}
                        onChange={(e) => setNewRole({ ...newRole, cloneFromRoleId: e.target.value })}
                        className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white cursor-pointer focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Start with no permissions</option>
                        {roles.map(role => (
                          <option key={role._id} value={role._id}>{role.name} ({role.key})</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-1.5">Copy permissions from an existing role</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateModal(false)}
                      className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={createRole} 
                      disabled={saving || !newRole.name || !newRole.key}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer"
                    >
                      {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Create Role
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
