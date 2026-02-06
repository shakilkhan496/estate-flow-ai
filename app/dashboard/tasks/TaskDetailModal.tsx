'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedTaskId, selectTasks, selectStatuses } from '@/store/selectors/taskSelectors';
import { setSelectedTask } from '@/store/slices/taskSlice';
import type { TaskItem, TaskStatusItem, TaskUser } from '@/store/slices/taskSlice';
import { editTask, deleteTask, createTask } from '@/store/actions/taskActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X, Edit3, Check, ChevronDown, Calendar, User, Tag,
  CheckSquare, Square, Plus, Trash2, Link2, MessageSquare,
  Activity, Archive, AlertTriangle, Clock, Circle, Send, Layers,
} from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  userId: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

interface ActivityItem {
  _id: string;
  action: string;
  description: string;
  userId: { _id: string; name: string } | string;
  createdAt: string;
}

interface SubtaskItem {
  _id: string;
  title: string;
  statusId: string | TaskStatusItem;
  priority: string;
}

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const CRM_LINK_TYPES = ['deal', 'submission', 'offer', 'merchant', 'contact'];

const priorityColors: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

function getStatusInfo(statusId: string | TaskStatusItem, statuses: TaskStatusItem[]): { name: string; color: string } {
  if (typeof statusId === 'object' && statusId !== null) {
    return { name: statusId.name, color: statusId.color };
  }
  const found = statuses.find(s => s._id === statusId);
  return found ? { name: found.name, color: found.color } : { name: 'Unknown', color: '#64748b' };
}

function getAssigneeName(assigneeId: TaskUser | string | null, teamMembers: Array<{ _id: string; name: string }> = []): string {
  if (!assigneeId) return 'Unassigned';
  if (typeof assigneeId === 'object') return assigneeId.name;
  if (typeof assigneeId === 'string') {
    const found = teamMembers.find(m => m._id === assigneeId);
    return found ? found.name : 'Assigned';
  }
  return 'Unassigned';
}

function getUserName(user: { _id: string; name: string } | string): string {
  if (typeof user === 'object' && user !== null) return user.name;
  return 'Unknown';
}

interface ModalProps {
  teamMembers?: Array<{ _id: string; name: string; email: string; role: string }>;
}

export default function TaskDetailModal({ teamMembers = [] }: ModalProps) {
  const dispatch = useAppDispatch();
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const tasks = useAppSelector(selectTasks);
  const statuses = useAppSelector(selectStatuses);

  const taskFromStore = tasks.find(t => t._id === selectedTaskId) || null;
  const [fetchedTask, setFetchedTask] = useState<TaskItem | null>(null);
  const task = taskFromStore || fetchedTask;

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showCrmForm, setShowCrmForm] = useState(false);
  const [crmType, setCrmType] = useState('deal');
  const [crmLabel, setCrmLabel] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    dispatch(setSelectedTask(null));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedTaskId) return;
    if (!taskFromStore) {
      const fetchTaskById = async () => {
        try {
          const res = await fetch(`/api/tasks/items/${selectedTaskId}`);
          if (res.ok) {
            const data = await res.json();
            setFetchedTask(data.task);
          }
        } catch { /* silent */ }
      };
      fetchTaskById();
    } else {
      setFetchedTask(null);
    }
  }, [selectedTaskId, taskFromStore]);

  useEffect(() => {
    if (!selectedTaskId) return;

    const fetchSubtasks = async () => {
      try {
        const res = await fetch(`/api/tasks/items?parentTaskId=${selectedTaskId}`);
        if (res.ok) {
          const data = await res.json();
          setSubtasks(data.tasks || []);
        }
      } catch { /* silent */ }
    };

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/tasks/items/${selectedTaskId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch { /* silent */ }
      setLoadingComments(false);
    };

    const fetchActivities = async () => {
      setLoadingActivities(true);
      try {
        const res = await fetch(`/api/tasks/items/${selectedTaskId}/activity`);
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || data.activity || []);
        }
      } catch { /* silent */ }
      setLoadingActivities(false);
    };

    fetchSubtasks();
    fetchComments();
    fetchActivities();

    return () => {
      setSubtasks([]);
      setComments([]);
      setActivities([]);
      setConfirmDelete(false);
      setShowCrmForm(false);
      setEditingTitle(false);
      setEditingDesc(false);
      setShowStatusDropdown(false);
      setShowPriorityDropdown(false);
      setShowDateInput(false);
    };
  }, [selectedTaskId]);

  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingDesc && descRef.current) descRef.current.focus();
  }, [editingDesc]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (selectedTaskId) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedTaskId, handleClose]);

  if (!task) return null;

  const statusInfo = getStatusInfo(task.statusId, statuses);
  const statusId = typeof task.statusId === 'object' ? task.statusId._id : task.statusId;

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== task.title) {
      dispatch(editTask(task._id, { title: trimmed }) as any);
    }
    setEditingTitle(false);
  };

  const saveDescription = () => {
    if (descDraft !== task.description) {
      dispatch(editTask(task._id, { description: descDraft }) as any);
    }
    setEditingDesc(false);
  };

  const handleStatusChange = (newStatusId: string) => {
    dispatch(editTask(task._id, { statusId: newStatusId }) as any);
    setShowStatusDropdown(false);
  };

  const handlePriorityChange = (newPriority: string) => {
    dispatch(editTask(task._id, { priority: newPriority }) as any);
    setShowPriorityDropdown(false);
  };

  const handleDueDateChange = (date: string) => {
    dispatch(editTask(task._id, { dueDate: date || null }) as any);
    setShowDateInput(false);
  };

  const toggleChecklistItem = (itemId: string) => {
    const updated = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    dispatch(editTask(task._id, { checklist: updated }) as any);
  };

  const addChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    const newItem = { id: `cl_${Date.now()}`, text, completed: false };
    const updated = [...task.checklist, newItem];
    dispatch(editTask(task._id, { checklist: updated }) as any);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (itemId: string) => {
    const updated = task.checklist.filter(item => item.id !== itemId);
    dispatch(editTask(task._id, { checklist: updated }) as any);
  };

  const addSubtask = async () => {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    const result = await dispatch(createTask({
      title,
      listId: task.listId,
      spaceId: task.spaceId,
      statusId,
      parentTaskId: task._id,
      priority: 'medium',
    }) as any);
    if (result?.success && result.task) {
      setSubtasks(prev => [...prev, result.task]);
    }
    setNewSubtaskTitle('');
  };

  const addCrmLink = () => {
    const label = crmLabel.trim();
    if (!label) return;
    const newLink = { type: crmType, refId: `ref_${Date.now()}`, label };
    const updated = [...task.crmLinks, newLink];
    dispatch(editTask(task._id, { crmLinks: updated }) as any);
    setCrmLabel('');
    setShowCrmForm(false);
  };

  const removeCrmLink = (index: number) => {
    const updated = task.crmLinks.filter((_, i) => i !== index);
    dispatch(editTask(task._id, { crmLinks: updated }) as any);
  };

  const submitComment = async () => {
    const content = newComment.trim();
    if (!content || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/tasks/items/${task._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          setComments(prev => [...prev, data.comment]);
        }
        setNewComment('');
      }
    } catch { /* silent */ }
    setSubmittingComment(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await dispatch(deleteTask(task._id) as any);
    dispatch(setSelectedTask(null));
  };

  const handleArchive = () => {
    dispatch(editTask(task._id, { isArchived: true }) as any);
    dispatch(setSelectedTask(null));
  };

  const completedCount = task.checklist.filter(c => c.completed).length;
  const totalCount = task.checklist.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <AnimatePresence>
      {selectedTaskId && (
        <motion.div
          key="task-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            ref={panelRef}
            key="task-detail-panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-[900px] bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 relative"
          >
            {/* HEADER */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingTitle ? (
                    <Input
                      ref={titleRef}
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onBlur={saveTitle}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                      className="text-2xl font-bold bg-slate-900/50 border-slate-700 text-white rounded-xl h-auto py-2 px-3"
                    />
                  ) : (
                    <h2
                      className="text-2xl font-bold text-white cursor-pointer hover:text-cyan-200 transition-colors truncate group"
                      onClick={() => { setTitleDraft(task.title); setEditingTitle(true); }}
                    >
                      {task.title}
                      <Edit3 className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </h2>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge
                      className="border text-xs font-medium"
                      style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color, borderColor: `${statusInfo.color}40` }}
                    >
                      <Circle className="w-2 h-2 mr-1.5 fill-current" />
                      {statusInfo.name}
                    </Badge>
                    <Badge className={`border text-xs font-medium capitalize ${priorityColors[task.priority] || priorityColors.medium}`}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DETAILS ROW */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <div className="flex flex-wrap gap-3">
                {/* Status Selector */}
                <div className="relative">
                  <button
                    onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowPriorityDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
                  >
                    <Circle className="w-3 h-3" style={{ color: statusInfo.color, fill: statusInfo.color }} />
                    {statusInfo.name}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 min-w-[180px] py-1 overflow-hidden">
                      {statuses.map(s => (
                        <button
                          key={s._id}
                          onClick={() => handleStatusChange(s._id)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-700/50 transition-colors ${s._id === statusId ? 'text-white bg-slate-700/30' : 'text-slate-300'}`}
                        >
                          <Circle className="w-3 h-3 flex-shrink-0" style={{ color: s.color, fill: s.color }} />
                          {s.name}
                          {s._id === statusId && <Check className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority Selector */}
                <div className="relative">
                  <button
                    onClick={() => { setShowPriorityDropdown(!showPriorityDropdown); setShowStatusDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-300 hover:border-cyan-500/50 transition-colors capitalize"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {task.priority}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 min-w-[150px] py-1 overflow-hidden">
                      {PRIORITIES.map(p => (
                        <button
                          key={p}
                          onClick={() => handlePriorityChange(p)}
                          className={`w-full px-3 py-2 text-left text-sm capitalize hover:bg-slate-700/50 transition-colors ${p === task.priority ? 'text-white bg-slate-700/30' : 'text-slate-300'}`}
                        >
                          {p}
                          {p === task.priority && <Check className="w-3.5 h-3.5 inline ml-2 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assignee Picker */}
                <AssigneePicker
                  task={task}
                  teamMembers={teamMembers}
                  onAssign={(assigneeId) => dispatch(editTask(task._id, { assigneeId }) as any)}
                />

                {/* Due Date */}
                <div className="relative">
                  <button
                    onClick={() => setShowDateInput(!showDateInput)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  </button>
                  {showDateInput && (
                    <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 p-3">
                      <input
                        type="date"
                        defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleDueDateChange(e.target.value)}
                        className="bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Created */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {formatDate(task.createdAt)}
                </div>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    {task.tags.map((tag, i) => (
                      <Badge key={i} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-xs border">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <h3 className="text-white font-semibold text-sm mb-2">Description</h3>
              {editingDesc ? (
                <textarea
                  ref={descRef}
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                  onBlur={saveDescription}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditingDesc(false); }}
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                />
              ) : (
                <div
                  className="text-sm text-slate-300 cursor-pointer hover:bg-slate-700/20 rounded-xl px-3 py-2 transition-colors min-h-[60px] group"
                  onClick={() => { setDescDraft(task.description || ''); setEditingDesc(true); }}
                >
                  {task.description || (
                    <span className="text-slate-500 italic">Add a description...</span>
                  )}
                  <Edit3 className="w-3.5 h-3.5 inline-block ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-slate-400" />
                </div>
              )}
            </div>

            {/* CHECKLIST */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-white font-semibold text-sm">Checklist</h3>
                  {totalCount > 0 && (
                    <span className="text-xs text-slate-400">{completedCount}/{totalCount}</span>
                  )}
                </div>
              </div>
              {totalCount > 0 && (
                <div className="w-full h-2 bg-slate-900/50 rounded-full mb-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              <div className="space-y-1">
                {task.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-2 group py-1">
                    <button onClick={() => toggleChecklistItem(item.id)} className="flex-shrink-0 text-slate-400 hover:text-cyan-400 transition-colors">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-sm flex-1 ${item.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addChecklistItem(); }}
                  placeholder="Add an item..."
                  className="flex-1 h-9 bg-slate-900/50 border-slate-700 text-white rounded-xl text-sm placeholder:text-slate-500"
                />
                <Button
                  onClick={addChecklistItem}
                  size="sm"
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 h-9 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* SUBTASKS */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Subtasks
                {subtasks.length > 0 && <span className="text-xs text-slate-400">({subtasks.length})</span>}
              </h3>
              {subtasks.length > 0 && (
                <div className="space-y-1 mb-2">
                  {subtasks.map(sub => {
                    const subStatus = getStatusInfo(sub.statusId, statuses);
                    return (
                      <div key={sub._id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-700/20 transition-colors">
                        <Circle className="w-2.5 h-2.5 flex-shrink-0" style={{ color: subStatus.color, fill: subStatus.color }} />
                        <span className="text-sm text-slate-300 flex-1 truncate">{sub.title}</span>
                        <Badge className={`text-[10px] capitalize border ${priorityColors[sub.priority] || priorityColors.medium}`}>
                          {sub.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }}
                  placeholder="Add a subtask..."
                  className="flex-1 h-9 bg-slate-900/50 border-slate-700 text-white rounded-xl text-sm placeholder:text-slate-500"
                />
                <Button
                  onClick={addSubtask}
                  size="sm"
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 h-9 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* CRM LINKS */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                CRM Links
              </h3>
              {task.crmLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {task.crmLinks.map((link, i) => (
                    <Badge key={i} className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs border flex items-center gap-1.5 pr-1">
                      <span className="capitalize text-cyan-300">{link.type}</span>
                      <span className="text-slate-400">•</span>
                      {link.label}
                      <button onClick={() => removeCrmLink(i)} className="ml-1 p-0.5 hover:text-rose-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {showCrmForm ? (
                <div className="flex items-center gap-2">
                  <select
                    value={crmType}
                    onChange={(e) => setCrmType(e.target.value)}
                    className="h-9 px-2 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-slate-300 capitalize"
                  >
                    {CRM_LINK_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <Input
                    value={crmLabel}
                    onChange={(e) => setCrmLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCrmLink(); }}
                    placeholder="Label..."
                    className="flex-1 h-9 bg-slate-900/50 border-slate-700 text-white rounded-xl text-sm placeholder:text-slate-500"
                  />
                  <Button onClick={addCrmLink} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-9 px-3">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => setShowCrmForm(false)} size="sm" className="bg-slate-700/50 text-slate-400 h-9 px-3">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowCrmForm(true)}
                  size="sm"
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs h-8"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add CRM Link
                </Button>
              )}
            </div>

            {/* COMMENTS */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Comments
                {comments.length > 0 && <span className="text-xs text-slate-400">({comments.length})</span>}
              </h3>
              {loadingComments ? (
                <p className="text-sm text-slate-500">Loading comments...</p>
              ) : (
                <div className="space-y-2 mb-3">
                  {comments.map(comment => (
                    <div key={comment._id} className="bg-slate-700/30 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {typeof comment.userId === 'object' ? comment.userId.name : 'User'}
                        </span>
                        <span className="text-xs text-slate-500">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No comments yet</p>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitComment(); }}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1 bg-slate-900/50 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-500"
                />
                <Button
                  onClick={submitComment}
                  disabled={!newComment.trim() || submittingComment}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-9 px-3 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="px-6 pb-4 border-t border-slate-700/30 pt-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Activity
              </h3>
              {loadingActivities ? (
                <p className="text-sm text-slate-500">Loading activity...</p>
              ) : activities.length > 0 ? (
                <div className="space-y-0">
                  {activities.map((act, i) => (
                    <div key={act._id} className="flex items-start gap-3 relative py-2">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5" />
                        {i < activities.length - 1 && (
                          <div className="w-px flex-1 bg-slate-700/50 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300">
                          <span className="font-medium text-white">{getUserName(act.userId)}</span>
                          {' '}
                          {act.description || act.action}
                        </p>
                        <span className="text-[11px] text-slate-500">{timeAgo(act.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No activity recorded</p>
              )}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-700/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-rose-400">Delete this task?</span>
                    <Button
                      onClick={handleDelete}
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-500 text-white h-8 text-xs"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => setConfirmDelete(false)}
                      size="sm"
                      className="bg-slate-700/50 text-slate-400 h-8 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleDelete}
                    size="sm"
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 h-8 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
              <Button
                onClick={handleArchive}
                size="sm"
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 h-8 text-xs"
              >
                <Archive className="w-3.5 h-3.5 mr-1" />
                Archive
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AssigneePicker({
  task,
  teamMembers,
  onAssign,
}: {
  task: TaskItem;
  teamMembers: Array<{ _id: string; name: string; email: string; role: string }>;
  onAssign: (assigneeId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
      >
        <User className="w-3.5 h-3.5 text-slate-500" />
        {getAssigneeName(task.assigneeId, teamMembers)}
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 min-w-[200px] py-1 overflow-hidden max-h-[250px] overflow-y-auto">
          <button
            onClick={() => { onAssign(null); setOpen(false); }}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-700/50 text-slate-400"
          >
            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">?</div>
            Unassigned
          </button>
          {teamMembers.map(m => {
            const isActive = typeof task.assigneeId === 'string' ? task.assigneeId === m._id : (typeof task.assigneeId === 'object' && task.assigneeId?._id === m._id);
            return (
              <button
                key={m._id}
                onClick={() => { onAssign(m._id); setOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-700/50 transition-colors ${isActive ? 'text-white bg-slate-700/30' : 'text-slate-300'}`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{m.email}</div>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
