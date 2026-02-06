import { AppDispatch } from '@/store';
import {
  setSpaces, setLists, setStatuses, setTasks,
  addTask, updateTask, removeTask,
  setLoading, setError,
} from '@/store/slices/taskSlice';

export const fetchSpaces = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/spaces');
    if (res.ok) {
      const data = await res.json();
      dispatch(setSpaces(data.spaces));
    }
  } catch (err) {
    console.error('Error fetching spaces:', err);
  }
};

export const fetchLists = (spaceId?: string) => async (dispatch: AppDispatch) => {
  try {
    const params = spaceId ? `?spaceId=${spaceId}` : '';
    const res = await fetch(`/api/tasks/lists${params}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setLists(data.lists));
    }
  } catch (err) {
    console.error('Error fetching lists:', err);
  }
};

export const fetchStatuses = (listId: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/tasks/statuses?listId=${listId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setStatuses(data.statuses));
    }
  } catch (err) {
    console.error('Error fetching statuses:', err);
  }
};

export const fetchTasks = (params: Record<string, string> = {}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/tasks/items?${query}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setTasks(data.tasks));
    }
  } catch (err) {
    console.error('Error fetching tasks:', err);
    dispatch(setError('Failed to load tasks'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createTask = (taskData: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addTask(data.task));
      return { success: true, task: data.task };
    }
    const errData = await res.json();
    return { success: false, error: errData.error };
  } catch {
    return { success: false, error: 'Network error' };
  }
};

export const editTask = (taskId: string, updates: Record<string, unknown>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/tasks/items/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateTask(data.task));
      return { success: true, task: data.task };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const deleteTask = (taskId: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/tasks/items/${taskId}`, { method: 'DELETE' });
    if (res.ok) {
      dispatch(removeTask(taskId));
      return { success: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const createSpace = (data: { name: string; description?: string; color?: string }) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      dispatch(fetchSpaces() as unknown as ReturnType<typeof setSpaces>);
      return { success: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const createList = (data: { name: string; spaceId: string; color?: string }) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      dispatch(fetchLists(data.spaceId) as unknown as ReturnType<typeof setLists>);
      return { success: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const seedTasks = () => async () => {
  try {
    const res = await fetch('/api/tasks/seed', { method: 'POST' });
    if (res.ok) return { success: true };
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const bulkDeleteTasks = (taskIds: string[]) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/items/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIds }),
    });
    if (res.ok) {
      taskIds.forEach(id => dispatch(removeTask(id)));
      return { success: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const bulkUpdateTasks = (taskIds: string[], updates: Record<string, unknown>, listId?: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch('/api/tasks/items/bulk', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIds, updates }),
    });
    if (res.ok) {
      if (listId) {
        const query = new URLSearchParams({ listId }).toString();
        const tasksRes = await fetch(`/api/tasks/items?${query}`);
        if (tasksRes.ok) {
          const data = await tasksRes.json();
          dispatch(setTasks(data.tasks));
        }
      }
      return { success: true };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const fetchTeamMembers = async (): Promise<Array<{ _id: string; name: string; email: string; role: string }>> => {
  try {
    const res = await fetch('/api/tasks/members');
    if (res.ok) {
      const data = await res.json();
      return data.members || [];
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchTaskTemplates = async (): Promise<Array<{ id: string; name: string; description: string; priority: string; checklist: Array<{ id: string; text: string; completed: boolean }>; tags: string[] }>> => {
  try {
    const res = await fetch('/api/tasks/templates');
    if (res.ok) {
      const data = await res.json();
      return data.templates || [];
    }
    return [];
  } catch {
    return [];
  }
};
