import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectTaskState = (state: RootState) => state.tasks;
export const selectSpaces = (state: RootState) => state.tasks.spaces;
export const selectLists = (state: RootState) => state.tasks.lists;
export const selectStatuses = (state: RootState) => state.tasks.statuses;
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectSelectedSpaceId = (state: RootState) => state.tasks.selectedSpaceId;
export const selectSelectedListId = (state: RootState) => state.tasks.selectedListId;
export const selectSelectedTaskId = (state: RootState) => state.tasks.selectedTaskId;
export const selectViewMode = (state: RootState) => state.tasks.viewMode;
export const selectTaskLoading = (state: RootState) => state.tasks.isLoading;
export const selectSearchTerm = (state: RootState) => state.tasks.searchTerm;
export const selectFilterPriority = (state: RootState) => state.tasks.filterPriority;
export const selectFilterMyTasks = (state: RootState) => state.tasks.filterMyTasks;

export const selectListsForSpace = createSelector(
  [selectLists, selectSelectedSpaceId],
  (lists, spaceId) => spaceId ? lists.filter(l => l.spaceId === spaceId) : lists
);

export const selectSelectedSpace = createSelector(
  [selectSpaces, selectSelectedSpaceId],
  (spaces, id) => spaces.find(s => s._id === id) || null
);

export const selectSelectedList = createSelector(
  [selectLists, selectSelectedListId],
  (lists, id) => lists.find(l => l._id === id) || null
);

export const selectTasksByStatus = createSelector(
  [selectTasks, selectStatuses],
  (tasks, statuses) => {
    const grouped: Record<string, typeof tasks> = {};
    statuses.forEach(s => { grouped[s._id] = []; });
    tasks.forEach(t => {
      const statusId = typeof t.statusId === 'object' ? t.statusId._id : t.statusId;
      if (!grouped[statusId]) grouped[statusId] = [];
      grouped[statusId].push(t);
    });
    return grouped;
  }
);

export const selectTasksWithDueDate = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(t => t.dueDate)
);
