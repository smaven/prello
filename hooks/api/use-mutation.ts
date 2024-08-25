import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface UseMutationOptions {
  skipRefresh?: boolean;
}

export function useMutation<T, U>(
  mutateFn: (data: T) => Promise<U>,
  options: UseMutationOptions = {}
) {
  const { skipRefresh = false } = options;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function mutate(data: T) {
    try {
      setLoading(true);
      setError(null);
      await mutateFn(data);

      if (!skipRefresh) router.refresh();
    } catch (e: unknown) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { mutate, loading, error };
}
