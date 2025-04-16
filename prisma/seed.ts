import { PrismaClient, TaskStatus, Role } from '@/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding...');

  const alice = await prisma.user.create({
    data: {
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      role: Role.USER,
    },
  });

  const bob = await prisma.user.create({
    data: {
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      role: Role.USER,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Planner Alpha',
      createdBy: {
        connect: { id: alice.id }
      }
    },
  });

  const task1 = await prisma.task.create({
    data: {
      name: 'Setup backend',
      status: TaskStatus.IN_PROGRESS,
      project: { connect: { id: project.id } },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      name: 'Design frontend UI',
      status: TaskStatus.UNASSIGNED,
      project: { connect: { id: project.id } },
    },
  });

  await prisma.taskAssignment.create({
    data: {
      user: { connect: { id: alice.id } },
      task: { connect: { id: task1.id } },
    },
  });

  await prisma.taskAssignment.create({
    data: {
      user: { connect: { id: bob.id } },
      task: { connect: { id: task2.id } },
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
