# Repository Instructions

## Commands

- Use Bun only: root `packageManager` is `bun@1.2.18`, lockfile is `bun.lock`.
- Install with `bun install`; `bun run dev` starts app dev servers plus Drizzle Studio, but not Docker/Postgres.
- Focus dev servers with `bun run dev:web`, `bun run dev:server`, or `bun run dev:native`.
- Build all packages with `bun run build`; typecheck with `bun run check-types`.
- Lint/format through Ultracite: `bun run check` and `bun run fix`.
- There is no configured test runner or `test` script; do not invent `bun test` as a repo verification step.

## Monorepo Shape

- Apps live in `apps/*`: `web` is Next.js on port 3001, `server` is Elysia/Bun on port 3000, `native` is Expo Router.
- Packages live in `packages/*`: `@erp-system/db`, `@erp-system/auth`, `@erp-system/env`, `@erp-system/ui`, and shared TS config in `@erp-system/config`.
- Turbo filters use package names from manifests, for example `turbo -F web dev`, `turbo -F server dev`, and `turbo -F @erp-system/db db:push`.
- Workspace exports point directly at TypeScript source files; avoid assuming built package artifacts exist except `apps/server/dist` after `bun run build`.

## Database And Env

- Drizzle config is in `packages/db/drizzle.config.ts` and loads env from `../../apps/server/.env`, not a root `.env`.
- Server env schema requires `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, and optional `NODE_ENV` in `packages/env/src/server.ts`.
- Web env uses `NEXT_PUBLIC_SERVER_URL`; native env uses `EXPO_PUBLIC_SERVER_URL`.
- Local Postgres is defined by `packages/db/docker-compose.yml`; root shortcuts are `bun run db:start`, `db:stop`, `db:down`, `db:push`, `db:generate`, `db:migrate`, and `db:studio`.
- Schema entrypoint is `packages/db/src/schema/index.ts`; add new schema exports there so `createDb()` includes them.

## Entrypoints And Integration

- Server entrypoint is `apps/server/src/index.ts`; it wires CORS from `env.CORS_ORIGIN`, Better Auth at `/api/auth/*`, and `GET /` health check.
- Auth lives in `packages/auth/src/index.ts`; it uses Better Auth with Drizzle and trusted origins for web plus Expo deep links in development.
- Web imports env validation in `apps/web/next.config.ts`; Next has `typedRoutes` and `reactCompiler` enabled.
- Native uses Expo Router via `apps/native/app/*`; `app.json` enables typed routes and React Compiler.
- Native Metro config wraps Expo Metro with Reanimated and Uniwind; Uniwind CSS entry is `apps/native/global.css`.

## UI And Styling

- Shared web UI primitives live in `packages/ui/src/components` and are imported as `@erp-system/ui/components/...`.
- Shared design tokens/global CSS live in `packages/ui/src/styles/globals.css`; app-specific shadcn config is split between `packages/ui/components.json` and `apps/web/components.json`.
- To add shared shadcn primitives, run from the repo root with `-c packages/ui`; add app-only blocks from `apps/web`.

## Code Standards

- Biome extends `ultracite/biome/core`, `ultracite/biome/next`, and `ultracite/biome/react`; prefer `bun run fix` before final verification.
- Shared TS config is strict with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and Bun types.
- React Compiler is enabled for web and native; do not add `useMemo`/`useCallback` only for routine render optimization unless existing code or a measured issue requires it.

# AI Context Sources

Reference documentation is stored in `/ai-context`.

Important files:
- better-auth.md: Better Auth integration details, including custom Drizzle adapter and session handling.
- nextjs.md: Next.js-specific patterns and configurations, including typed routes and React Compiler usage.

Always consult better-auth.md when working with:
- Better Auth
- authentication flows
- adapters/plugins
- session handling
- API usage

