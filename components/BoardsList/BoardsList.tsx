import { Title } from '@mantine/core';
import BoardCard from '@/components/BoardCard/BoardCard';
import NewBoardCard from '@/components/BoardCard/NewBoardCard';
import { getBoards } from '@/lib/loaders';

export default async function BoardsList() {
  const boards = await getBoards();
  return (
    <div>
      <Title className="text-2xl">Current Boards</Title>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {boards.map((board) => (
          <BoardCard key={board.slug} {...board} />
        ))}
        <NewBoardCard />
      </section>
    </div>
  );
}
