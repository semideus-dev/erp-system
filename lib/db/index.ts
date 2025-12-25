import { drizzle } from "drizzle-orm/node-postgres";

import env from "@/lib/env";
import * as schema from "@/lib/db/schema";

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const db = drizzle(env.databaseUrl, {
  schema,
});


export default db;
