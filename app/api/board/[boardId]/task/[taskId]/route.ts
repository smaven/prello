import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type PathParams = {
  boardId: string;
  taskId: string;
};

export const DELETE = async (request: NextRequest, { params }: { params: PathParams }) => {
  const { boardId: boardSlug, taskId } = params;

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidateTag(boardSlug);

  return NextResponse.json({ data: taskId });
};

export const PATCH = async (request: NextRequest, { params }: { params: PathParams }) => {
  const { boardId: boardSlug, taskId } = params;
  const task = await request.json();

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!existingTask) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: task,
  });

  revalidateTag(boardSlug);

  return NextResponse.json({ data: updatedTask });
};
