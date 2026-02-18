-- CreateTable
CREATE TABLE "Personnage" (
    "id" SERIAL NOT NULL,
    "prenomId" INTEGER NOT NULL,
    "nomFamilleId" INTEGER,
    "titreId" INTEGER,
    "genre" TEXT,
    "biographie" TEXT,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personnage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_prenomId_fkey" FOREIGN KEY ("prenomId") REFERENCES "NomPersonnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_nomFamilleId_fkey" FOREIGN KEY ("nomFamilleId") REFERENCES "NomFamille"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_titreId_fkey" FOREIGN KEY ("titreId") REFERENCES "Titre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
