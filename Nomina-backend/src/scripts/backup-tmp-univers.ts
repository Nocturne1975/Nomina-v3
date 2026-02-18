import fs from "fs";
import path from "path";
import prisma from "../utils/prisma";

async function main() {
  const check = await prisma.$queryRawUnsafe<Array<{ exists: string | null }>>(
    "SELECT to_regclass('public.tmp_univers_json')::text AS exists"
  );

  const exists = check?.[0]?.exists === "tmp_univers_json";
  if (!exists) {
    console.log("tmp_univers_json absente, rien a sauvegarder");
    return;
  }

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT * FROM "tmp_univers_json"'
  );

  const out = {
    exportedAt: new Date().toISOString(),
    table: "tmp_univers_json",
    rowCount: rows.length,
    rows,
  };

  const filePath = path.join("prisma", "backups", `tmp_univers_json_backup_${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2), "utf8");
  console.log(`Backup créé: ${filePath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
