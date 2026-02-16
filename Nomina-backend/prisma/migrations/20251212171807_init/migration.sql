-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Culture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Culture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NomPersonnage" (
    "id" SERIAL NOT NULL,
    "valeur" TEXT,
    "genre" TEXT,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NomPersonnage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lieux" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lieux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FragmentsHistoire" (
    "id" SERIAL NOT NULL,
    "texte" TEXT NOT NULL,
    "appliesTo" TEXT,
    "genre" TEXT,
    "minNameLength" INTEGER,
    "maxNameLength" INTEGER,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FragmentsHistoire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Titre" (
    "id" SERIAL NOT NULL,
    "valeur" TEXT NOT NULL,
    "type" TEXT,
    "genre" TEXT,
    "cultureId" INTEGER,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Titre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" SERIAL NOT NULL,
    "valeur" TEXT NOT NULL,
    "type" TEXT,
    "mood" TEXT,
    "keywords" TEXT,
    "categorieId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "NomPersonnage" ADD CONSTRAINT "NomPersonnage_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NomPersonnage" ADD CONSTRAINT "NomPersonnage_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lieux" ADD CONSTRAINT "Lieux_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FragmentsHistoire" ADD CONSTRAINT "FragmentsHistoire_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FragmentsHistoire" ADD CONSTRAINT "FragmentsHistoire_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titre" ADD CONSTRAINT "Titre_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "Culture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Titre" ADD CONSTRAINT "Titre_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
