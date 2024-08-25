'use client';

import { Badge, Button } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { TaskStatus } from '@/lib/types';
import { colorByStatus } from './kanban.utils';

interface ContainerProps extends PropsWithChildren {
  status: TaskStatus;
  title: string;
  onAddItem?: (status: TaskStatus) => void;
}

export default function Container({ status, title, children, onAddItem }: ContainerProps) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-100 px-4 pb-8 dark:bg-dark-400">
      <div className="pb-6 pt-4">
        <Badge color={colorByStatus.get(status)} radius="xs">
          {title}
        </Badge>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      <Button
        variant="light"
        color={colorByStatus.get(status)}
        className="mt-4"
        onClick={() => onAddItem?.(status)}
        leftSection={<IconSquareRoundedPlus size={20} />}
      >
        Add Item
      </Button>
    </div>
  );
}
