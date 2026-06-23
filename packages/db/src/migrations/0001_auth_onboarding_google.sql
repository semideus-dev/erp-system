ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "first_name" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "last_name" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "last_login_method" text;
