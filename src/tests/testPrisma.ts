import { prisma } from '@/config/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .then(() => {
    console.log('Prisma підключено ✅');
  })
  .catch((e) => {
    console.error('Помилка підключення до Prisma ❌', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
