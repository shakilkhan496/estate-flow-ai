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
export const selectSortBy = (state: RootState) => state.tasks.sortBy;
export const selectSortDirection = (state: RootState) => state.tasks.sortDirection;
export const selectSelectedTaskIds = (state: RootState) => state.tasks.selectedTaskIds;

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

export const selectSortedFilteredTasks = createSelector(
  [selectTasks, selectSearchTerm, selectFilterPriority, selectSortBy, selectSortDirection],
  (tasks, searchTerm, filterPriority, sortBy, sortDirection) => {
    // First filter by search term (title/description)
    let filtered = tasks.filter(task => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    });

    // Then filter by priority if set
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Then sort based on sortBy/sortDirection
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'position':
          comparison = a.position - b.position;
          break;

        case 'dueDate':
          // null dates go last
          if (a.dueDate === null && b.dueDate === null) comparison = 0;
          else if (a.dueDate === null) comparison = 1;
          else if (b.dueDate === null) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;

        case 'priority':
          // priority order: urgent=0, high=1, medium=2, low=3
          const priorityOrder: Record<string, number> = {
            urgent: 0,
            high: 1,
            medium: 2,
            low: 3,
          };
          const aPriority = priorityOrder[a.priority] ?? 3;
          const bPriority = priorityOrder[b.priority] ?? 3;
          comparison = aPriority - bPriority;
          break;

        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;

        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;

        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
);
