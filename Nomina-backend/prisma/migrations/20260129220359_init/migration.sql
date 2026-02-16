/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Culture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `UniversThematique` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NomPersonnage" ADD COLUMN     "nomFamilleId" INTEGER;

-- AlterTable
ALTER TABLE "UniversThematique" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "NomFamille" (
    "id" SERIAL NOT NULL,
    "valeur" TEXT,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NomFamille_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NomFamille_valeur_key" ON "NomFamille"("valeur");

-- CreateIndex
CREATE UNIQUE INDEX "Culture_name_key" ON "Culture"("name");

-- AddForeignKey
ALTER TABLE "NomFamille" ADD CONSTRAINT "NomFamille_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NomFamille" ADD CONSTRAINT "NomFamille_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NomPersonnage" ADD CONSTRAINT "NomPersonnage_nomFamilleId_fkey" FOREIGN KEY ("nomFamilleId") REFERENCES "NomFamille"("id") ON DELETE SET NULL ON UPDATE CASCADE;
