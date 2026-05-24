import fs from "node:fs";
import { Client } from "pg";

const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("SUPABASE_DB_URL or DATABASE_URL is required.");
  process.exit(1);
}

const sql = fs.readFileSync("docs/supabase-schema.sql", "utf8");
const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);

  const result = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_type = 'BASE TABLE'
    order by table_name
  `);

  console.log("Tabelas criadas/verificadas:");
  console.log(result.rows.map((row) => row.table_name).join(", "));
} finally {
  await client.end();
}
