import { Board, Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { prisma } from './db';
import { TaskByStatus, TaskStatus } from './types';

// TEMP
export const loggedInUserId = '25ea6d71-5a1d-4d00-9b94-b9037cee5460';

export enum CacheKey {
  Boards = 'boards',
  Tasks = 'tasks',
}

export const getBoards = () => {
  const userId = loggedInUserId;
  return unstable_cache(
    async (): Promise<Board[]> => {
      const boards = await prisma.board.findMany({
        where: { userId },
        orderBy: { createdAt: Prisma.SortOrder.asc },
      });
      return boards;
    },
    [userId, CacheKey.Boards],
    { tags: [CacheKey.Boards], revalidate: 60 * 60 }
  )();
};

export const getBoard = (boardSlug: string) => {
  const userId = loggedInUserId;
  return unstable_cache(
    async () => prisma.board.findUniqueOrThrow({ where: { slug: boardSlug } }),
    [userId, CacheKey.Boards, boardSlug],
    { tags: [boardSlug], revalidate: 60 * 60 }
  )();
};

export const getTasks = (boardSlug: string) => {
  const userId = loggedInUserId;
  return unstable_cache(
    async () => {
      const tasks = await prisma.$queryRaw<TaskByStatus[]>`
        SELECT status
            , COUNT(*)::integer AS "taskCount"
            , JSON_AGG(
                JSON_BUILD_OBJECT(
                        'id', id,
                        'title', title,
                        'description', description,
                        'priority', priority,
                        'dueDate', "dueDate",
                        'createdAt', "createdAt",
                        'updatedAt', "updatedAt"
                ) ORDER BY "createdAt"
              )                 AS tasks
        FROM "Task"
        WHERE "boardSlug" = ${boardSlug}
        GROUP BY "status"
        ORDER BY "status";
      `;

      // Order the statuses in the order they are defined in TaskStatus
      const statusOrder = Object.values(TaskStatus);
      const sortedTasks = statusOrder.map((status) =>
        tasks.find((task) => task.status === status)
      ) as TaskByStatus[];

      return sortedTasks;
    },
    [userId, CacheKey.Boards, boardSlug, CacheKey.Tasks],
    { tags: [boardSlug], revalidate: 60 * 60 }
  )();
};
