'use client';

import { Button, Card, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { deleteBoard } from '@/lib/actions';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

export default function BoardCard({ slug, title }: { slug: string; title: string }) {
  const [_, deleteAction] = useFormState(deleteBoard, { errors: {} });

  return (
    <Link href={`/boards/${slug}`}>
      <Card
        shadow="sm"
        withBorder
        radius="md"
        className="flex justify-center gap-4 hover:opacity-80"
      >
        <Text>{title}</Text>
        <form action={deleteAction}>
          <input type="hidden" name="slug" value={slug} />
          <DeleteButton title={title} />
        </form>
      </Card>
    </Link>
  );
}

function DeleteButton({ title }: { title: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pending } = useFormStatus();
  const [opened, { open, close }] = useDisclosure(false);

  function confirmDeleteHandler() {
    close();
    buttonRef.current?.form?.requestSubmit();
  }

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    open();
  }

  return (
    <>
      <Button
        ref={buttonRef}
        type="submit"
        size="compact-md"
        rightSection={<IconTrash className="h-5 w-5" />}
        color="red"
        w="100%"
        onClick={deleteHandler}
        loading={pending}
      >
        Delete
      </Button>

      <ConfirmModal
        opened={opened}
        onClose={close}
        content={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteHandler}
      />
    </>
  );
}
