import prisma from '../utils/prisma';
import { importConcepts } from './import-concepts';
import { importTitres } from './import-titres';
import { importFragmentsHistoire } from './import-fragments-histoire';
import { seedPersonnages } from './seed-personnages';

async function main() {
  console.log("=== Nomina seed ===");
  await importConcepts({ apply: true });
  await importTitres({ apply: true });
  await importFragmentsHistoire({ apply: true });
  await seedPersonnages({ count: 20 });
  console.log("=== Seed terminé ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
