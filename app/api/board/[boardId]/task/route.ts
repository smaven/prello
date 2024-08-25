import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/db';
import { NewTaskRequest } from '@/hooks/api/use-create-task.hook';

export const POST = async (request: NextRequest, { params }: { params: { boardId: string } }) => {
  const { boardId: boardSlug } = params;
  const task: NewTaskRequest = await request.json();

  const newTask = await prisma.task.create({
    data: {
      ...task,
      board: { connect: { slug: boardSlug } },
    },
  });

  revalidateTag(boardSlug);

  return NextResponse.json({ data: newTask });
};
