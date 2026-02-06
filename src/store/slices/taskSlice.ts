import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface TaskStatusItem {
  _id: string;
  name: string;
  color: string;
  type: string;
  position: number;
}

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  spaceId: string;
  listId: string;
  statusId: string | TaskStatusItem;
  priority: string;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  assigneeId: TaskUser | string | null;
  createdById: TaskUser | string;
  watchers: TaskUser[];
  tags: string[];
  points: number | null;
  timeEstimateMinutes: number | null;
  timeTrackedMinutes: number;
  position: number;
  parentTaskId: string | null;
  checklist: Array<{ id: string; text: string; completed: boolean; assigneeId?: string }>;
  crmLinks: Array<{ type: string; refId: string; label: string }>;
  customFields: Record<string, unknown>;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceItem {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isArchived: boolean;
  position: number;
}

export interface ListItem {
  _id: string;
  name: string;
  description: string;
  spaceId: string;
  color: string;
  isArchived: boolean;
  position: number;
}

export type ViewMode = 'list' | 'board' | 'calendar';

interface TaskState {
  spaces: SpaceItem[];
  lists: ListItem[];
  statuses: TaskStatusItem[];
  tasks: TaskItem[];
  selectedSpaceId: string | null;
  selectedListId: string | null;
  selectedTaskId: string | null;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterPriority: string;
  filterAssignee: string;
  filterMyTasks: boolean;
}

const initialState: TaskState = {
  spaces: [],
  lists: [],
  statuses: [],
  tasks: [],
  selectedSpaceId: null,
  selectedListId: null,
  selectedTaskId: null,
  viewMode: 'list',
  isLoading: false,
  error: null,
  searchTerm: '',
  filterPriority: '',
  filterAssignee: '',
  filterMyTasks: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSpaces: (state, action: PayloadAction<SpaceItem[]>) => {
      state.spaces = action.payload;
    },
    setLists: (state, action: PayloadAction<ListItem[]>) => {
      state.lists = action.payload;
    },
    setStatuses: (state, action: PayloadAction<TaskStatusItem[]>) => {
      state.statuses = action.payload;
    },
    setTasks: (state, action: PayloadAction<TaskItem[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<TaskItem>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<TaskItem>) => {
      const idx = state.tasks.findIndex(t => t._id === action.payload._id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setSelectedSpace: (state, action: PayloadAction<string | null>) => {
      state.selectedSpaceId = action.payload;
      state.selectedListId = null;
    },
    setSelectedList: (state, action: PayloadAction<string | null>) => {
      state.selectedListId = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setFilterAssignee: (state, action: PayloadAction<string>) => {
      state.filterAssignee = action.payload;
    },
    setFilterMyTasks: (state, action: PayloadAction<boolean>) => {
      state.filterMyTasks = action.payload;
    },
  },
});

export const {
  setSpaces, setLists, setStatuses, setTasks,
  addTask, updateTask, removeTask,
  setSelectedSpace, setSelectedList, setSelectedTask,
  setViewMode, setLoading, setError,
  setSearchTerm, setFilterPriority, setFilterAssignee, setFilterMyTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
