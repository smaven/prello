import { Task } from '@prisma/client';
import { useMutation } from './use-mutation.hook';

export type NewTaskRequest = Pick<
  Task,
  'title' | 'description' | 'priority' | 'dueDate' | 'status'
>;

export function useCreateTask() {
  return useMutation(
    async ({ newTask, boardSlug }: { newTask: NewTaskRequest; boardSlug: string }) => {
      const res = await fetch(`/api/board/${boardSlug}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      const { data } = await res.json();
      return data;
    }
  );
}
