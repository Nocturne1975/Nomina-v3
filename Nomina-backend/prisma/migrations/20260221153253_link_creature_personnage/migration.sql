-- AlterTable
ALTER TABLE "Creature" ADD COLUMN     "personnageId" INTEGER;

-- AddForeignKey
ALTER TABLE "Creature" ADD CONSTRAINT "Creature_personnageId_fkey" FOREIGN KEY ("personnageId") REFERENCES "Personnage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
