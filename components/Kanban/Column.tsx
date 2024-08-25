'use client';

import { Badge, Button } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useDroppable } from '@dnd-kit/core';
import { TaskStatus } from '@/lib/types';
import { colorByStatus } from './kanban.utils';
import { cn } from '@/lib/utils';

interface ContainerProps extends PropsWithChildren {
  status: TaskStatus;
  title: string;
  onAddItem?: (status: TaskStatus) => void;
}

export default function Container({ status, title, children, onAddItem }: ContainerProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg border-2 border-transparent bg-gray-100 px-4 pb-8 dark:bg-surface-400',
        isOver && colorByStatus.get(status)?.twClass
      )}
    >
      <div className="pb-6 pt-4">
        <Badge color={colorByStatus.get(status)?.color} radius="xs">
          {title}
        </Badge>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      <Button
        variant="light"
        color={colorByStatus.get(status)?.color}
        className="mt-4"
        onClick={() => onAddItem?.(status)}
        leftSection={<IconSquareRoundedPlus size={20} />}
      >
        Add Item
      </Button>
    </div>
  );
}
