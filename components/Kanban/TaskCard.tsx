'use client';

import { Badge, Text } from '@mantine/core';
import { IconCalendarEvent, IconGripVertical, IconHourglass } from '@tabler/icons-react';
import { useRef } from 'react';
import { dayjs } from '@/lib/dayjs';
import { TaskInStatusGroup } from '@/lib/types';
import { cn } from '@/lib/utils';
import { colorByPriority } from './kanban.utils';

interface TaskProps {
  task: TaskInStatusGroup;
  onTaskClick?: (task: TaskInStatusGroup) => void;
}

export default function TaskCard({ task, onTaskClick }: TaskProps) {
  const grabHandleRef = useRef<HTMLDivElement>(null);

  function handleTaskCardClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Ignore if the click was on the grab handle
    if (grabHandleRef.current?.contains(e.target as Node)) {
      return;
    }
    onTaskClick?.(task);
  }

  return (
    <button
      type="button"
      className="dark:bg-dark-700 flex items-center rounded-md bg-white py-4 pl-4"
      onClick={handleTaskCardClick}
    >
      <div className="flex grow flex-col text-start">
        <Badge size="sm" color={colorByPriority.get(task.priority)}>
          {task.priority}
        </Badge>
        <Text className="mt-2 text-sm">{task.title}</Text>
        <Text c="dimmed" className="mt-2 text-xs" lineClamp={2}>
          {task.description}
        </Text>
        <TaskDueDate dueDate={task.dueDate} className="mt-4" />
        <TaskCreatedAt createdAt={task.createdAt} className="mt-2" />
      </div>
      <div ref={grabHandleRef} className="cursor-grab px-2 py-4 opacity-60 hover:opacity-100">
        <IconGripVertical size={20} />
      </div>
    </button>
  );
}

function TaskDueDate({ dueDate, className }: { dueDate: string; className: string }) {
  const isOverdue = dayjs(dueDate).isBefore(dayjs(), 'day');
  const isDueToday = dayjs(dueDate).isSame(dayjs(), 'day');
  return (
    <span
      className={cn(
        'flex items-center gap-2',
        isOverdue ? 'text-red-500 dark:text-red-400' : 'dark:text-dark-200 text-gray-700',
        className
      )}
    >
      <IconHourglass size={16} />
      <Text className="text-xs">Due {isDueToday ? 'today' : dayjs(dueDate).fromNow()}</Text>
    </span>
  );
}

function TaskCreatedAt({ createdAt, className }: { createdAt: string; className: string }) {
  return (
    <span className={cn('flex items-center gap-2', 'dark:text-dark-200 text-gray-700', className)}>
      <IconCalendarEvent size={16} />
      <Text className="text-xs">{dayjs(createdAt).format('MMM D YYYY, h:mm A')}</Text>
    </span>
  );
}
