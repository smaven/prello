import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useMutation<T, U>(mutateFn: (data: T) => Promise<U>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function mutate(data: T) {
    try {
      setLoading(true);
      setError(null);
      await mutateFn(data);
      router.refresh();
    } catch (e: unknown) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }

  return { mutate, loading, error };
}
