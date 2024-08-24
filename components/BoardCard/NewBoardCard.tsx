import { Card, Text } from '@mantine/core';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function NewBoardCard() {
  return (
    <Link href="/boards/new">
      <Card
        shadow="sm"
        withBorder
        radius="md"
        className="flex h-full min-h-24 justify-center hover:opacity-80"
      >
        <Text className="flex items-center gap-2">
          <IconSquareRoundedPlus size={28} />
          <span>Create new board</span>
        </Text>
      </Card>
    </Link>
  );
}
