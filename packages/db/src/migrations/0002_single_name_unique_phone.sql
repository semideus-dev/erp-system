ALTER TABLE "user" DROP COLUMN IF EXISTS "first_name";
ALTER TABLE "user" DROP COLUMN IF EXISTS "last_name";
CREATE UNIQUE INDEX IF NOT EXISTS "user_phone_number_unique" ON "user" ("phone_number");
