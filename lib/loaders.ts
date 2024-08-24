import { Board, Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { prisma } from './db';

// TEMP
export const loggedInUserId = '25ea6d71-5a1d-4d00-9b94-b9037cee5460';

export enum CacheKey {
  Boards = 'boards',
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
    { tags: [CacheKey.Boards], revalidate: 60 }
  )();
};
