import { Task as PrismaTask } from '@prisma/client';

export enum TaskStatus {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Review = 'Review',
  Done = 'Done',
}

export type Task = PrismaTask & {
  status: TaskStatus;
};

export type TaskInStatusGroup = Omit<
  Task,
  'boardSlug' | 'dueDate' | 'createdAt' | 'updatedAt' | 'status'
> & {
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskByStatus = {
  status: TaskStatus;
  taskCount: number;
  tasks: TaskInStatusGroup[];
};
