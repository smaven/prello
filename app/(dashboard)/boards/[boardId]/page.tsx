import { getTasks } from '@/lib/loaders';

export default async function BoardPage({ params }: { params: { boardId: string } }) {
  const { boardId } = params;
  const tasks = await getTasks(boardId);
  console.log(tasks);

  return <h1>Board</h1>;
}
