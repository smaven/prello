'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useDisclosure } from '@mantine/hooks';
import { Task } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { TaskByStatus, TaskInStatusGroup, TaskStatus } from '@/lib/types';
import Container from './Column';
import TaskAddEditModal, { EditTask } from './TaskAddEditModal';
import TaskCard from './TaskCard';
import { useTasks } from './use-tasks.hook';

export interface KanbanProps {
  tasks: TaskByStatus[];
}

export default function Kanban({ tasks }: KanbanProps) {
  const { boardId: boardSlug } = useParams<{ boardId: string }>();
  const { taskState, moveTask } = useTasks(tasks);
  const [editTask, setEditTask] = useState<EditTask | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [taskInitialValues, setTaskInitialValues] = useState<Partial<Task> | null>(null);

  function handleModalClose() {
    setTaskInitialValues(null);
    setEditTask(null);
    closeModal();
  }

  function handleAddTask(status: TaskStatus) {
    setTaskInitialValues({ status });
    openModal();
  }

  function handleTaskClick(task: TaskInStatusGroup) {
    setEditTask({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    });
    openModal();
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!active || !over) return;

    const taskId = active.id as string;
    const fromStatus = (active.data.current as { status: TaskStatus } | undefined)?.status;
    const toStatus = over.id as TaskStatus | undefined;
    if (!fromStatus || !toStatus) return;

    await moveTask({ taskId, fromStatus, toStatus, boardSlug });
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {taskState.taskGroups.map((status) => (
            <Container
              key={status.status}
              status={status.status}
              title={status.status}
              onAddItem={handleAddTask}
            >
              {status.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onTaskClick={handleTaskClick} />
              ))}
            </Container>
          ))}
        </div>
      </DndContext>
      <TaskAddEditModal
        opened={modalOpened}
        onClose={handleModalClose}
        editTask={editTask}
        initialValues={taskInitialValues}
      />
    </>
  );
}
