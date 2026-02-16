-- AlterTable
ALTER TABLE "Categorie" ADD COLUMN     "universId" INTEGER;

-- CreateTable
CREATE TABLE "UniversThematique" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversThematique_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_universId_fkey" FOREIGN KEY ("universId") REFERENCES "UniversThematique"("id") ON DELETE SET NULL ON UPDATE CASCADE;
