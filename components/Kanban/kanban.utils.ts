import { TaskPriority } from '@prisma/client';
import { TaskStatus } from '@/lib/types';

export const colorByStatus: Map<TaskStatus, { color: string; twClass: string }> = new Map([
  [TaskStatus.Todo, { color: 'blue', twClass: 'border-blue-400 dark:border-blue-400' }],
  [TaskStatus.InProgress, { color: 'orange', twClass: 'border-orange-400 dark:border-orange-400' }],
  [TaskStatus.Review, { color: 'pink', twClass: 'border-pink-400 dark:border-pink-400' }],
  [TaskStatus.Done, { color: 'green', twClass: 'border-green-400 dark:border-green-400' }],
]);

export const colorByPriority: Map<TaskPriority, string> = new Map([
  [TaskPriority.LOW, 'blue'],
  [TaskPriority.MEDIUM, 'orange'],
  [TaskPriority.HIGH, 'red'],
]);
