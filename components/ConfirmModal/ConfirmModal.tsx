'use client';

import { Button, Modal, ModalProps, Text } from '@mantine/core';
import React from 'react';

export type ConfirmModalProps = Pick<ModalProps, 'opened' | 'onClose'> & {
  content: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
};

export default function ConfirmModal({
  opened,
  onClose,
  content,
  onConfirm,
  confirmLabel,
}: ConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Are you sure?"
      onClick={(e) => e.stopPropagation()}
    >
      <Text c="dimmed">{content}</Text>

      <div className="mt-6 flex justify-end">
        <Button color="red" onClick={onConfirm}>
          {confirmLabel || 'Confirm'}
        </Button>
      </div>
    </Modal>
  );
}
