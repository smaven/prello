'use client';

import { Skeleton } from '@mantine/core';

export default function Loading() {
  return (
    <div>
      <Skeleton h={32} w={240} />
      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={300} />
        ))}
      </section>
    </div>
  );
}
