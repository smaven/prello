import { Board, Prisma, TaskPriority } from '@prisma/client';
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

export const getTasks = ({
  boardSlug,
  searchQuery,
  filter,
}: {
  boardSlug: string;
  searchQuery?: string;
  filter?: { dueDate?: string; priority?: string };
}) => {
  const userId = loggedInUserId;
  return unstable_cache(
    async () => {
      const board = await prisma.board.findUniqueOrThrow({ where: { slug: boardSlug } });
      if (board.userId !== userId) {
        throw new Error('Board not found');
      }

      // Build the WHERE clause for the SQL query
      const whereConditions: Prisma.Sql[] = [Prisma.sql`"boardSlug" = ${boardSlug}`];
      if (searchQuery) {
        whereConditions.push(
          Prisma.sql`("title" LIKE ${`%${searchQuery}%`} OR "description" ILIKE ${`%${searchQuery}%`})`
        );
      }
      if (filter?.dueDate) {
        whereConditions.push(Prisma.sql`"dueDate"::date = ${filter.dueDate}::date`);
      }
      if (filter?.priority) {
        if (!Object.values(TaskPriority).includes(filter.priority as TaskPriority)) {
          throw new Error('Invalid priority');
        }
        whereConditions.push(Prisma.sql`"priority" = ${filter.priority}::"TaskPriority"`);
      }
      const whereClause = Prisma.join(whereConditions, ' AND ');

      const tasksByStatus = await prisma.$queryRaw<TaskByStatus[]>`
        SELECT status
            , COUNT(*)::integer AS "taskCount"
            , JSON_AGG(
                JSON_BUILD_OBJECT(
                        'id', id,
                        'title', title,
                        'description', description,
                        'priority', priority,
                        'status', status,
                        'dueDate', "dueDate",
                        'createdAt', "createdAt",
                        'updatedAt', "updatedAt"
                ) ORDER BY "createdAt"
              )                 AS tasks
        FROM "Task"
        WHERE ${whereClause}
        GROUP BY "status"
        ORDER BY "status";
      `;

      // Order the statuses in the order they are defined in TaskStatus
      const statusArr = Object.values(TaskStatus);
      const sortedStatuses = statusArr.map(
        (status) =>
          tasksByStatus.find((group) => group.status === status) ?? {
            status,
            taskCount: 0,
            tasks: [],
          }
      ) as TaskByStatus[];

      return sortedStatuses;
    },
    [
      userId,
      CacheKey.Boards,
      boardSlug,
      CacheKey.Tasks,
      searchQuery ?? '',
      filter ? JSON.stringify(filter) : '',
    ],
    { tags: [boardSlug], revalidate: 60 }
  )();
};
