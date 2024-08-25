import { NewTaskRequest } from './use-create-task';
import { useMutation } from './use-mutation';

export type UpdateTaskRequest = Partial<NewTaskRequest> & { id: string };

export function useUpdateTask() {
  return useMutation(
    async ({ task, boardSlug }: { task: UpdateTaskRequest; boardSlug: string }) => {
      const res = await fetch(`/api/board/${boardSlug}/task/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      const { data } = await res.json();
      return data;
    }
  );
}
