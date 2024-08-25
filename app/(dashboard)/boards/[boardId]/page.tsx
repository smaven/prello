import { Title } from '@mantine/core';
import { getBoard, getTasks } from '@/lib/loaders';
import Kanban from '@/components/Kanban/Kanban';

export default async function BoardPage({ params }: { params: { boardId: string } }) {
  const { boardId } = params;
  const [board, tasks] = await Promise.all([getBoard(boardId), getTasks(boardId)]);

  return (
    <div>
      <Title className="text-2xl">{board.name}</Title>
      <section className="mt-10">
        <Kanban tasks={tasks} />
      </section>
    </div>
  );
}
