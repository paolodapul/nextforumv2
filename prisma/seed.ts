import { Prisma, PrismaClient, Thread } from "@prisma/client";
import _ from "lodash";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  const createThreadReplies = async (thread: Thread) => {
    const createFakeReply = () => {
      return {
        body: faker.word.words(),
        lastUpdated: new Date().toISOString(),
        userId: thread.userId,
      };
    };

    await prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        replies: {
          createMany: {
            data: _.times(10, createFakeReply),
          },
        },
      },
    });
  };

  const createUser = async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    });

    const user = await prisma.user.create({
      data: {
        email: email,
        name: firstName,
      },
    });

    return user.id;
  };

  const createThread = async (userId: number) => {
    const createFakeData = () => {
      const title = faker.word.words();
      const body = faker.word.words();
      const lastUpdated = new Date().toISOString();
      return {
        title,
        body,
        lastUpdated,
      };
    };

    const { threads } = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        threads: {
          createMany: {
            data: _.times(10, createFakeData),
          },
        },
      },
      include: {
        threads: true,
      },
    });

    return threads;
  };

  const userIds = await Promise.all(_.times(10, createUser));
  const threads = await Promise.all(userIds.map(createThread));
  const flatThreads = threads.flatMap((thread) => thread);
  await Promise.all(flatThreads.map(createThreadReplies));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
