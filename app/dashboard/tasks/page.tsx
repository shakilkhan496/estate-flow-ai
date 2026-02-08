'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSpaces, fetchLists, fetchStatuses, fetchTasks,
  createTask, editTask, deleteTask, createSpace, createList, updateList, deleteList, seedTasks,
  bulkDeleteTasks, bulkUpdateTasks, fetchTeamMembers,
} from '@/store/actions/taskActions';
import {
  selectSpaces, selectLists, selectStatuses, selectTasks,
  selectSelectedSpaceId, selectSelectedListId, selectViewMode,
  selectTaskLoading, selectSearchTerm, selectFilterPriority,
  selectSelectedList, selectTasksByStatus,
  selectTasksWithDueDate, selectSortBy, selectSortDirection,
  selectSelectedTaskIds, selectSortedFilteredTasks,
} from '@/store/selectors/taskSelectors';
import {
  setSelectedSpace, setSelectedList, setSelectedTask,
  setViewMode, setSearchTerm, setFilterPriority,
  setSortBy, setSortDirection, toggleTaskSelection, selectAllTasks, clearTaskSelection,
} from '@/store/slices/taskSlice';
import type { ViewMode, TaskItem, TaskStatusItem, TaskUser } from '@/store/slices/taskSlice';
import {
  Rows3, LayoutGrid, Calendar, Plus, Search, ChevronRight, ChevronDown,
  Menu, X, Sparkles, Database, ChevronLeft, Clock, User, Tag,
  Loader2, FolderOpen, ListTodo, ArrowUpDown, ArrowUp, ArrowDown,
  Trash2, Check, Filter, Users, MoreHorizontal, Minus, Pencil,
} from 'lucide-react';

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  low: { label: 'Low', color: 'text-gray-500', bg: 'bg-gray-50', dot: 'bg-gray-400' },
};

const PRESET_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const TAG_COLORS = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700', 'bg-pink-100 text-pink-700', 'bg-indigo-100 text-indigo-700', 'bg-red-100 text-red-700', 'bg-teal-100 text-teal-700'];

interface TeamMember { _id: string; name: string; email: string; role: string; }

function getStatusInfo(statusId: string | TaskStatusItem | null | undefined): { id: string; name: string; color: string } {
  if (!statusId) return { id: '', name: 'No Status', color: '#94a3b8' };
  if (typeof statusId === 'object' && statusId !== null) return { id: statusId._id, name: statusId.name, color: statusId.color };
  return { id: statusId, name: '', color: '#94a3b8' };
}

function getAssigneeName(assigneeId: TaskUser | string | null, members: TeamMember[] = []): string {
  if (!assigneeId) return '';
  if (typeof assigneeId === 'object') return assigneeId.name;
  const found = members.find(m => m._id === assigneeId);
  return found ? found.name : '';
}

function getAssigneeInitials(name: string): string {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
}

function getAssigneeId(assigneeId: TaskUser | string | null): string {
  if (!assigneeId) return '';
  if (typeof assigneeId === 'object') return assigneeId._id;
  return assigneeId;
}

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function relativeCreated(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function tagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function CellDropdown({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px] max-h-[240px] overflow-y-auto">
      {children}
    </div>
  );
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const spaces = useAppSelector(selectSpaces);
  const lists = useAppSelector(selectLists);
  const statuses = useAppSelector(selectStatuses);
  const tasks = useAppSelector(selectTasks);
  const selectedSpaceId = useAppSelector(selectSelectedSpaceId);
  const selectedListId = useAppSelector(selectSelectedListId);
  const viewMode = useAppSelector(selectViewMode);
  const loading = useAppSelector(selectTaskLoading);
  const searchTerm = useAppSelector(selectSearchTerm);
  const filterPriority = useAppSelector(selectFilterPriority);
  const selectedList = useAppSelector(selectSelectedList);
  const tasksByStatus = useAppSelector(selectTasksByStatus);
  const tasksWithDueDate = useAppSelector(selectTasksWithDueDate);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);
  const selectedTaskIds = useAppSelector(selectSelectedTaskIds);
  const sortedFilteredTasks = useAppSelector(selectSortedFilteredTasks);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [createListForSpace, setCreateListForSpace] = useState('');
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceColor, setNewSpaceColor] = useState('#3b82f6');
  const [newListName, setNewListName] = useState('');
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [boardQuickAdd, setBoardQuickAdd] = useState<Record<string, string>>({});
  const [seeding, setSeeding] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null);
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'priority' | 'assignee'>('none');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [detailTitle, setDetailTitle] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const [detailPriority, setDetailPriority] = useState('');
  const [detailStatusId, setDetailStatusId] = useState('');
  const [detailAssignee, setDetailAssignee] = useState('');
  const [detailDueDate, setDetailDueDate] = useState('');
  const [detailTags, setDetailTags] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');

  const quickAddRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchSpaces() as never);
    fetchTeamMembers().then(setTeamMembers);
  }, [dispatch]);

  useEffect(() => {
    if (selectedSpaceId) {
      dispatch(fetchLists(selectedSpaceId) as never);
      setExpandedSpaces(prev => new Set(prev).add(selectedSpaceId));
    }
  }, [dispatch, selectedSpaceId]);

  useEffect(() => {
    if (selectedListId) {
      dispatch(fetchStatuses(selectedListId) as never);
      dispatch(fetchTasks({ listId: selectedListId }) as never);
      dispatch(clearTaskSelection());
    }
  }, [dispatch, selectedListId]);

  useEffect(() => {
    if (detailTask) {
      const t = tasks.find(tk => tk._id === detailTask._id);
      if (t) {
        setDetailTask(t);
        setDetailTitle(t.title);
        setDetailDescription(t.description || '');
        setDetailPriority(t.priority);
        const si = getStatusInfo(t.statusId);
        setDetailStatusId(si.id);
        setDetailAssignee(getAssigneeId(t.assigneeId));
        setDetailDueDate(t.dueDate ? t.dueDate.split('T')[0] : '');
        setDetailTags((t.tags || []).join(', '));
      }
    }
  }, [tasks, detailTask?._id]);

  const listsForSpace = useCallback((spaceId: string) => lists.filter(l => l.spaceId === spaceId), [lists]);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filterPriority) c++;
    if (filterAssignee) c++;
    if (filterStatus) c++;
    if (searchTerm) c++;
    return c;
  }, [filterPriority, filterAssignee, filterStatus, searchTerm]);

  const displayTasks = useMemo(() => {
    let result = sortedFilteredTasks;
    if (filterAssignee) {
      result = result.filter(t => {
        const aid = getAssigneeId(t.assigneeId);
        return aid === filterAssignee;
      });
    }
    if (filterStatus) {
      result = result.filter(t => {
        const si = getStatusInfo(t.statusId);
        return si.id === filterStatus;
      });
    }
    return result;
  }, [sortedFilteredTasks, filterAssignee, filterStatus]);

  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') return null;
    const groups: { key: string; label: string; color?: string; tasks: TaskItem[] }[] = [];
    const map = new Map<string, TaskItem[]>();

    if (groupBy === 'status') {
      statuses.forEach(s => map.set(s._id, []));
      displayTasks.forEach(t => {
        const si = getStatusInfo(t.statusId);
        if (!map.has(si.id)) map.set(si.id, []);
        map.get(si.id)!.push(t);
      });
      statuses.forEach(s => {
        groups.push({ key: s._id, label: s.name, color: s.color, tasks: map.get(s._id) || [] });
      });
      map.forEach((tasks, key) => {
        if (!statuses.find(s => s._id === key)) {
          groups.push({ key, label: 'Unknown', tasks });
        }
      });
    } else if (groupBy === 'priority') {
      ['urgent', 'high', 'medium', 'low'].forEach(p => map.set(p, []));
      displayTasks.forEach(t => {
        const p = t.priority || 'low';
        if (!map.has(p)) map.set(p, []);
        map.get(p)!.push(t);
      });
      ['urgent', 'high', 'medium', 'low'].forEach(p => {
        const cfg = PRIORITY_CONFIG[p];
        groups.push({ key: p, label: cfg?.label || p, color: undefined, tasks: map.get(p) || [] });
      });
    } else if (groupBy === 'assignee') {
      const unassigned: TaskItem[] = [];
      displayTasks.forEach(t => {
        const aid = getAssigneeId(t.assigneeId);
        if (!aid) { unassigned.push(t); return; }
        if (!map.has(aid)) map.set(aid, []);
        map.get(aid)!.push(t);
      });
      if (unassigned.length) groups.push({ key: 'unassigned', label: 'Unassigned', tasks: unassigned });
      map.forEach((tasks, key) => {
        const name = getAssigneeName(key, teamMembers) || key;
        groups.push({ key, label: name, tasks });
      });
    }
    return groups;
  }, [groupBy, displayTasks, statuses, teamMembers]);

  const handleSelectSpace = (spaceId: string) => {
    dispatch(setSelectedSpace(spaceId));
    setExpandedSpaces(prev => {
      const n = new Set(prev);
      if (n.has(spaceId)) n.delete(spaceId); else n.add(spaceId);
      return n;
    });
  };

  const handleSelectList = (listId: string) => dispatch(setSelectedList(listId));

  const handleQuickAdd = async (statusId?: string) => {
    const title = statusId ? boardQuickAdd[statusId] : quickAddTitle;
    if (!title?.trim() || !selectedListId || !selectedSpaceId) return;
    const firstStatus = statusId || (statuses.length > 0 ? statuses[0]._id : '');
    if (!firstStatus) return;
    await dispatch(createTask({ title: title.trim(), listId: selectedListId, spaceId: selectedSpaceId, statusId: firstStatus, priority: 'medium' }) as never);
    if (statusId) setBoardQuickAdd(prev => ({ ...prev, [statusId]: '' }));
    else { setQuickAddTitle(''); setQuickAddOpen(false); }
  };

  const handleSeed = async () => {
    setSeeding(true);
    await dispatch(seedTasks() as never);
    await dispatch(fetchSpaces() as never);
    setSeeding(false);
  };

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;
    await dispatch(createSpace({ name: newSpaceName.trim(), color: newSpaceColor }) as never);
    setNewSpaceName(''); setNewSpaceColor('#3b82f6'); setShowCreateSpace(false);
  };

  const handleCreateList = async () => {
    if (!newListName.trim() || !createListForSpace) return;
    await dispatch(createList({ name: newListName.trim(), spaceId: createListForSpace }) as never);
    setNewListName(''); setShowCreateList(false); setCreateListForSpace('');
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    else { dispatch(setSortBy(field)); dispatch(setSortDirection('asc')); }
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.length === displayTasks.length && displayTasks.length > 0) dispatch(clearTaskSelection());
    else dispatch(selectAllTasks(displayTasks.map(t => t._id)));
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    await dispatch(bulkDeleteTasks(selectedTaskIds) as never);
    dispatch(clearTaskSelection());
  };

  const handleBulkUpdate = async (updates: Record<string, unknown>) => {
    if (selectedTaskIds.length === 0) return;
    await dispatch(bulkUpdateTasks(selectedTaskIds, updates, selectedListId || undefined) as never);
    dispatch(clearTaskSelection());
  };

  const startInlineEdit = (taskId: string, field: string, value: string) => {
    setEditingCell({ taskId, field });
    setEditingValue(value);
  };

  const commitInlineEdit = async () => {
    if (!editingCell) return;
    const { taskId, field } = editingCell;
    await dispatch(editTask(taskId, { [field]: editingValue }) as never);
    setEditingCell(null); setEditingValue('');
  };

  const cancelInlineEdit = () => { setEditingCell(null); setEditingValue(''); };

  const handleInlineSelect = async (taskId: string, field: string, value: string | null) => {
    await dispatch(editTask(taskId, { [field]: value }) as never);
    setEditingCell(null);
  };

  const openDetail = (task: TaskItem) => {
    setDetailTask(task);
    setDetailTitle(task.title);
    setDetailDescription(task.description || '');
    setDetailPriority(task.priority);
    const si = getStatusInfo(task.statusId);
    setDetailStatusId(si.id);
    setDetailAssignee(getAssigneeId(task.assigneeId));
    setDetailDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setDetailTags((task.tags || []).join(', '));
  };

  const closeDetail = () => { setDetailTask(null); };

  const saveDetailField = async (field: string, value: unknown) => {
    if (!detailTask) return;
    await dispatch(editTask(detailTask._id, { [field]: value }) as never);
  };

  const handleDeleteTask = async () => {
    if (!detailTask) return;
    await dispatch(deleteTask(detailTask._id) as never);
    closeDetail();
  };

  const handleChecklistToggle = async (index: number) => {
    if (!detailTask) return;
    const updated = detailTask.checklist.map((item, i) => i === index ? { ...item, completed: !item.completed } : item);
    await dispatch(editTask(detailTask._id, { checklist: updated }) as never);
  };

  const handleAddChecklistItem = async () => {
    if (!detailTask || !newChecklistItem.trim()) return;
    const updated = [...detailTask.checklist, { id: Date.now().toString(), text: newChecklistItem.trim(), completed: false }];
    await dispatch(editTask(detailTask._id, { checklist: updated }) as never);
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = async (index: number) => {
    if (!detailTask) return;
    const updated = detailTask.checklist.filter((_, i) => i !== index);
    await dispatch(editTask(detailTask._id, { checklist: updated }) as never);
  };

  const handleDrop = async (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && newStatusId) await dispatch(editTask(taskId, { statusId: newStatusId }) as never);
  };

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }, [calendarDate]);

  const tasksForDay = useCallback((day: Date) => {
    return tasksWithDueDate.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
    });
  }, [tasksWithDueDate]);

  const getStatusNameById = (id: string) => {
    const s = statuses.find(s => s._id === id);
    return s ? s.name : '';
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  const renderGridRow = (task: TaskItem, index: number) => {
    const si = getStatusInfo(task.statusId);
    const statusName = si.name || getStatusNameById(si.id);
    const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
    const assigneeName = getAssigneeName(task.assigneeId, teamMembers);
    const isSelected = selectedTaskIds.includes(task._id);
    const isEditingTitle = editingCell?.taskId === task._id && editingCell?.field === 'title';
    const isEditingStatus = editingCell?.taskId === task._id && editingCell?.field === 'statusId';
    const isEditingPriority = editingCell?.taskId === task._id && editingCell?.field === 'priority';
    const isEditingAssignee = editingCell?.taskId === task._id && editingCell?.field === 'assigneeId';
    const isEditingDueDate = editingCell?.taskId === task._id && editingCell?.field === 'dueDate';
    const isEditingTags = editingCell?.taskId === task._id && editingCell?.field === 'tags';

    return (
      <motion.div
        key={task._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: index * 0.02 }}
        className={`grid grid-cols-[40px_minmax(200px,2fr)_150px_120px_150px_140px_180px_120px] items-center h-[44px] border-b border-gray-100 text-sm cursor-pointer group ${
          isSelected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
        } hover:bg-blue-50/60 transition-colors`}
        onClick={() => openDetail(task)}
      >
        <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleTaskSelection(task._id))}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="px-3 truncate font-medium text-gray-800" onClick={e => { e.stopPropagation(); if (!isEditingTitle) startInlineEdit(task._id, 'title', task.title); }}>
          {isEditingTitle ? (
            <input
              autoFocus
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitInlineEdit(); if (e.key === 'Escape') cancelInlineEdit(); }}
              onBlur={commitInlineEdit}
              className="w-full px-1 py-0.5 border border-blue-400 rounded text-sm outline-none bg-white"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className="group-hover:text-blue-700 transition-colors">{task.title}</span>
          )}
        </div>

        <div className="px-3 relative" onClick={e => { e.stopPropagation(); setEditingCell({ taskId: task._id, field: 'statusId' }); }}>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: si.color }} />
            <span className="text-gray-700 truncate text-xs">{statusName}</span>
          </div>
          <CellDropdown open={isEditingStatus} onClose={() => setEditingCell(null)}>
            {statuses.map(s => (
              <button key={s._id} onClick={() => handleInlineSelect(task._id, 'statusId', s._id)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left text-sm">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-gray-700">{s.name}</span>
                {si.id === s._id && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto" />}
              </button>
            ))}
          </CellDropdown>
        </div>

        <div className="px-3 relative" onClick={e => { e.stopPropagation(); setEditingCell({ taskId: task._id, field: 'priority' }); }}>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
            {pc.label}
          </span>
          <CellDropdown open={isEditingPriority} onClose={() => setEditingCell(null)}>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => handleInlineSelect(task._id, 'priority', key)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left text-sm">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-gray-700">{cfg.label}</span>
                {task.priority === key && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto" />}
              </button>
            ))}
          </CellDropdown>
        </div>

        <div className="px-3 relative" onClick={e => { e.stopPropagation(); setEditingCell({ taskId: task._id, field: 'assigneeId' }); }}>
          {assigneeName ? (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {getAssigneeInitials(assigneeName)}
              </div>
              <span className="text-gray-700 truncate text-xs">{assigneeName}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
          <CellDropdown open={isEditingAssignee} onClose={() => setEditingCell(null)}>
            <button onClick={() => handleInlineSelect(task._id, 'assigneeId', null)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left text-sm text-gray-500">
              <Minus className="w-4 h-4" /> Unassign
            </button>
            {teamMembers.map(m => (
              <button key={m._id} onClick={() => handleInlineSelect(task._id, 'assigneeId', m._id)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left text-sm">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-medium">{getAssigneeInitials(m.name)}</div>
                <span className="text-gray-700">{m.name}</span>
                {getAssigneeId(task.assigneeId) === m._id && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto" />}
              </button>
            ))}
          </CellDropdown>
        </div>

        <div className="px-3 relative" onClick={e => { e.stopPropagation(); setEditingCell({ taskId: task._id, field: 'dueDate' }); }}>
          {isEditingDueDate ? (
            <input
              type="date"
              autoFocus
              value={editingValue || (task.dueDate ? task.dueDate.split('T')[0] : '')}
              onChange={async e => { await handleInlineSelect(task._id, 'dueDate', e.target.value || null); }}
              onBlur={() => setEditingCell(null)}
              className="w-full text-xs border border-blue-400 rounded px-1 py-0.5 outline-none"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {task.dueDate ? relativeDate(task.dueDate) : '—'}
            </span>
          )}
        </div>

        <div className="px-3 flex gap-1 overflow-hidden" onClick={e => { e.stopPropagation(); startInlineEdit(task._id, 'tags', (task.tags || []).join(', ')); }}>
          {isEditingTags ? (
            <input
              autoFocus
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  const tags = editingValue.split(',').map(t => t.trim()).filter(Boolean);
                  await dispatch(editTask(task._id, { tags }) as never);
                  setEditingCell(null);
                }
                if (e.key === 'Escape') cancelInlineEdit();
              }}
              onBlur={async () => {
                const tags = editingValue.split(',').map(t => t.trim()).filter(Boolean);
                await dispatch(editTask(task._id, { tags }) as never);
                setEditingCell(null);
              }}
              placeholder="tag1, tag2"
              className="w-full px-1 py-0.5 border border-blue-400 rounded text-xs outline-none bg-white"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            (task.tags || []).length > 0 ? task.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className={`px-1.5 py-0 rounded text-[10px] font-medium ${tagColor(i)}`}>{tag}</span>
            )) : <span className="text-gray-400 text-xs">—</span>
          )}
        </div>

        <div className="px-3 text-gray-400 text-xs">{relativeCreated(task.createdAt)}</div>
      </motion.div>
    );
  };

  const renderGridView = () => {
    const headerCols = 'grid grid-cols-[40px_minmax(200px,2fr)_150px_120px_150px_140px_180px_120px]';
    const rows = groupBy === 'none' ? displayTasks : null;

    return (
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1100px]">
          <div className={`${headerCols} items-center h-[36px] bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10`}>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={selectedTaskIds.length > 0 && selectedTaskIds.length === displayTasks.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <button onClick={() => handleSort('title')} className="flex items-center gap-1 px-3 hover:text-gray-700 transition-colors">
              Title <SortIcon field="title" />
            </button>
            <div className="px-3">Status</div>
            <button onClick={() => handleSort('priority')} className="flex items-center gap-1 px-3 hover:text-gray-700 transition-colors">
              Priority <SortIcon field="priority" />
            </button>
            <div className="px-3">Assignee</div>
            <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1 px-3 hover:text-gray-700 transition-colors">
              Due Date <SortIcon field="dueDate" />
            </button>
            <div className="px-3">Tags</div>
            <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 px-3 hover:text-gray-700 transition-colors">
              Created <SortIcon field="createdAt" />
            </button>
          </div>

          {groupBy === 'none' && rows ? (
            <>
              {rows.map((task, i) => renderGridRow(task, i))}
              {rows.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <ListTodo className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No tasks found</p>
                  <p className="text-xs mt-1">Create a task or adjust your filters</p>
                </div>
              )}
            </>
          ) : groupedTasks ? (
            groupedTasks.map(group => (
              <div key={group.key}>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-150 transition-colors"
                >
                  {collapsedGroups.has(group.key) ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {group.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />}
                  {group.label}
                  <span className="text-xs font-normal text-gray-400 ml-1">({group.tasks.length})</span>
                </button>
                {!collapsedGroups.has(group.key) && group.tasks.map((task, i) => renderGridRow(task, i))}
              </div>
            ))
          ) : null}

          <div className="border-b border-gray-100">
            {quickAddOpen ? (
              <div className="grid grid-cols-[40px_1fr] items-center h-[44px] bg-white">
                <div />
                <div className="px-3">
                  <input
                    ref={quickAddRef}
                    autoFocus
                    value={quickAddTitle}
                    onChange={e => setQuickAddTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); if (e.key === 'Escape') { setQuickAddOpen(false); setQuickAddTitle(''); } }}
                    onBlur={() => { if (!quickAddTitle.trim()) setQuickAddOpen(false); }}
                    placeholder="Task name..."
                    className="w-full text-sm outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setQuickAddOpen(true)}
                className="flex items-center gap-2 px-4 h-[44px] text-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 w-full transition-colors"
              >
                <Plus className="w-4 h-4" /> Add task
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderKanbanView = () => (
    <div className="flex-1 overflow-x-auto p-4">
      <div className="flex gap-4 h-full min-h-[400px]">
        {statuses.map(status => {
          const statusTasks = tasksByStatus[status._id] || [];
          return (
            <div
              key={status._id}
              className="min-w-[280px] w-[280px] bg-gray-50 rounded-lg flex flex-col"
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={e => handleDrop(e, status._id)}
            >
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                <span className="text-sm font-semibold text-gray-700">{status.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{statusTasks.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {statusTasks.map(task => {
                  const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
                  const assigneeName = getAssigneeName(task.assigneeId, teamMembers);
                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={e => { e.dataTransfer.setData('text/plain', task._id); }}
                      onClick={() => openDetail(task)}
                      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${pc.bg} ${pc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />{pc.label}
                        </span>
                        {task.dueDate && (
                          <span className={`text-[10px] ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-400'}`}>
                            {relativeDate(task.dueDate)}
                          </span>
                        )}
                        {assigneeName && (
                          <div className="ml-auto w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-medium" title={assigneeName}>
                            {getAssigneeInitials(assigneeName)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2 border-t border-gray-200">
                <input
                  value={boardQuickAdd[status._id] || ''}
                  onChange={e => setBoardQuickAdd(prev => ({ ...prev, [status._id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(status._id); }}
                  placeholder="+ Add task..."
                  className="w-full text-sm px-2 py-1.5 rounded bg-transparent text-gray-600 placeholder-gray-400 outline-none hover:bg-white focus:bg-white focus:border focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          );
        })}
        {statuses.length === 0 && (
          <div className="flex items-center justify-center w-full text-gray-400 text-sm">
            Select a list to see Kanban columns
          </div>
        )}
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const today = new Date();
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-gray-50 text-center text-xs font-medium text-gray-500 py-2 border-b border-gray-200">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50/30 border-b border-r border-gray-100" />;
            const dayTasks = tasksForDay(day);
            const isToday = day.toDateString() === today.toDateString();
            return (
              <div key={i} className={`min-h-[100px] p-1 border-b border-r border-gray-100 ${isToday ? 'bg-blue-50/50' : 'bg-white'}`}>
                <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map(task => {
                    const si = getStatusInfo(task.statusId);
                    return (
                      <button key={task._id} onClick={() => openDetail(task)} className="w-full text-left text-[10px] px-1 py-0.5 rounded truncate hover:bg-blue-100 transition-colors" style={{ backgroundColor: si.color + '20', color: si.color }}>
                        {task.title}
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && <div className="text-[10px] text-gray-400 px-1">+{dayTasks.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDetailPanel = () => {
    if (!detailTask) return null;
    const checklistDone = detailTask.checklist?.filter(c => c.completed).length || 0;
    const checklistTotal = detailTask.checklist?.length || 0;
    const checklistPct = checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0;

    return (
      <AnimatePresence>
        <motion.div
          key="detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40"
          onClick={closeDetail}
        />
        <motion.div
          key="detail-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Task Details</span>
            <div className="flex items-center gap-2">
              <button onClick={handleDeleteTask} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={closeDetail} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <input
              value={detailTitle}
              onChange={e => setDetailTitle(e.target.value)}
              onBlur={() => { if (detailTitle !== detailTask.title) saveDetailField('title', detailTitle); }}
              className="text-xl font-semibold text-gray-900 w-full outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-400 pb-1 transition-colors"
            />

            <div className="grid grid-cols-[100px_1fr] gap-y-4 gap-x-3 text-sm">
              <span className="text-gray-500 flex items-center">Status</span>
              <select
                value={detailStatusId}
                onChange={e => { setDetailStatusId(e.target.value); saveDetailField('statusId', e.target.value); }}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 bg-white text-gray-700"
              >
                {statuses.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>

              <span className="text-gray-500 flex items-center">Priority</span>
              <select
                value={detailPriority}
                onChange={e => { setDetailPriority(e.target.value); saveDetailField('priority', e.target.value); }}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 bg-white text-gray-700"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
              </select>

              <span className="text-gray-500 flex items-center">Assignee</span>
              <select
                value={detailAssignee}
                onChange={e => { setDetailAssignee(e.target.value); saveDetailField('assigneeId', e.target.value || null); }}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 bg-white text-gray-700"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>

              <span className="text-gray-500 flex items-center">Due Date</span>
              <input
                type="date"
                value={detailDueDate}
                onChange={e => { setDetailDueDate(e.target.value); saveDetailField('dueDate', e.target.value || null); }}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 bg-white text-gray-700"
              />

              <span className="text-gray-500 flex items-center">Tags</span>
              <input
                value={detailTags}
                onChange={e => setDetailTags(e.target.value)}
                onBlur={() => { const tags = detailTags.split(',').map(t => t.trim()).filter(Boolean); saveDetailField('tags', tags); }}
                placeholder="tag1, tag2, tag3"
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 bg-white text-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
              <textarea
                value={detailDescription}
                onChange={e => setDetailDescription(e.target.value)}
                onBlur={() => { if (detailDescription !== (detailTask.description || '')) saveDetailField('description', detailDescription); }}
                placeholder="Add a description..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none text-gray-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Checklist</label>
                {checklistTotal > 0 && (
                  <span className="text-xs text-gray-400">{checklistDone}/{checklistTotal} ({checklistPct}%)</span>
                )}
              </div>
              {checklistTotal > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${checklistPct}%` }} />
                </div>
              )}
              <div className="space-y-1.5">
                {(detailTask.checklist || []).map((item, i) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(i)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.text}</span>
                    <button onClick={() => handleRemoveChecklistItem(i)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddChecklistItem(); }}
                  placeholder="Add item..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400"
                />
                <button onClick={handleAddChecklistItem} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-white -m-6">
      <div className="flex h-screen">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-[240px] min-w-[240px] bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden fixed md:relative z-40 md:z-auto top-0 left-0 h-full"
            >
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  Workspaces
                </h2>
                <button onClick={() => setShowCreateSpace(true)} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-gray-700">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {spaces.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">No workspaces yet</p>
                  </div>
                )}
                {spaces.map(space => (
                  <div key={space._id}>
                    <button
                      onClick={() => handleSelectSpace(space._id)}
                      className={`w-full flex items-center gap-2 px-4 py-1.5 text-left text-sm transition-colors ${
                        selectedSpaceId === space._id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {expandedSpaces.has(space._id) ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: space.color || '#3b82f6' }} />
                      <span className="truncate font-medium">{space.name}</span>
                    </button>
                    <AnimatePresence>
                      {expandedSpaces.has(space._id) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                          {listsForSpace(space._id).map(list => (
                            <div key={list._id} className="group relative flex items-center">
                              {editingListId === list._id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (editingListName.trim() && editingListName.trim() !== list.name) {
                                      dispatch(updateList(list._id, { name: editingListName.trim() }, space._id) as any);
                                    }
                                    setEditingListId(null);
                                  }}
                                  className="flex-1 flex items-center gap-2 pl-10 pr-2 py-1"
                                >
                                  <ListTodo className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                  <input
                                    autoFocus
                                    value={editingListName}
                                    onChange={(e) => setEditingListName(e.target.value)}
                                    onBlur={() => {
                                      if (editingListName.trim() && editingListName.trim() !== list.name) {
                                        dispatch(updateList(list._id, { name: editingListName.trim() }, space._id) as any);
                                      }
                                      setEditingListId(null);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Escape') setEditingListId(null); }}
                                    className="flex-1 text-sm bg-white border border-blue-300 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-blue-400"
                                  />
                                </form>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleSelectList(list._id)}
                                    className={`flex-1 flex items-center gap-2 pl-10 pr-4 py-1.5 text-left text-sm transition-colors ${
                                      selectedListId === list._id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    <ListTodo className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{list.name}</span>
                                  </button>
                                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingListId(list._id);
                                        setEditingListName(list.name);
                                      }}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Rename list"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete this list and its tasks?')) {
                                          dispatch(deleteList(list._id, space._id) as any);
                                          if (selectedListId === list._id) {
                                            dispatch(setSelectedList(''));
                                          }
                                        }
                                      }}
                                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Delete list"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => { setCreateListForSpace(space._id); setShowCreateList(true); }}
                            className="w-full flex items-center gap-2 pl-10 pr-4 py-1.5 text-left text-xs text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add list
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
                >
                  {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  {seeding ? 'Seeding...' : 'Seed Demo Data'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors mr-1">
                  <Menu className="w-4 h-4" />
                </button>
                {selectedList && <h3 className="text-sm font-semibold text-gray-800 mr-4">{selectedList.name}</h3>}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  {([['list', Rows3, 'Grid'], ['board', LayoutGrid, 'Kanban'], ['calendar', Calendar, 'Calendar']] as [ViewMode, typeof Rows3, string][]).map(([mode, Icon, label]) => (
                    <button
                      key={mode}
                      onClick={() => dispatch(setViewMode(mode))}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        viewMode === mode ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={e => dispatch(setSearchTerm(e.target.value))}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-400 w-[180px] bg-white text-gray-700"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); setShowGroupDropdown(false); }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                      activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
                    )}
                  </button>
                  <CellDropdown open={showFilterDropdown} onClose={() => setShowFilterDropdown(false)}>
                    <div className="p-3 space-y-3 min-w-[220px]">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                        <select value={filterPriority} onChange={e => dispatch(setFilterPriority(e.target.value))} className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none">
                          <option value="">All</option>
                          {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none">
                          <option value="">All</option>
                          {statuses.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Assignee</label>
                        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none">
                          <option value="">All</option>
                          {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                        </select>
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { dispatch(setFilterPriority('')); setFilterAssignee(''); setFilterStatus(''); dispatch(setSearchTerm('')); }}
                          className="w-full text-xs text-red-600 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </CellDropdown>
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); setShowGroupDropdown(false); }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                      sortBy !== 'position' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sort</span>
                  </button>
                  <CellDropdown open={showSortDropdown} onClose={() => setShowSortDropdown(false)}>
                    <div className="p-2 min-w-[180px]">
                      {([['position', 'Default'], ['title', 'Title'], ['priority', 'Priority'], ['dueDate', 'Due Date'], ['createdAt', 'Created']] as [typeof sortBy, string][]).map(([field, label]) => (
                        <button
                          key={field}
                          onClick={() => { handleSort(field); setShowSortDropdown(false); }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded hover:bg-gray-50 ${sortBy === field ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                        >
                          {label}
                          {sortBy === field && (sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />)}
                        </button>
                      ))}
                    </div>
                  </CellDropdown>
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowSortDropdown(false); }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                      groupBy !== 'none' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Group</span>
                  </button>
                  <CellDropdown open={showGroupDropdown} onClose={() => setShowGroupDropdown(false)}>
                    <div className="p-2 min-w-[160px]">
                      {([['none', 'None'], ['status', 'Status'], ['priority', 'Priority'], ['assignee', 'Assignee']] as [typeof groupBy, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => { setGroupBy(key); setShowGroupDropdown(false); setCollapsedGroups(new Set()); }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded hover:bg-gray-50 ${groupBy === key ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                        >
                          {label}
                          {groupBy === key && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </CellDropdown>
                </div>

                <button onClick={() => setShowMobileToolbar(!showMobileToolbar)} className="sm:hidden p-1.5 border border-gray-200 rounded-lg text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showMobileToolbar && (
              <div className="mt-2 sm:hidden">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={e => dispatch(setSearchTerm(e.target.value))}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-400 w-full bg-white text-gray-700"
                  />
                </div>
              </div>
            )}
          </div>

          {!selectedListId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-1">Select a list</h3>
                <p className="text-sm text-gray-400 mb-4">Choose a workspace and list from the sidebar to get started</p>
                {spaces.length === 0 && (
                  <button onClick={handleSeed} disabled={seeding} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                    {seeding ? 'Seeding...' : 'Seed Demo Data'}
                  </button>
                )}
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {viewMode === 'list' && renderGridView()}
              {viewMode === 'board' && renderKanbanView()}
              {viewMode === 'calendar' && renderCalendarView()}
            </>
          )}

          <AnimatePresence>
            {selectedTaskIds.length > 0 && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4 z-30"
              >
                <span className="text-sm font-medium">{selectedTaskIds.length} selected</span>
                <div className="w-px h-5 bg-gray-700" />
                <select
                  value=""
                  onChange={e => { if (e.target.value) handleBulkUpdate({ statusId: e.target.value }); }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 outline-none"
                >
                  <option value="">Status...</option>
                  {statuses.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <select
                  value=""
                  onChange={e => { if (e.target.value) handleBulkUpdate({ priority: e.target.value }); }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 outline-none"
                >
                  <option value="">Priority...</option>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select
                  value=""
                  onChange={e => { if (e.target.value) handleBulkUpdate({ assigneeId: e.target.value }); }}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 outline-none"
                >
                  <option value="">Assignee...</option>
                  {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <button onClick={handleBulkDelete} className="p-1.5 hover:bg-red-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => dispatch(clearTaskSelection())} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {detailTask && renderDetailPanel()}
      </div>

      <AnimatePresence>
        {showCreateSpace && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateSpace(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">New Workspace</h3>
              <input
                autoFocus
                value={newSpaceName}
                onChange={e => setNewSpaceName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateSpace(); }}
                placeholder="Workspace name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 mb-3"
              />
              <div className="flex gap-2 mb-4">
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => setNewSpaceColor(c)} className={`w-6 h-6 rounded-full transition-transform ${newSpaceColor === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreateSpace(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleCreateSpace} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateList && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateList(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">New List</h3>
              <input
                autoFocus
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateList(); }}
                placeholder="List name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreateList(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleCreateList} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
