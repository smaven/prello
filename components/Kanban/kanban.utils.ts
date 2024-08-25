import { TaskPriority } from '@prisma/client';
import { TaskStatus } from '@/lib/types';

export const colorByStatus: Map<TaskStatus, string> = new Map([
  [TaskStatus.Todo, 'blue'],
  [TaskStatus.InProgress, 'orange'],
  [TaskStatus.Review, 'pink'],
  [TaskStatus.Done, 'green'],
]);

export const colorByPriority: Map<TaskPriority, string> = new Map([
  [TaskPriority.LOW, 'gray'],
  [TaskPriority.MEDIUM, 'blue'],
  [TaskPriority.HIGH, 'red'],
]);
