import { Title } from '@mantine/core';
import BoardHeader from '@/components/BoardHeader/BoardHeader';
import Kanban from '@/components/Kanban/Kanban';
import { getBoard, getTasks } from '@/lib/loaders';

interface BoardPageProps {
  params: {
    boardId: string;
  };
  searchParams?: {
    query?: string;
    priority?: string;
    dueDate?: string;
  };
}

export default async function BoardPage({ params, searchParams = {} }: BoardPageProps) {
  const { boardId: boardSlug } = params;
  const { query, priority, dueDate } = searchParams;
  const [board, tasks] = await Promise.all([
    getBoard(boardSlug),
    getTasks({
      boardSlug,
      searchQuery: query,
      filter: { priority, dueDate },
    }),
  ]);

  return (
    <>
      <BoardHeader title={<Title className="text-2xl">{board.name}</Title>} />
      <section className="mt-10">
        <Kanban tasks={tasks} />
      </section>
    </>
  );
}
