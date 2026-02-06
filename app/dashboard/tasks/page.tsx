'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSpaces, fetchLists, fetchStatuses, fetchTasks,
  createTask, editTask, createSpace, createList, seedTasks,
  bulkDeleteTasks, bulkUpdateTasks, fetchTeamMembers, fetchTaskTemplates,
} from '@/store/actions/taskActions';
import {
  selectSpaces, selectLists, selectStatuses, selectTasks,
  selectSelectedSpaceId, selectSelectedListId, selectViewMode,
  selectTaskLoading, selectSearchTerm, selectFilterPriority,
  selectFilterMyTasks, selectSelectedList, selectTasksByStatus,
  selectTasksWithDueDate, selectSortBy, selectSortDirection,
  selectSelectedTaskIds, selectSortedFilteredTasks,
} from '@/store/selectors/taskSelectors';
import {
  setSelectedSpace, setSelectedList, setSelectedTask,
  setViewMode, setSearchTerm, setFilterPriority, setFilterMyTasks,
  setSortBy, setSortDirection, toggleTaskSelection, selectAllTasks, clearTaskSelection,
} from '@/store/slices/taskSlice';
import type { ViewMode, TaskItem, TaskStatusItem, TaskUser } from '@/store/slices/taskSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Rows3, LayoutGrid, Calendar, Plus, Search, ChevronRight, ChevronDown,
  Menu, X, Sparkles, Database, ChevronLeft, Clock, User, Tag,
  Loader2, FolderOpen, ListTodo, ArrowUpDown, ArrowUp, ArrowDown,
  Trash2, CheckSquare, Square, Check, Circle, FileText, AlertTriangle,
  ChevronUp,
} from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; border: string; order: number }> = {
  urgent: { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-500/30', order: 0 },
  high: { color: 'text-orange-300', bg: 'bg-orange-500/20', border: 'border-orange-500/30', order: 1 },
  medium: { color: 'text-blue-300', bg: 'bg-blue-500/20', border: 'border-blue-500/30', order: 2 },
  low: { color: 'text-slate-300', bg: 'bg-slate-500/20', border: 'border-slate-500/30', order: 3 },
};

const PRESET_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

interface TeamMember { _id: string; name: string; email: string; role: string; }
interface TaskTemplate { id: string; name: string; description: string; priority: string; checklist: Array<{ id: string; text: string; completed: boolean }>; tags: string[]; }

function getStatusInfo(statusId: string | TaskStatusItem): { id: string; name: string; color: string } {
  if (typeof statusId === 'object' && statusId !== null) {
    return { id: statusId._id, name: statusId.name, color: statusId.color };
  }
  return { id: statusId, name: 'Unknown', color: '#64748b' };
}

function getAssigneeName(assigneeId: TaskUser | string | null): string {
  if (!assigneeId) return 'Unassigned';
  if (typeof assigneeId === 'object') return assigneeId.name;
  return 'Unassigned';
}

function getAssigneeInitial(assigneeId: TaskUser | string | null): string {
  const name = getAssigneeName(assigneeId);
  return name === 'Unassigned' ? '?' : name.charAt(0).toUpperCase();
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  const now = new Date();
  return d < now && d.toDateString() !== now.toDateString();
}

function isDueSoon(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  return d >= now && d <= twoDaysFromNow;
}

function dueDateClass(dueDate: string | null): string {
  if (isOverdue(dueDate)) return 'text-red-400';
  if (isDueSoon(dueDate)) return 'text-amber-400';
  return 'text-slate-400';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getSubtaskProgress(task: TaskItem): { done: number; total: number } | null {
  if (!task.checklist || task.checklist.length === 0) return null;
  return {
    done: task.checklist.filter(c => c.completed).length,
    total: task.checklist.length,
  };
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
  const filterMyTasks = useAppSelector(selectFilterMyTasks);
  const selectedList = useAppSelector(selectSelectedList);
  const tasksByStatus = useAppSelector(selectTasksByStatus);
  const tasksWithDueDate = useAppSelector(selectTasksWithDueDate);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);
  const selectedTaskIds = useAppSelector(selectSelectedTaskIds);
  const sortedFilteredTasks = useAppSelector(selectSortedFilteredTasks);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [boardQuickAdd, setBoardQuickAdd] = useState<Record<string, string>>({});
  const [seeding, setSeeding] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  const [newSpaceColor, setNewSpaceColor] = useState('#3b82f6');
  const [newListName, setNewListName] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatusId, setBulkStatusId] = useState('');
  const [bulkPriority, setBulkPriority] = useState('');

  useEffect(() => {
    dispatch(fetchSpaces() as never);
    fetchTeamMembers().then(setTeamMembers);
    fetchTaskTemplates().then(setTemplates);
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
    setShowBulkActions(selectedTaskIds.length > 0);
  }, [selectedTaskIds]);

  const listsForSpace = useCallback((spaceId: string) => {
    return lists.filter(l => l.spaceId === spaceId);
  }, [lists]);

  const handleSelectSpace = (spaceId: string) => {
    dispatch(setSelectedSpace(spaceId));
    setExpandedSpaces(prev => {
      const next = new Set(prev);
      if (next.has(spaceId)) next.delete(spaceId);
      else next.add(spaceId);
      return next;
    });
  };

  const handleSelectList = (listId: string) => {
    dispatch(setSelectedList(listId));
  };

  const handleQuickAdd = async (statusId?: string) => {
    const title = statusId ? boardQuickAdd[statusId] : quickAddTitle;
    if (!title?.trim() || !selectedListId || !selectedSpaceId) return;
    const firstStatus = statusId || (statuses.length > 0 ? statuses[0]._id : '');
    if (!firstStatus) return;
    await dispatch(createTask({
      title: title.trim(),
      listId: selectedListId,
      spaceId: selectedSpaceId,
      statusId: firstStatus,
      priority: 'medium',
    }) as never);
    if (statusId) {
      setBoardQuickAdd(prev => ({ ...prev, [statusId]: '' }));
    } else {
      setQuickAddTitle('');
    }
  };

  const handleCreateFromTemplate = async (template: TaskTemplate) => {
    if (!selectedListId || !selectedSpaceId) return;
    const firstStatus = statuses.length > 0 ? statuses[0]._id : '';
    if (!firstStatus) return;
    await dispatch(createTask({
      title: template.name,
      description: template.description,
      listId: selectedListId,
      spaceId: selectedSpaceId,
      statusId: firstStatus,
      priority: template.priority,
      checklist: template.checklist,
      tags: template.tags,
    }) as never);
    setShowTemplateModal(false);
  };

  const handleSeed = async () => {
    setSeeding(true);
    await dispatch(seedTasks() as never);
    await dispatch(fetchSpaces() as never);
    setSeeding(false);
  };

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;
    await dispatch(createSpace({ name: newSpaceName.trim(), description: newSpaceDesc, color: newSpaceColor }) as never);
    setNewSpaceName('');
    setNewSpaceDesc('');
    setNewSpaceColor('#3b82f6');
    setShowCreateSpaceModal(false);
  };

  const handleCreateList = async () => {
    if (!newListName.trim() || !selectedSpaceId) return;
    await dispatch(createList({ name: newListName.trim(), spaceId: selectedSpaceId }) as never);
    setNewListName('');
    setShowCreateListModal(false);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '0.5';
    el.style.transform = 'scale(0.95)';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(statusId);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && newStatusId) {
      await dispatch(editTask(taskId, { statusId: newStatusId }) as never);
    }
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortDirection('asc'));
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.length === sortedFilteredTasks.length) {
      dispatch(clearTaskSelection());
    } else {
      dispatch(selectAllTasks(sortedFilteredTasks.map(t => t._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    await dispatch(bulkDeleteTasks(selectedTaskIds) as never);
    dispatch(clearTaskSelection());
  };

  const handleBulkStatusUpdate = async (statusId: string) => {
    if (selectedTaskIds.length === 0 || !statusId) return;
    await dispatch(bulkUpdateTasks(selectedTaskIds, { statusId }, selectedListId || undefined) as never);
    dispatch(clearTaskSelection());
    setBulkStatusId('');
  };

  const handleBulkPriorityUpdate = async (priority: string) => {
    if (selectedTaskIds.length === 0 || !priority) return;
    await dispatch(bulkUpdateTasks(selectedTaskIds, { priority }, selectedListId || undefined) as never);
    dispatch(clearTaskSelection());
    setBulkPriority('');
  };

  const handleInlineStatusChange = async (taskId: string, newStatusId: string) => {
    await dispatch(editTask(taskId, { statusId: newStatusId }) as never);
  };

  const handleInlinePriorityChange = async (taskId: string, newPriority: string) => {
    await dispatch(editTask(taskId, { priority: newPriority }) as never);
  };

  const handleInlineAssigneeChange = async (taskId: string, assigneeId: string | null) => {
    await dispatch(editTask(taskId, { assigneeId }) as never);
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

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    return tasksForDay(selectedDay);
  }, [selectedDay, tasksForDay]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -m-6 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-3rem)] gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-50 md:hidden p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-[280px] min-w-[280px] bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden
                fixed md:relative z-40 md:z-auto top-0 left-0 h-full md:h-auto"
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                    Workspaces
                  </h2>
                  <Button
                    size="icon"
                    onClick={() => setShowCreateSpaceModal(true)}
                    className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {spaces.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-400 text-sm">Get started by creating a workspace or seeding demo data</p>
                  </div>
                )}
                {spaces.map((space) => (
                  <div key={space._id}>
                    <button
                      onClick={() => handleSelectSpace(space._id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                        selectedSpaceId === space._id
                          ? 'bg-cyan-500/10 border border-cyan-500/30'
                          : 'hover:bg-slate-700/30 border border-transparent'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: space.color || '#3b82f6' }} />
                      <span className={`flex-1 text-sm font-medium truncate ${
                        selectedSpaceId === space._id ? 'text-cyan-300' : 'text-slate-300'
                      }`}>
                        {space.name}
                      </span>
                      <motion.div animate={{ rotate: expandedSpaces.has(space._id) ? 90 : 0 }}>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSpaces.has(space._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 pl-3 border-l border-slate-700/50"
                        >
                          {listsForSpace(space._id).map((list) => (
                            <button
                              key={list._id}
                              onClick={() => handleSelectList(list._id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                                selectedListId === list._id
                                  ? 'bg-cyan-500/15 text-cyan-300'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                              }`}
                            >
                              <ListTodo className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{list.name}</span>
                            </button>
                          ))}
                          {selectedSpaceId === space._id && (
                            <button
                              onClick={() => setShowCreateListModal(true)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add List</span>
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-700/50">
                <Button
                  variant="outline"
                  onClick={handleSeed}
                  disabled={seeding}
                  className="w-full bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                  Seed Demo Data
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {!selectedListId ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a list from the sidebar to view tasks</h3>
                <p className="text-slate-400">Choose a workspace and list to get started</p>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">{selectedList?.name || 'Tasks'}</h2>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                      {sortedFilteredTasks.length} tasks
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex bg-slate-700/40 rounded-xl p-1">
                      {([
                        { mode: 'list' as ViewMode, icon: Rows3, label: 'List' },
                        { mode: 'board' as ViewMode, icon: LayoutGrid, label: 'Board' },
                        { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar' },
                      ]).map(({ mode, icon: Icon, label }) => (
                        <button
                          key={mode}
                          onClick={() => dispatch(setViewMode(mode))}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                            viewMode === mode
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        className="pl-9 h-9 w-40 md:w-52 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm"
                      />
                    </div>

                    <select
                      value={filterPriority}
                      onChange={(e) => dispatch(setFilterPriority(e.target.value))}
                      className="h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 text-sm cursor-pointer focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <button
                      onClick={() => dispatch(setFilterMyTasks(!filterMyTasks))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all ${
                        filterMyTasks
                          ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      My Tasks
                    </button>

                    {templates.length > 0 && (
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Templates</span>
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {showBulkActions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-cyan-300 font-medium">{selectedTaskIds.length} selected</span>
                        <select
                          value={bulkStatusId}
                          onChange={(e) => { if (e.target.value) handleBulkStatusUpdate(e.target.value); }}
                          className="h-8 px-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-xs cursor-pointer focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="">Change Status...</option>
                          {statuses.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        <select
                          value={bulkPriority}
                          onChange={(e) => { if (e.target.value) handleBulkPriorityUpdate(e.target.value); }}
                          className="h-8 px-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-xs cursor-pointer focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="">Change Priority...</option>
                          <option value="urgent">Urgent</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                        <button
                          onClick={() => dispatch(clearTaskSelection())}
                          className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          Clear selection
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader2 className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                  </div>
                ) : viewMode === 'list' ? (
                  <ListView
                    tasks={sortedFilteredTasks}
                    statuses={statuses}
                    quickAddTitle={quickAddTitle}
                    setQuickAddTitle={setQuickAddTitle}
                    onQuickAdd={() => handleQuickAdd()}
                    onSelectTask={(id) => dispatch(setSelectedTask(id))}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    selectedTaskIds={selectedTaskIds}
                    onToggleSelect={(id) => dispatch(toggleTaskSelection(id))}
                    onToggleSelectAll={handleToggleSelectAll}
                    onInlineStatusChange={handleInlineStatusChange}
                    onInlinePriorityChange={handleInlinePriorityChange}
                    onInlineAssigneeChange={handleInlineAssigneeChange}
                    teamMembers={teamMembers}
                  />
                ) : viewMode === 'board' ? (
                  <BoardView
                    statuses={statuses}
                    tasksByStatus={tasksByStatus}
                    filteredTasks={sortedFilteredTasks}
                    boardQuickAdd={boardQuickAdd}
                    setBoardQuickAdd={setBoardQuickAdd}
                    onQuickAdd={handleQuickAdd}
                    onSelectTask={(id) => dispatch(setSelectedTask(id))}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    draggedTaskId={draggedTaskId}
                    dragOverStatus={dragOverStatus}
                  />
                ) : (
                  <CalendarView
                    calendarDate={calendarDate}
                    setCalendarDate={setCalendarDate}
                    calendarDays={calendarDays}
                    tasksForDay={tasksForDay}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    selectedDayTasks={selectedDayTasks}
                    onSelectTask={(id) => dispatch(setSelectedTask(id))}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showCreateSpaceModal && (
          <Modal onClose={() => setShowCreateSpaceModal(false)}>
            <h3 className="text-lg font-bold text-white mb-4">Create Workspace</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Name</label>
                <Input
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Workspace name..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSpace()}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Description</label>
                <Input
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  placeholder="Optional description..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewSpaceColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${newSpaceColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateSpace} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
                Create Workspace
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateListModal && (
          <Modal onClose={() => setShowCreateListModal(false)}>
            <h3 className="text-lg font-bold text-white mb-4">Create List</h3>
            <div className="space-y-4">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
              />
              <Button onClick={handleCreateList} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
                Create List
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTemplateModal && (
          <Modal onClose={() => setShowTemplateModal(false)}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Task Templates
            </h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleCreateFromTemplate(template)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">{template.name}</span>
                    <Badge className={`border text-xs capitalize ${PRIORITY_CONFIG[template.priority]?.bg} ${PRIORITY_CONFIG[template.priority]?.color} ${PRIORITY_CONFIG[template.priority]?.border}`}>
                      {template.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">{template.checklist.length} checklist items</span>
                    {template.tags.map(tag => (
                      <Badge key={tag} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[10px] border">{tag}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <TaskDetailModal teamMembers={teamMembers} />
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function SortIcon({ field, sortBy, sortDirection }: { field: string; sortBy: string; sortDirection: string }) {
  if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
  return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-cyan-400" /> : <ArrowDown className="w-3 h-3 text-cyan-400" />;
}

function InlineDropdown({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-30 min-w-[160px] py-1 overflow-hidden">
      {children}
    </div>
  );
}

function SubtaskBadge({ task }: { task: TaskItem }) {
  const progress = getSubtaskProgress(task);
  if (!progress) return null;
  const pct = Math.round((progress.done / progress.total) * 100);
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
      <CheckSquare className="w-3 h-3" />
      {progress.done}/{progress.total}
      {pct === 100 && <Check className="w-2.5 h-2.5 text-green-400" />}
    </span>
  );
}

function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) return <span className="text-slate-500">—</span>;
  const overdue = isOverdue(dueDate);
  const soon = isDueSoon(dueDate);
  return (
    <span className={`flex items-center gap-1 ${dueDateClass(dueDate)}`}>
      {overdue && <AlertTriangle className="w-3 h-3" />}
      {soon && <Clock className="w-3 h-3" />}
      {formatDate(dueDate)}
    </span>
  );
}

function ListView({
  tasks, statuses, quickAddTitle, setQuickAddTitle, onQuickAdd, onSelectTask,
  onSort, sortBy, sortDirection, selectedTaskIds, onToggleSelect, onToggleSelectAll,
  onInlineStatusChange, onInlinePriorityChange, onInlineAssigneeChange, teamMembers,
}: {
  tasks: TaskItem[];
  statuses: TaskStatusItem[];
  quickAddTitle: string;
  setQuickAddTitle: (v: string) => void;
  onQuickAdd: () => void;
  onSelectTask: (id: string) => void;
  onSort: (field: 'position' | 'dueDate' | 'priority' | 'createdAt' | 'title') => void;
  sortBy: string;
  sortDirection: string;
  selectedTaskIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onInlineStatusChange: (taskId: string, statusId: string) => void;
  onInlinePriorityChange: (taskId: string, priority: string) => void;
  onInlineAssigneeChange: (taskId: string, assigneeId: string | null) => void;
  teamMembers: TeamMember[];
}) {
  const [openDropdown, setOpenDropdown] = useState<{ taskId: string; field: string } | null>(null);

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          <Input
            value={quickAddTitle}
            onChange={(e) => setQuickAddTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onQuickAdd()}
            placeholder="Add a task... (press Enter)"
            className="flex-1 h-8 bg-transparent border-none text-white placeholder:text-slate-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_120px_100px_120px_100px_80px] gap-0 px-4 py-2 border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <div className="flex items-center pr-2">
          <button onClick={onToggleSelectAll} className="p-0.5">
            {selectedTaskIds.length === tasks.length && tasks.length > 0
              ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              : <Square className="w-3.5 h-3.5 text-slate-500" />
            }
          </button>
        </div>
        <button onClick={() => onSort('title')} className="flex items-center gap-1 text-left hover:text-white transition-colors">
          Title <SortIcon field="title" sortBy={sortBy} sortDirection={sortDirection} />
        </button>
        <button onClick={() => onSort('priority')} className="flex items-center gap-1 hover:text-white transition-colors">
          Status
        </button>
        <button onClick={() => onSort('priority')} className="flex items-center gap-1 hover:text-white transition-colors">
          Priority <SortIcon field="priority" sortBy={sortBy} sortDirection={sortDirection} />
        </button>
        <div className="text-left">Assignee</div>
        <button onClick={() => onSort('dueDate')} className="flex items-center gap-1 hover:text-white transition-colors">
          Due Date <SortIcon field="dueDate" sortBy={sortBy} sortDirection={sortDirection} />
        </button>
        <div className="text-left">Tags</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">No tasks yet. Add your first task!</p>
          </div>
        ) : (
          tasks.map(task => {
            const statusInfo = getStatusInfo(task.statusId);
            const pri = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            const isSelected = selectedTaskIds.includes(task._id);

            return (
              <div
                key={task._id}
                className={`grid grid-cols-[auto_1fr_120px_100px_120px_100px_80px] gap-0 px-4 py-2.5 border-b border-slate-700/20 items-center text-sm transition-colors group ${
                  isSelected ? 'bg-cyan-500/5' : 'hover:bg-slate-700/20'
                } ${isOverdue(task.dueDate) ? 'border-l-2 border-l-red-500/50' : isDueSoon(task.dueDate) ? 'border-l-2 border-l-amber-500/50' : ''}`}
              >
                <div className="flex items-center pr-2">
                  <button onClick={() => onToggleSelect(task._id)} className="p-0.5">
                    {isSelected
                      ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                      : <Square className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => onSelectTask(task._id)}>
                  <span className="text-white truncate hover:text-cyan-200 transition-colors">{task.title}</span>
                  <SubtaskBadge task={task} />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown?.taskId === task._id && openDropdown.field === 'status' ? null : { taskId: task._id, field: 'status' })}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs hover:bg-slate-700/30 transition-colors"
                  >
                    <Circle className="w-2.5 h-2.5 flex-shrink-0" style={{ color: statusInfo.color, fill: statusInfo.color }} />
                    <span className="text-slate-300 truncate">{statusInfo.name}</span>
                  </button>
                  {openDropdown?.taskId === task._id && openDropdown.field === 'status' && (
                    <InlineDropdown onClose={() => setOpenDropdown(null)}>
                      {statuses.map(s => (
                        <button
                          key={s._id}
                          onClick={() => { onInlineStatusChange(task._id, s._id); setOpenDropdown(null); }}
                          className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-700/50 text-slate-300"
                        >
                          <Circle className="w-2.5 h-2.5" style={{ color: s.color, fill: s.color }} />
                          {s.name}
                        </button>
                      ))}
                    </InlineDropdown>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown?.taskId === task._id && openDropdown.field === 'priority' ? null : { taskId: task._id, field: 'priority' })}
                    className={`px-2 py-0.5 rounded-md text-xs border capitalize ${pri.bg} ${pri.color} ${pri.border} hover:opacity-80 transition-opacity`}
                  >
                    {task.priority}
                  </button>
                  {openDropdown?.taskId === task._id && openDropdown.field === 'priority' && (
                    <InlineDropdown onClose={() => setOpenDropdown(null)}>
                      {Object.entries(PRIORITY_CONFIG).map(([p, cfg]) => (
                        <button
                          key={p}
                          onClick={() => { onInlinePriorityChange(task._id, p); setOpenDropdown(null); }}
                          className="w-full px-3 py-1.5 text-left text-xs capitalize hover:bg-slate-700/50 text-slate-300"
                        >
                          <span className={cfg.color}>{p}</span>
                        </button>
                      ))}
                    </InlineDropdown>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown?.taskId === task._id && openDropdown.field === 'assignee' ? null : { taskId: task._id, field: 'assignee' })}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors truncate"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-cyan-300 flex-shrink-0">
                      {getAssigneeInitial(task.assigneeId)}
                    </div>
                    <span className="truncate">{getAssigneeName(task.assigneeId)}</span>
                  </button>
                  {openDropdown?.taskId === task._id && openDropdown.field === 'assignee' && (
                    <InlineDropdown onClose={() => setOpenDropdown(null)}>
                      <button
                        onClick={() => { onInlineAssigneeChange(task._id, null); setOpenDropdown(null); }}
                        className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700/50 text-slate-400"
                      >
                        Unassigned
                      </button>
                      {teamMembers.map(m => (
                        <button
                          key={m._id}
                          onClick={() => { onInlineAssigneeChange(task._id, m._id); setOpenDropdown(null); }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700/50 text-slate-300 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-slate-600 flex items-center justify-center text-[9px] font-bold text-cyan-300">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          {m.name}
                        </button>
                      ))}
                    </InlineDropdown>
                  )}
                </div>

                <div className="text-xs">
                  <DueDateBadge dueDate={task.dueDate} />
                </div>

                <div className="flex gap-1 flex-wrap">
                  {task.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[10px] border px-1.5 py-0">{tag}</Badge>
                  ))}
                  {task.tags.length > 2 && <span className="text-[10px] text-slate-500">+{task.tags.length - 2}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BoardView({
  statuses, tasksByStatus, filteredTasks, boardQuickAdd, setBoardQuickAdd,
  onQuickAdd, onSelectTask, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
  draggedTaskId, dragOverStatus,
}: {
  statuses: TaskStatusItem[];
  tasksByStatus: Record<string, TaskItem[]>;
  filteredTasks: TaskItem[];
  boardQuickAdd: Record<string, string>;
  setBoardQuickAdd: (v: Record<string, string>) => void;
  onQuickAdd: (statusId: string) => void;
  onSelectTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, statusId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, statusId: string) => void;
  draggedTaskId: string | null;
  dragOverStatus: string | null;
}) {
  const filteredIds = new Set(filteredTasks.map(t => t._id));

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {statuses.map(status => {
        const statusTasks = (tasksByStatus[status._id] || []).filter(t => filteredIds.has(t._id));
        const isDragOver = dragOverStatus === status._id;

        return (
          <div
            key={status._id}
            className={`min-w-[280px] w-[300px] flex flex-col bg-slate-800/30 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-200 ${
              isDragOver
                ? 'border-cyan-500/60 bg-cyan-500/5 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                : 'border-slate-700/50'
            }`}
            onDragOver={(e) => onDragOver(e, status._id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, status._id)}
          >
            <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3" style={{ color: status.color, fill: status.color }} />
                <span className="font-semibold text-sm text-white">{status.name}</span>
                <Badge className="bg-slate-700/50 text-slate-400 text-[10px] border-slate-600">{statusTasks.length}</Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {isDragOver && statusTasks.length === 0 && (
                <div className="border-2 border-dashed border-cyan-500/40 rounded-xl p-4 text-center">
                  <p className="text-xs text-cyan-400/60">Drop here</p>
                </div>
              )}
              {statusTasks.map(task => {
                const pri = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                const isDragging = draggedTaskId === task._id;

                return (
                  <motion.div
                    key={task._id}
                    layout
                    draggable
                    onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task._id)}
                    onDragEnd={(e) => onDragEnd(e as unknown as React.DragEvent)}
                    onClick={() => onSelectTask(task._id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'opacity-50 scale-95 border-cyan-500/50 bg-slate-700/50 shadow-lg'
                        : isOverdue(task.dueDate)
                          ? 'bg-slate-800/60 border-red-500/30 hover:border-red-500/50 hover:bg-slate-700/40'
                          : isDueSoon(task.dueDate)
                            ? 'bg-slate-800/60 border-amber-500/30 hover:border-amber-500/50 hover:bg-slate-700/40'
                            : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/40'
                    }`}
                  >
                    <p className="text-sm text-white font-medium mb-2 leading-tight">{task.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`border text-[10px] capitalize ${pri.bg} ${pri.color} ${pri.border}`}>
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${dueDateClass(task.dueDate)}`}>
                          {isOverdue(task.dueDate) && <AlertTriangle className="w-2.5 h-2.5" />}
                          {isDueSoon(task.dueDate) && <Clock className="w-2.5 h-2.5" />}
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      <SubtaskBadge task={task} />
                    </div>
                    {task.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {task.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[9px] border px-1 py-0">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                        {getAssigneeInitial(task.assigneeId)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <Input
                  value={boardQuickAdd[status._id] || ''}
                  onChange={(e) => setBoardQuickAdd({ ...boardQuickAdd, [status._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && onQuickAdd(status._id)}
                  placeholder="Add task..."
                  className="flex-1 h-7 bg-transparent border-none text-white placeholder:text-slate-600 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({
  calendarDate, setCalendarDate, calendarDays, tasksForDay, selectedDay, setSelectedDay, selectedDayTasks, onSelectTask,
}: {
  calendarDate: Date;
  setCalendarDate: (d: Date) => void;
  calendarDays: (Date | null)[];
  tasksForDay: (day: Date) => TaskItem[];
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  selectedDayTasks: TaskItem[];
  onSelectTask: (id: string) => void;
}) {
  const today = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-700/30 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-white">{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-700/30 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 border-b border-slate-700/50">
        {dayNames.map(d => (
          <div key={d} className="p-2 text-center text-xs font-semibold text-slate-400 uppercase">{d}</div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-0 overflow-y-auto">
        {calendarDays.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="border-b border-r border-slate-700/20 bg-slate-900/20" />;
          const dayTasks = tasksForDay(day);
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = selectedDay?.toDateString() === day.toDateString();

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={`border-b border-r border-slate-700/20 p-1.5 text-left min-h-[80px] transition-colors ${
                isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-700/10'
              }`}
            >
              <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
                {isToday ? (
                  <span className="bg-cyan-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center">{day.getDate()}</span>
                ) : day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(t => {
                  const statusInfo = getStatusInfo(t.statusId);
                  return (
                    <div
                      key={t._id}
                      onClick={(e) => { e.stopPropagation(); onSelectTask(t._id); }}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                        isOverdue(t.dueDate) ? 'bg-red-500/20 text-red-300' : 'text-white'
                      }`}
                      style={!isOverdue(t.dueDate) ? { backgroundColor: `${statusInfo.color}20`, color: statusInfo.color } : undefined}
                    >
                      {t.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-slate-500 pl-1">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="border-t border-slate-700/50 p-4 max-h-[200px] overflow-y-auto">
          <h4 className="text-sm font-semibold text-white mb-2">
            {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
          {selectedDayTasks.length === 0 ? (
            <p className="text-xs text-slate-400">No tasks for this day</p>
          ) : (
            <div className="space-y-1">
              {selectedDayTasks.map(t => {
                const pri = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
                return (
                  <button
                    key={t._id}
                    onClick={() => onSelectTask(t._id)}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <span className="text-sm text-white flex-1 truncate">{t.title}</span>
                    <Badge className={`border text-[10px] capitalize ${pri.bg} ${pri.color} ${pri.border}`}>{t.priority}</Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
