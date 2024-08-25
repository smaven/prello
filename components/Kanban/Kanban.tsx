import { Code } from '@mantine/core';
import { TaskByStatus } from '@/lib/types';

export interface KanbanProps {
  tasks: TaskByStatus[];
}

export default function Kanban({ tasks }: KanbanProps) {
  return <Code block>{JSON.stringify(tasks, null, 2)}</Code>;
}
