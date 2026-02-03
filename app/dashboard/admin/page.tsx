'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Shield, Flag, Tag, Users, Briefcase, Send } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectIsAdmin, selectIsAuthLoading } from '@/store/selectors/authSelectors';

interface ConfigItem {
  id: string;
  value: string;
  color: string;
}

const colorOptions = [
  { name: 'Green', value: 'bg-green-100 text-green-700', preview: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-700', preview: 'bg-blue-500' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-700', preview: 'bg-yellow-500' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-700', preview: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-100 text-red-700', preview: 'bg-red-500' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-700', preview: 'bg-purple-500' },
  { name: 'Gray', value: 'bg-gray-100 text-gray-700', preview: 'bg-gray-500' },
];

const defaultStatuses: ConfigItem[] = [
  { id: '1', value: 'Ready to Submit', color: 'bg-blue-100 text-blue-700' },
  { id: '2', value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { id: '3', value: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
  { id: '4', value: 'Approved', color: 'bg-green-100 text-green-700' },
  { id: '5', value: 'Funded', color: 'bg-green-100 text-green-700' },
  { id: '6', value: 'Declined', color: 'bg-red-100 text-red-700' },
  { id: '7', value: 'Withdrawn', color: 'bg-orange-100 text-orange-700' },
];

const defaultFlags: ConfigItem[] = [
  { id: '1', value: 'Awaiting Additional Documents', color: 'bg-yellow-100 text-yellow-700' },
  { id: '2', value: 'Stiplisted', color: 'bg-purple-100 text-purple-700' },
  { id: '3', value: 'Priority', color: 'bg-red-100 text-red-700' },
  { id: '4', value: 'VIP Client', color: 'bg-blue-100 text-blue-700' },
  { id: '5', value: 'Needs Review', color: 'bg-orange-100 text-orange-700' },
];

const defaultProducts: ConfigItem[] = [
  { id: '1', value: 'MCA', color: 'bg-blue-100 text-blue-700' },
  { id: '2', value: 'Term Loan', color: 'bg-green-100 text-green-700' },
  { id: '3', value: 'Line of Credit', color: 'bg-purple-100 text-purple-700' },
  { id: '4', value: 'Equipment Financing', color: 'bg-orange-100 text-orange-700' },
  { id: '5', value: 'SBA Loan', color: 'bg-gray-100 text-gray-700' },
];

const defaultOriginators: ConfigItem[] = [
  { id: '1', value: 'Main Wills', color: 'bg-gray-100 text-gray-700' },
  { id: '2', value: 'Sarah Johnson', color: 'bg-gray-100 text-gray-700' },
  { id: '3', value: 'Mike Chen', color: 'bg-gray-100 text-gray-700' },
];

const defaultClosers: ConfigItem[] = [
  { id: '1', value: 'Tom Brown', color: 'bg-gray-100 text-gray-700' },
  { id: '2', value: 'Lisa Wong', color: 'bg-gray-100 text-gray-700' },
  { id: '3', value: 'David Miller', color: 'bg-gray-100 text-gray-700' },
];

const defaultSubmissionStatuses: ConfigItem[] = [
  { id: '1', value: 'declined', color: 'bg-red-100 text-red-700' },
  { id: '2', value: 'approved', color: 'bg-green-100 text-green-700' },
  { id: '3', value: 'sent', color: 'bg-blue-100 text-blue-700' },
  { id: '4', value: 'errored', color: 'bg-orange-100 text-orange-700' },
  { id: '5', value: 'pending', color: 'bg-gray-100 text-gray-700' },
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

  const handleStartEdit = (item: ConfigItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
    setEditColor(item.color);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim(), editColor);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditColor('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              {editingId === item.id ? (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 w-40"
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
                  <Button size="sm" onClick={handleSaveEdit} className="h-8 cursor-pointer">
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 cursor-pointer">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  className={`${item.color} cursor-pointer hover:opacity-80 transition-opacity pr-6`}
                  onClick={() => handleStartEdit(item)}
                >
                  {item.value}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
  const isAdmin = useAppSelector(selectIsAdmin);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const [statuses, setStatuses] = useState<ConfigItem[]>(defaultStatuses);
  const [flags, setFlags] = useState<ConfigItem[]>(defaultFlags);
  const [products, setProducts] = useState<ConfigItem[]>(defaultProducts);
  const [originators, setOriginators] = useState<ConfigItem[]>(defaultOriginators);
  const [closers, setClosers] = useState<ConfigItem[]>(defaultClosers);
  const [submissionStatuses, setSubmissionStatuses] = useState<ConfigItem[]>(defaultSubmissionStatuses);
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

  const createHandlers = (
    items: ConfigItem[],
    setItems: React.Dispatch<React.SetStateAction<ConfigItem[]>>
  ) => ({
    onAdd: (value: string, color: string) => {
      setItems([...items, { id: generateId(), value, color }]);
    },
    onRemove: (id: string) => {
      setItems(items.filter((item) => item.id !== id));
    },
    onUpdate: (id: string, value: string, color: string) => {
      setItems(items.map((item) => (item.id === id ? { ...item, value, color } : item)));
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
        <ConfigSection
          title="Statuses"
          description="Define the status options available for deals"
          icon={Tag}
          items={statuses}
          {...createHandlers(statuses, setStatuses)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Flags"
          description="Define flags that can be applied to deals"
          icon={Flag}
          items={flags}
          {...createHandlers(flags, setFlags)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Products"
          description="Define the product types available"
          icon={Briefcase}
          items={products}
          {...createHandlers(products, setProducts)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Originators"
          description="Manage the list of deal originators"
          icon={Users}
          items={originators}
          {...createHandlers(originators, setOriginators)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Closers"
          description="Manage the list of deal closers"
          icon={Users}
          items={closers}
          {...createHandlers(closers, setClosers)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfigSection
          title="Submission Statuses"
          description="Define the status options for funder submissions"
          icon={Send}
          items={submissionStatuses}
          {...createHandlers(submissionStatuses, setSubmissionStatuses)}
        />
      </motion.div>
    </motion.div>
  );
}
