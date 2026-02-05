'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Shield, Flag, Tag, Users, Briefcase, Send, Tags, Key, UserCog, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectIsAdmin, selectIsAuthLoading } from '@/store/selectors/authSelectors';
import { 
  ConfigItem, 
  addConfigItem, 
  removeConfigItem, 
  updateConfigItem 
} from '@/store/slices/adminConfigSlice';

const colorOptions = [
  { name: 'Green', value: 'bg-green-100 text-green-700', preview: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-700', preview: 'bg-blue-500' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-700', preview: 'bg-yellow-500' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-700', preview: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-100 text-red-700', preview: 'bg-red-500' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-700', preview: 'bg-purple-500' },
  { name: 'Gray', value: 'bg-gray-100 text-gray-700', preview: 'bg-gray-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ConfigSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  items: ConfigItem[];
  onAdd: (value: string, color: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, value: string, color: string) => void;
}

function ConfigSection({ title, description, icon: Icon, items, onAdd, onRemove, onUpdate }: ConfigSectionProps) {
  const [newValue, setNewValue] = useState('');
  const [newColor, setNewColor] = useState(colorOptions[0].value);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim(), newColor);
      setNewValue('');
      setNewColor(colorOptions[0].value);
    }
  };

  const startEdit = (item: ConfigItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
    setEditColor(item.color);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim(), editColor);
      setEditingId(null);
      setEditValue('');
      setEditColor('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditColor('');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              {editingId === item.id ? (
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 w-32"
                    autoFocus
                  />
                  <select
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="h-8 px-2 border rounded text-sm"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.name} value={opt.value}>{opt.name}</option>
                    ))}
                  </select>
                  <Button size="sm" onClick={saveEdit} className="h-8 cursor-pointer">Save</Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 cursor-pointer">Cancel</Button>
                </div>
              ) : (
                <Badge
                  className={`${item.color} border cursor-pointer pr-7 transition-all hover:pr-8`}
                  onClick={() => startEdit(item)}
                >
                  {item.value}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <Input
            placeholder={`Add new ${title.toLowerCase().slice(0, -1)}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1"
          />
          <select
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-10 px-3 border rounded text-sm"
          >
            {colorOptions.map((opt) => (
              <option key={opt.name} value={opt.value}>{opt.name}</option>
            ))}
          </select>
          <Button onClick={handleAdd} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsAdmin);
  const isLoading = useAppSelector(selectIsAuthLoading);
  
  const statuses = useAppSelector((state) => state.adminConfig.statuses);
  const flags = useAppSelector((state) => state.adminConfig.flags);
  const products = useAppSelector((state) => state.adminConfig.products);
  const originators = useAppSelector((state) => state.adminConfig.originators);
  const closers = useAppSelector((state) => state.adminConfig.closers);
  const submissionStatuses = useAppSelector((state) => state.adminConfig.submissionStatuses);
  const tags = useAppSelector((state) => state.adminConfig.tags);
  
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleSaveAll = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  type ConfigKey = 'statuses' | 'flags' | 'products' | 'originators' | 'closers' | 'submissionStatuses' | 'tags';

  const createHandlers = (key: ConfigKey) => ({
    onAdd: (value: string, color: string) => {
      dispatch(addConfigItem({ key, item: { id: generateId(), value, color } }));
    },
    onRemove: (id: string) => {
      dispatch(removeConfigItem({ key, id }));
    },
    onUpdate: (id: string, value: string, color: string) => {
      dispatch(updateConfigItem({ key, id, value, color }));
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Admin</h1>
            <p className="text-gray-500">Configure deal options and system settings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-600 font-medium"
            >
              {saveMessage}
            </motion.span>
          )}
          <Button onClick={handleSaveAll} className="cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Role-Based Access Control</CardTitle>
                <CardDescription>Manage roles, permissions, and team members</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/admin/roles" className="block">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Role Builder</h3>
                        <p className="text-sm text-gray-500">Create and edit roles, configure permissions</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/admin/members" className="block">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Members</h3>
                        <p className="text-sm text-gray-500">Manage team members and assign roles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Statuses"
          description="Define the status options available for deals"
          icon={Tag}
          items={statuses}
          {...createHandlers('statuses')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Flags"
          description="Define flags that can be applied to deals"
          icon={Flag}
          items={flags}
          {...createHandlers('flags')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Products"
          description="Define the product types available"
          icon={Briefcase}
          items={products}
          {...createHandlers('products')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Originators"
          description="Manage the list of deal originators"
          icon={Users}
          items={originators}
          {...createHandlers('originators')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Closers"
          description="Manage the list of deal closers"
          icon={Users}
          items={closers}
          {...createHandlers('closers')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Submission Statuses"
          description="Define the status options for funder submissions"
          icon={Send}
          items={submissionStatuses}
          {...createHandlers('submissionStatuses')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Tags"
          description="Define tags to categorize and label deals"
          icon={Tags}
          items={tags}
          {...createHandlers('tags')}
        />
      </motion.div>
    </motion.div>
  );
}
