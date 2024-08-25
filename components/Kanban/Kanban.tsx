'use client';

import { useDisclosure } from '@mantine/hooks';
import { Task } from '@prisma/client';
import { useState } from 'react';
import { TaskByStatus, TaskInStatusGroup, TaskStatus } from '@/lib/types';
import Container from './Column';
import TaskAddEditModal, { EditTask } from './TaskAddEditModal';
import TaskCard from './TaskCard';

export interface KanbanProps {
  tasks: TaskByStatus[];
}

export default function Kanban({ tasks: taskStatuses }: KanbanProps) {
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {taskStatuses.map((status) => (
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
      <TaskAddEditModal
        opened={modalOpened}
        onClose={handleModalClose}
        editTask={editTask}
        initialValues={taskInitialValues}
      />
    </>
  );
}
