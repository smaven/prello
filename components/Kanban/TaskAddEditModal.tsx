'use client';

import { Button, Modal, ModalProps, Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Task, TaskPriority } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { TaskInStatusGroup, TaskStatus } from '@/lib/types';
import { dayjs } from '@/lib/dayjs';
import { useUpdateTask } from '@/hooks/api/use-update-task.hook';
import { useDeleteTask } from '@/hooks/api/use-delete-task.hook';
import { useCreateTask } from '@/hooks/api/use-create-task.hook';

export type EditTask = Omit<TaskInStatusGroup, 'dueDate' | 'createdAt' | 'updatedAt'> & {
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

interface TaskAddEditModalProps {
  editTask: EditTask | null;
  initialValues: Partial<Task> | null;
  opened: ModalProps['opened'];
  onClose: ModalProps['onClose'];
}

export default function TaskAddEditModal({
  editTask,
  opened,
  onClose,
  initialValues,
}: TaskAddEditModalProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: editTask ?? {
      title: '',
      description: '',
      priority: TaskPriority.LOW,
      status: TaskStatus.Todo,
      dueDate: dayjs().add(7, 'day').toDate(),
    },
    validate: {
      title: (value) => {
        if (!value) return 'Title is required';
        if (value.length < 2) return 'Title is too short';
        if (value.length > 120) return 'Title is too long';
      },
      description: (value) => {
        if (!value) return 'Description is required';
        if (value.length < 2) return 'Description is too short';
        if (value.length > 500) return 'Description is too long';
      },
      priority: (value: string) => {
        if (!value) return 'Priority is required';
        if (!Object.values(TaskPriority).includes(value as TaskPriority)) return 'Invalid priority';
      },
      status: (value: string) => {
        if (!value) return 'Status is required';
        if (!Object.values(TaskStatus).includes(value as TaskStatus)) return 'Invalid status';
      },
      dueDate: (value) => {
        if (!value) return 'Due date is required';
      },
    },
  });
  const { boardId } = useParams<{ boardId: string }>();
  const { mutate: createTask, loading: createLoading } = useCreateTask();
  const { mutate: deleteTask, loading: deleteLoading } = useDeleteTask();
  const { mutate: updateTask, loading: updateLoading } = useUpdateTask();

  const loading = createLoading || updateLoading;

  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues as Partial<EditTask>);
    } else if (editTask) {
      form.setValues(editTask);
    }
  }, [initialValues, editTask]);

  async function handleFormSubmit(values: Partial<EditTask>) {
    if (editTask) {
      await updateTask({ boardSlug: boardId, task: values as EditTask });
    } else {
      await createTask({ newTask: values as EditTask, boardSlug: boardId });
    }
    handleModalClose();
  }

  async function handleDeleteTask() {
    if (!editTask) return;
    await deleteTask({ taskId: editTask.id, boardSlug: boardId });
    handleModalClose();
  }

  function handleModalClose() {
    onClose();
    form.reset();
  }

  return (
    <Modal opened={opened} onClose={handleModalClose} title={editTask ? 'Edit task' : 'Add task'}>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Title"
            placeholder="My task"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Description"
            placeholder="Task description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <Select
            label="Priority"
            placeholder="Select priority"
            data={Object.values(TaskPriority).map((priority) => ({
              value: priority,
              label: priority.toLowerCase(),
            }))}
            allowDeselect={false}
            key={form.key('priority')}
            {...form.getInputProps('priority')}
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={Object.values(TaskStatus).map((status) => ({
              value: status,
              label: status,
            }))}
            allowDeselect={false}
            key={form.key('status')}
            {...form.getInputProps('status')}
          />
          <DateInput
            label="Due date"
            placeholder="Select due date"
            key={form.key('dueDate')}
            {...form.getInputProps('dueDate')}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {editTask ? (
            <Button
              color="red"
              onClick={handleDeleteTask}
              loading={deleteLoading}
              disabled={loading}
            >
              Delete
            </Button>
          ) : null}
          <Button type="submit" loading={loading} disabled={deleteLoading}>
            {editTask ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
