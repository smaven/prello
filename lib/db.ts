import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var prisma: PrismaClient<{ log: [{ emit: 'event'; level: 'query' }] }> | undefined;
}

const initPrisma = () => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });

  prisma.$on('query', (e) => {
    // eslint-disable-next-line no-console
    console.log(`Duration: ${e.duration}ms; Query: ${e.query}`);
  });

  return prisma;
};

const prisma = global.prisma || initPrisma();

// The reason we are doing this is because next.js has a hot-reloading feature
// that causes the prisma client to be instantiated multiple times, which is not
// good for performance. This is a way to make sure that the prisma client is
// only instantiated once.
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export { prisma };
