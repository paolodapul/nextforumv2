import { Thread } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const threads = await prisma.thread.findMany();
  return threads;
}

async function getThreads() {
  const results: Thread[] = await main();
  await prisma.$disconnect();
  return results;
}

export default async function Threads() {
  const threads: Thread[] = await getThreads();

  return (
    <div>
      <h1>Threads</h1>
      {threads.map((thread) => (
        <h2>{thread.title}</h2>
      ))}
    </div>
  );
}
