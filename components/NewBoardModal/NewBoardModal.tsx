'use client';

import { Button, Modal, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { createBoard } from '@/lib/actions';

export default function NewBoardModal() {
  const router = useRouter();
  const [createState, createAction] = useFormState(createBoard, null);

  function closeHandler() {
    router.back();
  }

  return (
    <Modal opened onClose={closeHandler} title="Create new board">
      <form action={createAction}>
        <div className="flex flex-col gap-4">
          <TextInput
            name="name"
            label="Name"
            placeholder="My Daily Board"
            error={createState?.errors?.name}
          />
          <TextInput
            name="slug"
            label="Slug"
            placeholder="my-daily-board"
            error={createState?.errors?.slug}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <CreateButton />
        </div>
      </form>
    </Modal>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={pending}>
      Create
    </Button>
  );
}
