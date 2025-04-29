import { PrismaClient, Role, TaskStatus } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const plainPassword = 'admin123';

const randHex = (n = 3) =>
  [...crypto.getRandomValues(new Uint8Array(n))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

async function uniqueEmail(base: string) {
  let email: string;
  do {
    email = `${base}.${randHex()}@example.com`.toLowerCase();
  } while (await prisma.user.findUnique({ where: { email } }));
  return email;
}

const usersSeed = [
  { fullName: 'Admin Master', role: Role.ADMIN,  base: 'admin'  },
  { fullName: 'Alice Johnson', role: Role.USER, base: 'alice'  },
  { fullName: 'Bob Smith',     role: Role.USER, base: 'bob'    },
  { fullName: 'Charlie King',  role: Role.USER, base: 'charlie'},
  { fullName: 'Diana Prince',  role: Role.USER, base: 'diana'  },
];

const taskTitles = [
  'Setup backend', 'Design frontend UI', 'Configure CI/CD',
  'Write unit tests', 'Prepare documentation', 'Deploy to staging',
];

const statuses: TaskStatus[] = [
  TaskStatus.UNASSIGNED,
  TaskStatus.ASSIGNED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.PENDING_REVIEW,
  TaskStatus.COMPLETED,
];

const rnd = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('🚀 Seeding…');
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  const users = [];
  for (const u of usersSeed) {
    users.push(
      await prisma.user.create({
        data: {
          fullName: u.fullName,
          role: u.role,
          email: await uniqueEmail(u.base),
          password: hashed,
        },
      })
    );
  }

  for (const owner of users) {
    const project = await prisma.project.create({
      data: {
        name: `Project of ${owner.fullName.split(' ')[0]}`,
        createdBy: { connect: { id: owner.id } },
      },
    });

    for (let i = 0; i < 3; i++) {
      const status = rnd(statuses);
      const progress =
        status === TaskStatus.COMPLETED     ? 100 :
          status === TaskStatus.IN_PROGRESS   ? 50  : 0;

      const task = await prisma.task.create({
        data: {
          name: rnd(taskTitles),
          status,
          progress,
          project: { connect: { id: project.id } },
        },
      });

      await prisma.taskAssignment.create({
        data: {
          task: { connect: { id: task.id } },
          user: { connect: { id: rnd(users).id } },
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
