import { useMutation } from './use-mutation.hook';

export function useDeleteTask() {
  return useMutation(async ({ taskId, boardSlug }: { taskId: string; boardSlug: string }) => {
    const res = await fetch(`/api/board/${boardSlug}/task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete task');
    }

    const { data } = await res.json();
    return data;
  });
}
