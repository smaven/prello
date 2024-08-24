'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { wait } from './utils';

const createBoardSchema = z.object({
  name: z.string(),
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

  await wait(1000);
  console.log('Create board', name, slug);

  // TODO: revalidate boards

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

  await wait(1000);
  console.log('Delete board', slug);

  // TODO: revalidate boards

  return { errors: {} };
}
