-- CreateTable
CREATE TABLE "Creature" (
    "id" SERIAL NOT NULL,
    "valeur" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Creature" ADD CONSTRAINT "Creature_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creature" ADD CONSTRAINT "Creature_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
