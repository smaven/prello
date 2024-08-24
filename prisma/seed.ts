import { faker } from '@faker-js/faker';
import { Board, Prisma, PrismaClient, TaskPriority } from '@prisma/client';
import { TaskStatus } from '../lib/types';

const prisma = new PrismaClient();

export const johnDoeId = '25ea6d71-5a1d-4d00-9b94-b9037cee5460';

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌿 Seeding user');
  await prisma.user.upsert({
    create: {
      id: johnDoeId,
      email: 'john.doe@example.com',
    },
    update: {},
    where: {
      id: johnDoeId,
    },
  });

  // eslint-disable-next-line no-console
  console.log('🌿 Seeding boards');
  const [dailyChores, projectAlpha] = await Promise.all([
    prisma.board.upsert({
      create: {
        name: 'Daily Chores',
        slug: 'daily-chores',
        userId: johnDoeId,
        ...getCreatedAndUpdatedDates(),
      },
      update: {},
      where: { slug: 'daily-chores' },
    }),
    prisma.board.upsert({
      create: {
        name: 'Project Alpha',
        slug: 'project-alpha',
        userId: johnDoeId,
        ...getCreatedAndUpdatedDates(),
      },
      update: {},
      where: { slug: 'project-alpha' },
    }),
  ]);

  // eslint-disable-next-line no-console
  console.log('🌿 Seeding tasks');
  await Promise.all([seedTasks(dailyChores), seedTasks(projectAlpha)]);
}

async function seedTasks(board: Board) {
  const numberOfTasks = faker.number.int({ min: 8, max: 11 });

  const tasks: Prisma.TaskCreateManyInput[] = Array.from({ length: numberOfTasks }, () => ({
    boardSlug: board.slug,
    title: faker.lorem.words(faker.number.int({ min: 1, max: 5 })),
    description: faker.lorem.sentence({ min: 3, max: 15 }),
    status: faker.helpers.arrayElement([
      TaskStatus.Todo,
      TaskStatus.InProgress,
      TaskStatus.Review,
      TaskStatus.Done,
    ]),
    priority: faker.helpers.arrayElement([
      TaskPriority.LOW,
      TaskPriority.MEDIUM,
      TaskPriority.HIGH,
    ]),
    dueDate: faker.helpers.weightedArrayElement([
      {
        weight: 5,
        value: faker.date.soon({ days: 30 }),
      },
      {
        weight: 2,
        value: faker.date.recent({ days: 7 }),
      },
    ]),
    ...getCreatedAndUpdatedDates(),
  }));

  await prisma.task.createMany({ data: tasks });
}

function getCreatedAndUpdatedDates() {
  const createdAt = faker.date.recent({ days: 7 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return {
    createdAt,
    updatedAt,
  };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
