<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Open Daycare

Spanish-language daycare (guardería) app: staff feed with children management, plus a parent view. The app is still the `create-next-app` starter — `app/page.tsx` is boilerplate; real screens must be built.

## Commands

- `npm run dev` (Turbopack), `npm run build`, `npm run start`
- `npm run lint` — flat ESLint config (`eslint` with no args)
- No test runner or typecheck script exists. Verify types with `npx tsc --noEmit`; do not invent a test command.

## Next.js 16 specifics

- Only the App Router exists here. Consult `node_modules/next/dist/docs/` before writing routing, data-fetching, or caching code.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback`. With `cacheComponents`, dynamic data must follow `use cache` / `<Suspense>` rules — read `docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`.
- Tailwind 4 is wired through the Turbopack CSS rule `@tailwindcss/turbopack`, not PostCSS. Do not add a `postcss.config`.
- Route prop types are generated globals (`LayoutProps<"/">`, `PageProps<...>`) living in `.next/types`; they are used without imports. Don't hand-write param types, and generate types (`next dev`/`next build`) before relying on `tsc`.
- `next-env.d.ts` and the block above are generated; don't edit or delete them.

## Layout

- `app/` — App Router entry (`layout.tsx`, `page.tsx`, `globals.css`). `@/*` maps to the repo root.
- `references/pantallas/*.dc.html` — canonical UI mockups: self-contained static HTML (with `support.js`) using Fredoka/Nunito and a warm cream palette. `references/screenshots/` shows the expected rendering. Port these screens to React + Tailwind; never import or ship the `.dc.html` files.
- UI copy and domain terms are Spanish (`niño`, `publicación`, "GESTIÓN"), some with accents lost in the mockup encoding. Keep user-facing strings in Spanish.
- `.agents/skills/spec` (pinned in `skills-lock.json`) provides the `/spec` workflow; specs belong in `specs/` (not created yet).

## MCP

- Playwright MCP is configured in `opencode.json`; keep screenshots and browser artifacts in `.playwright-mcp/` (gitignored).
- Use Context7 MCP for up-to-date framework/library documentation.

## Spec Driven Development

- /spec Usaremos esta habilidad para crear las especificaciones
- /spec-impl Usaremos esta habilidad para crear las implementaciones

## Reglas de codigo

- Usar codigo limpio, nombres y variables en ingles
