'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSpaces, fetchLists, fetchStatuses, fetchTasks,
  createTask, editTask, createSpace, createList, seedTasks,
} from '@/store/actions/taskActions';
import {
  selectSpaces, selectLists, selectStatuses, selectTasks,
  selectSelectedSpaceId, selectSelectedListId, selectViewMode,
  selectTaskLoading, selectSearchTerm, selectFilterPriority,
  selectFilterMyTasks, selectSelectedList, selectTasksByStatus,
  selectTasksWithDueDate,
} from '@/store/selectors/taskSelectors';
import {
  setSelectedSpace, setSelectedList, setSelectedTask,
  setViewMode, setSearchTerm, setFilterPriority, setFilterMyTasks,
} from '@/store/slices/taskSlice';
import type { ViewMode, TaskItem, TaskStatusItem, TaskUser } from '@/store/slices/taskSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Rows3, LayoutGrid, Calendar, Plus, Search, ChevronRight, ChevronDown,
  Menu, X, Sparkles, Database, ChevronLeft, Clock, User, Tag, Filter,
  Loader2, FolderOpen, ListTodo, GripVertical,
} from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  urgent: { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  high: { color: 'text-orange-300', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  medium: { color: 'text-blue-300', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  low: { color: 'text-slate-300', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
};

const PRESET_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

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
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  useEffect(() => {
    dispatch(fetchSpaces() as never);
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
    }
  }, [dispatch, selectedListId]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(lower) || t.description?.toLowerCase().includes(lower));
    }
    if (filterPriority) {
      result = result.filter(t => t.priority === filterPriority);
    }
    return result;
  }, [tasks, searchTerm, filterPriority]);

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
    if (!title?.trim() || !selectedListId) return;
    const firstStatus = statusId || (statuses.length > 0 ? statuses[0]._id : '');
    if (!firstStatus) return;
    await dispatch(createTask({
      title: title.trim(),
      listId: selectedListId,
      statusId: firstStatus,
      priority: 'medium',
    }) as never);
    if (statusId) {
      setBoardQuickAdd(prev => ({ ...prev, [statusId]: '' }));
    } else {
      setQuickAddTitle('');
    }
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
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-50 md:hidden p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* LEFT SIDEBAR */}
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

        {/* MAIN AREA */}
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
              {/* TOP BAR */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">{selectedList?.name || 'Tasks'}</h2>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                      {filteredTasks.length} tasks
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* View Switcher */}
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

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        className="pl-9 h-9 w-40 md:w-52 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm"
                      />
                    </div>

                    {/* Priority Filter */}
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

                    {/* My Tasks */}
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
                  </div>
                </div>
              </motion.div>

              {/* CONTENT AREA */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader2 className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                  </div>
                ) : viewMode === 'list' ? (
                  <ListView
                    tasks={filteredTasks}
                    statuses={statuses}
                    quickAddTitle={quickAddTitle}
                    setQuickAddTitle={setQuickAddTitle}
                    onQuickAdd={() => handleQuickAdd()}
                    onSelectTask={(id) => dispatch(setSelectedTask(id))}
                  />
                ) : viewMode === 'board' ? (
                  <BoardView
                    statuses={statuses}
                    tasksByStatus={tasksByStatus}
                    filteredTasks={filteredTasks}
                    boardQuickAdd={boardQuickAdd}
                    setBoardQuickAdd={setBoardQuickAdd}
                    onQuickAdd={handleQuickAdd}
                    onSelectTask={(id) => dispatch(setSelectedTask(id))}
                    onDragStart={handleDragStart}
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

      {/* CREATE SPACE MODAL */}
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
                <label className="text-sm text-slate-400 mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewSpaceColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${newSpaceColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowCreateSpaceModal(false)} className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                  Cancel
                </Button>
                <Button onClick={handleCreateSpace} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
                  Create
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* CREATE LIST MODAL */}
      <AnimatePresence>
        {showCreateListModal && (
          <Modal onClose={() => setShowCreateListModal(false)}>
            <h3 className="text-lg font-bold text-white mb-4">Create List</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Name</label>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowCreateListModal(false)} className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                  Cancel
                </Button>
                <Button onClick={handleCreateList} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
                  Create
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ListView({
  tasks, statuses, quickAddTitle, setQuickAddTitle, onQuickAdd, onSelectTask,
}: {
  tasks: TaskItem[];
  statuses: TaskStatusItem[];
  quickAddTitle: string;
  setQuickAddTitle: (v: string) => void;
  onQuickAdd: () => void;
  onSelectTask: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
    >
      {/* Quick Add */}
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

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_120px_100px_120px_100px_100px] gap-2 px-4 py-2 border-b border-slate-700/50 text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[700px]">
        <span>Title</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Assignee</span>
        <span>Due Date</span>
        <span>Tags</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400">No tasks yet. Add your first task!</p>
          </div>
        ) : (
          <div className="min-w-[700px]">
            {tasks.map((task, i) => {
              const status = getStatusInfo(task.statusId);
              const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const overdue = isOverdue(task.dueDate);
              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onSelectTask(task._id)}
                  className="grid grid-cols-[1fr_120px_100px_120px_100px_100px] gap-2 px-4 py-3 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-colors items-center"
                >
                  <span className="text-sm text-white truncate">{task.title}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                    <span className="text-xs text-slate-400 truncate">{status.name}</span>
                  </div>
                  <Badge className={`text-xs w-fit ${priority.bg} ${priority.color} ${priority.border}`}>
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-slate-400 truncate">{getAssigneeName(task.assigneeId)}</span>
                  <span className={`text-xs ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                    {formatDate(task.dueDate)}
                  </span>
                  <div className="flex gap-1 overflow-hidden">
                    {task.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded truncate">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BoardView({
  statuses, tasksByStatus, filteredTasks, boardQuickAdd, setBoardQuickAdd,
  onQuickAdd, onSelectTask, onDragStart, onDragOver, onDragLeave, onDrop,
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
  onDragOver: (e: React.DragEvent, statusId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, statusId: string) => void;
  draggedTaskId: string | null;
  dragOverStatus: string | null;
}) {
  const filteredIds = new Set(filteredTasks.map(t => t._id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-x-auto"
    >
      <div className="flex gap-4 h-full pb-4 min-w-max">
        {statuses.map((status, colIdx) => {
          const columnTasks = (tasksByStatus[status._id] || []).filter(t => filteredIds.has(t._id));
          const isDragOver = dragOverStatus === status._id;
          return (
            <motion.div
              key={status._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.05 }}
              onDragOver={(e) => onDragOver(e, status._id)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, status._id)}
              className={`w-72 flex-shrink-0 bg-slate-800/40 backdrop-blur-xl border rounded-2xl flex flex-col transition-all ${
                isDragOver ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-700/50'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm font-semibold text-white flex-1">{status.name}</span>
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {columnTasks.map((task, idx) => {
                  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                  const overdue = isOverdue(task.dueDate);
                  return (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      draggable
                      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task._id)}
                      onClick={() => onSelectTask(task._id)}
                      className={`bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 cursor-pointer hover:bg-slate-700/50 hover:border-slate-500/50 transition-all group ${
                        draggedTaskId === task._id ? 'opacity-40' : ''
                      }`}
                    >
                      <p className="text-sm text-white font-medium mb-2 line-clamp-2">{task.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-[10px] ${priority.bg} ${priority.color} ${priority.border}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <span className={`text-[10px] flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                            <Clock className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                            {getAssigneeInitial(task.assigneeId)}
                          </div>
                          <span className="text-[10px] text-slate-400">{getAssigneeName(task.assigneeId)}</span>
                        </div>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 1).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-600/40 text-slate-400 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Add */}
              <div className="p-2 border-t border-slate-700/50">
                <Input
                  value={boardQuickAdd[status._id] || ''}
                  onChange={(e) => setBoardQuickAdd({ ...boardQuickAdd, [status._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && onQuickAdd(status._id)}
                  placeholder="+ Add task..."
                  className="h-8 bg-transparent border-slate-700/50 text-white placeholder:text-slate-500 text-xs rounded-lg focus-visible:ring-0 focus-visible:border-cyan-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-4"
    >
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex-1 flex flex-col overflow-auto">
        {/* Calendar Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white">
            {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-medium text-slate-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dayTasks = tasksForDay(day);
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = selectedDay?.toDateString() === day.toDateString();
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative p-1 md:p-2 rounded-xl text-left transition-all min-h-[60px] md:min-h-[80px] ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/40'
                    : isToday
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'hover:bg-slate-700/30 border border-transparent'
                }`}
              >
                <span className={`text-xs md:text-sm font-medium ${
                  isToday ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayTasks.slice(0, 3).map(t => {
                      const status = getStatusInfo(t.statusId);
                      return (
                        <div
                          key={t._id}
                          className="w-full truncate text-[9px] md:text-[10px] px-1 py-0.5 rounded"
                          style={{ backgroundColor: status.color + '30', color: status.color }}
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <span className="text-[9px] text-slate-500">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Panel */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 max-h-60 overflow-auto"
          >
            <h4 className="text-sm font-semibold text-white mb-3">
              Tasks for {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h4>
            {selectedDayTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No tasks due on this day</p>
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.map(task => {
                  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                  return (
                    <div
                      key={task._id}
                      onClick={() => onSelectTask(task._id)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/30 cursor-pointer transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusInfo(task.statusId).color }} />
                      <span className="text-sm text-white flex-1 truncate">{task.title}</span>
                      <Badge className={`text-[10px] ${priority.bg} ${priority.color} ${priority.border}`}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-slate-400">{getAssigneeName(task.assigneeId)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <TaskDetailModal />
    </motion.div>
  );
}