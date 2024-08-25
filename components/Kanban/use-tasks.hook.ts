import { produce } from 'immer';
import { useCallback, useEffect, useReducer } from 'react';
import { TaskByStatus, TaskStatus } from '@/lib/types';
import { useUpdateTask } from '@/hooks/api/use-update-task.hook';

export const useTasks = (tasksByStatus: TaskByStatus[]) => {
  const [state, dispatch] = useReducer(tasksReducer, { taskGroups: tasksByStatus, loading: false });
  const { mutate: updateTask } = useUpdateTask({ skipRefresh: true });

  const moveTask = useCallback(
    async (data: MoveStatusPayload & { boardSlug: string }) => {
      // If the task is moved to the same status, do nothing
      if (data.fromStatus === data.toStatus) return;

      dispatch({ type: TaskActionType.START_MOVE_STATUS });
      try {
        dispatch({ type: TaskActionType.MOVE_STATUS, payload: data });
        await updateTask({
          boardSlug: data.boardSlug,
          task: { id: data.taskId, status: data.toStatus },
        });
      } catch (error: unknown) {
        // Move the task back to the original status
        dispatch({
          type: TaskActionType.MOVE_STATUS,
          payload: {
            taskId: data.taskId,
            fromStatus: data.toStatus,
            toStatus: data.fromStatus,
          },
        });
      } finally {
        dispatch({ type: TaskActionType.END_MOVE_STATUS });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch({ type: TaskActionType.SET_TASKS, payload: tasksByStatus });
  }, [tasksByStatus]);

  return { taskState: state, moveTask };
};

function tasksReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case TaskActionType.START_MOVE_STATUS: {
      return { ...state, loading: true };
    }
    case TaskActionType.END_MOVE_STATUS: {
      return { ...state, loading: false };
    }
    case TaskActionType.SET_TASKS: {
      return { ...state, taskGroups: action.payload };
    }
    case TaskActionType.MOVE_STATUS: {
      const { taskId, fromStatus, toStatus } = action.payload;

      // get group indices
      const fromGroupIndex = state.taskGroups.findIndex((group) => group.status === fromStatus);
      const toGroupIndex = state.taskGroups.findIndex((group) => group.status === toStatus);
      if (fromGroupIndex === -1 || toGroupIndex === -1) return state;

      // get task index
      const taskIndex = state.taskGroups[fromGroupIndex].tasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex === -1) return state;

      const nextState = produce(state, (draft) => {
        // remove task from current status
        const task = draft.taskGroups[fromGroupIndex].tasks.splice(taskIndex, 1)[0];
        if (!task) return;

        // Update task status
        task.status = toStatus;

        // add task to new status
        draft.taskGroups[toGroupIndex].tasks.push(task);

        // sort tasks by createdAt
        draft.taskGroups[toGroupIndex].tasks.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      return nextState;
    }
    default:
      return state;
  }
}

export enum TaskActionType {
  START_MOVE_STATUS = 'START_MOVE_STATUS',
  END_MOVE_STATUS = 'END_MOVE_STATUS',
  MOVE_STATUS = 'MOVE_STATUS',
  SET_TASKS = 'SET_TASKS',
}

export interface MoveStatusPayload {
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
}

export interface MoveStatusAction {
  type: TaskActionType.MOVE_STATUS;
  payload: MoveStatusPayload;
}

export interface StartMutationAction {
  type: TaskActionType.START_MOVE_STATUS;
}

export interface EndMutationAction {
  type: TaskActionType.END_MOVE_STATUS;
}

export interface RefreshTasksAction {
  type: TaskActionType.SET_TASKS;
  payload: TaskByStatus[];
}

export type TaskAction =
  | MoveStatusAction
  | StartMutationAction
  | EndMutationAction
  | RefreshTasksAction;

export interface TaskState {
  loading: boolean;
  taskGroups: TaskByStatus[];
}
