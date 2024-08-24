import { Title } from '@mantine/core';
import BoardCard from '@/components/BoardCard/BoardCard';
import NewBoardCard from '@/components/BoardCard/NewBoardCard';

const mockBoards: { slug: string; title: string }[] = [
  { slug: 'board-1', title: 'Board 1' },
  { slug: 'board-2', title: 'Board 2' },
  { slug: 'board-3', title: 'Board 3' },
];

export default function BoardsList() {
  return (
    <div>
      <Title className="text-2xl">Current Boards</Title>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {mockBoards.map((board) => (
          <BoardCard key={board.slug} slug={board.slug} title={board.title} />
        ))}
        <NewBoardCard />
      </section>
    </div>
  );
}
