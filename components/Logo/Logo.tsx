import { Text } from '@mantine/core';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Text
      inherit
      variant="gradient"
      component="span"
      gradient={{ from: 'pink', to: 'yellow' }}
      className={cn('font-display text-2xl font-bold md:text-3xl', className)}
    >
      Prello
    </Text>
  );
}
