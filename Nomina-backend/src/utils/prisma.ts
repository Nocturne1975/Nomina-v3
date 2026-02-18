import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../generated/prisma/client'
import dotenv from "dotenv";

// Charge d'abord Nomina-backend/.env (si présent), puis tente la racine du repo en fallback.
dotenv.config();
dotenv.config({ path: "../.env" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
 
// Créer le client Prisma avec l'adaptateur Neon
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});
 
 
export default prisma