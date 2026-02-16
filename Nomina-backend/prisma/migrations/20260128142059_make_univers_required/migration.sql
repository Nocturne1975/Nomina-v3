/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UniversThematique` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `UniversThematique` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UniversThematique` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `UniversThematique` will be added. If there are existing duplicate values, this will fail.
  - Made the column `universId` on table `Categorie` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Categorie" DROP CONSTRAINT "Categorie_universId_fkey";

-- AlterTable
ALTER TABLE "Categorie" ALTER COLUMN "universId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UniversThematique" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "UniversThematique_name_key" ON "UniversThematique"("name");

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_universId_fkey" FOREIGN KEY ("universId") REFERENCES "UniversThematique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
