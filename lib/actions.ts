'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from './db';
import { CacheKey, loggedInUserId } from './loaders';

const createBoardSchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character long' }),
  slug: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers and dashes',
  }),
});

export async function createBoard(prevState: any, formData: FormData) {
  const validatedFields = createBoardSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, slug } = validatedFields.data;

  const existingBoard = await prisma.board.findFirst({
    where: { slug },
  });
  if (existingBoard) {
    return {
      errors: { slug: 'Slug already exists', name: undefined },
    };
  }

  await prisma.board.create({
    data: {
      name,
      slug,
      user: { connect: { id: loggedInUserId } },
    },
  });

  revalidateTag(CacheKey.Boards);
  redirect('/boards');
}

const deleteBoardSchema = z.object({
  slug: z.string().min(1),
});

export async function deleteBoard(prevState: any, formData: FormData) {
  const validatedFields = deleteBoardSchema.safeParse({
    slug: formData.get('slug'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { slug } = validatedFields.data;

  await prisma.board.delete({
    where: { slug },
  });

  revalidateTag(CacheKey.Boards);
  revalidateTag(slug);
  return { errors: {} };
}
