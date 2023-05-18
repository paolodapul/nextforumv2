import { Prisma, PrismaClient } from "@prisma/client";
import _ from "lodash";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  const createUserWithPostsAndReplies = async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    });

    // You cannot nest more than one level when using upsert()
    // Pattern is: create with nest -> create entities for the deepest nest
    //  -> update the deepest nest by connecting the created entities

    const { threads } = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        name: firstName,
        threads: {
          create: [
            {
              title: faker.lorem.sentence(),
              body: faker.lorem.paragraph(),
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
      },
      include: {
        threads: true,
      },
    });

    const { id: replyId } = await prisma.reply.create({
      data: {
        body: faker.lorem.paragraph(),
        lastUpdated: new Date().toISOString(),
        threadId: threads[0].id,
        userId: threads[0].userId,
      },
    });

    const result = await prisma.thread.update({
      where: {
        id: threads[0].id,
      },
      data: {
        replies: {
          connect: {
            id: replyId,
          },
        },
      },
    });
  };

  _.times(50, createUserWithPostsAndReplies);
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
