import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../generated/prisma/client'
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
 
// Créer le client Prisma avec l'adaptateur Neon
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});
 
 
export default prisma