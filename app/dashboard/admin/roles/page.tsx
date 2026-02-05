'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Plus, Edit2, Trash2, Copy, ChevronDown, ChevronRight,
  Check, X, Search, Users, Lock, Unlock, Save, RefreshCw,
  AlertTriangle, CheckCircle, Settings, Eye, EyeOff
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

  const getOrgTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'PLATFORM': 'bg-purple-100 text-purple-700',
      'ISO': 'bg-blue-100 text-blue-700',
      'LENDER': 'bg-green-100 text-green-700',
      'MERCHANT': 'bg-orange-100 text-orange-700',
      'ANY': 'bg-gray-100 text-gray-700',
      'SYSTEM': 'bg-red-100 text-red-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getScopeColor = (scope: string) => {
    const colors: Record<string, string> = {
      'OWN': 'bg-gray-100 text-gray-700',
      'ASSIGNED': 'bg-blue-100 text-blue-700',
      'TEAM': 'bg-yellow-100 text-yellow-700',
      'ORG': 'bg-green-100 text-green-700',
      'GLOBAL': 'bg-purple-100 text-purple-700',
    };
    return colors[scope] || 'bg-gray-100 text-gray-700';
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
            <Shield className="w-6 h-6 text-blue-600" />
            Role Builder
          </h1>
          <p className="text-gray-500 mt-1">Manage roles and permissions for your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchMatrix} disabled={loading} className="cursor-pointer">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={selectedOrgType}
          onChange={(e) => setSelectedOrgType(e.target.value)}
          className="h-10 px-3 border rounded-lg text-sm cursor-pointer"
        >
          <option value="">All Organization Types</option>
          {ORG_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 min-w-[250px] sticky left-0 bg-gray-50">
                    Permission
                  </th>
                  {roles.map(role => (
                    <th key={role._id} className="px-2 py-3 text-center font-medium min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900 text-xs">{role.name}</span>
                          {role.isSystem && <Lock className="w-3 h-3 text-gray-400" />}
                        </div>
                        <Badge className={`text-xs ${getOrgTypeColor(role.orgType)}`}>
                          {role.orgType}
                        </Badge>
                        {!role.isSystem && (
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => setEditingRole(role)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                              onClick={() => deleteRole(role._id)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionsByGroup).map(([group, perms]) => (
                  <>
                    <tr key={`group-${group}`} className="bg-gray-100">
                      <td
                        colSpan={roles.length + 1}
                        className="px-4 py-2 font-medium text-gray-700 cursor-pointer sticky left-0 bg-gray-100"
                        onClick={() => setExpandedGroups(prev => {
                          const next = new Set(prev);
                          if (next.has(group)) next.delete(group);
                          else next.add(group);
                          return next;
                        })}
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.has(group) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {group}
                          <Badge variant="outline" className="ml-2">{perms.length}</Badge>
                        </div>
                      </td>
                    </tr>
                    {expandedGroups.has(group) && perms.map(perm => (
                      <tr key={perm._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 sticky left-0 bg-white">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{perm.key}</span>
                            <span className="text-xs text-gray-500">{perm.description}</span>
                          </div>
                        </td>
                        {roles.map(role => {
                          const cell = matrix[role._id]?.[perm._id] || { allowed: false, scope: 'OWN' };
                          const changeKey = `${role._id}-${perm._id}`;
                          const isPending = pendingChanges.has(changeKey) || pendingChanges.has(`${changeKey}-scope`);

                          return (
                            <td key={role._id} className="px-2 py-2 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  onClick={() => togglePermission(role._id, perm._id, cell.allowed)}
                                  disabled={isPending}
                                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                                    cell.allowed 
                                      ? 'bg-green-500 text-white hover:bg-green-600' 
                                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                  } ${isPending ? 'opacity-50' : ''}`}
                                >
                                  {cell.allowed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                </button>
                                {cell.allowed && (
                                  <select
                                    value={cell.scope}
                                    onChange={(e) => updateScope(role._id, perm._id, e.target.value)}
                                    disabled={isPending}
                                    className={`text-xs px-1 py-0.5 rounded border-0 cursor-pointer ${getScopeColor(cell.scope)}`}
                                  >
                                    {SCOPES.map(scope => (
                                      <option key={scope} value={scope}>{scope}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Create New Role</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <Input
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="e.g., Sales Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Key</label>
                  <Input
                    value={newRole.key}
                    onChange={(e) => setNewRole({ ...newRole, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                    placeholder="e.g., SALES_MANAGER"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier (uppercase, no spaces)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                  <select
                    value={newRole.orgType}
                    onChange={(e) => setNewRole({ ...newRole, orgType: e.target.value })}
                    className="w-full h-10 px-3 border rounded-lg cursor-pointer"
                  >
                    {ORG_TYPES.filter(t => t !== 'SYSTEM').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Input
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Brief description of this role"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clone From (Optional)</label>
                  <select
                    value={newRole.cloneFromRoleId}
                    onChange={(e) => setNewRole({ ...newRole, cloneFromRoleId: e.target.value })}
                    className="w-full h-10 px-3 border rounded-lg cursor-pointer"
                  >
                    <option value="">Start with no permissions</option>
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>{role.name} ({role.key})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Copy permissions from an existing role</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button onClick={createRole} disabled={saving || !newRole.name || !newRole.key} className="cursor-pointer">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Role
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
