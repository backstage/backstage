# Intent Brief — feature-new — Entity former names and rename redirects

## Context

A catalog entity's URL is built from its kind, namespace and name. Renaming an entity, or moving it to another namespace, breaks every bookmark, wiki link and chat message that pointed at it. Users then see "Entity not found". Plugins that use the entity name in their own URLs, such as TechDocs, break the same way. This has been requested since 2021 (backstage/backstage#5231).

Before: opening an old link such as `/catalog/default/component/old-name` shows the "Entity not found" page.
After: the same link lands on `/catalog/default/component/new-name` with a notice that the entity was renamed from `old-name`. TechDocs links (`/docs/default/component/old-name/...`) behave the same way and keep the path inside the docs.

User's choices from the interview:

- Former names are declared by the entity owner in a well-known annotation.
- The catalog backend indexes them and resolves them, with no new database tables.
- Tests are backend unit tests plus jsdom component tests.
- Docs and changesets are included.

## Goal

1. **catalog-model:** add a well-known annotation, proposed as `backstage.io/former-names`, that holds a comma-separated list of entity refs. Add a constant for it and a parsing helper. Short refs default to the entity's own kind and namespace.
2. **catalog-backend:** index the declared former refs when the entity is stitched, through the existing search rows. Add a lookup that resolves a former ref to the current entity, with these rules:
   - **Real names win.** If an entity currently has the ref as its real name, the lookup never redirects, even when another entity claims it. A newly created entity that takes an old name is served directly.
   - **Ambiguous claims are refused.** If more than one entity claims the same former ref, the lookup returns no redirect (a conflict) and logs nothing that discloses which entities are involved.
   - **Permissions apply.** The target entity is read through the normal `catalog.entity.read` permission check. A target the user can't read gives "not found", so the lookup never reveals that an entity exists. The rule about real names also takes into account entities the user can't see, so a claim can't take over a name the user has no view of.
   - **Normal lookups stay fast.** The by-name lookup path is unchanged. The resolver only runs after it misses, and uses indexed search rows.
   - The lookup is exposed as a REST endpoint. The OpenAPI spec is updated and the generated router and client are regenerated with the repo's own generator.
3. **catalog-client:** add a method that resolves a former ref, optional on `CatalogApi` so existing implementers don't break. Add it to the in-memory and mock clients.
4. **plugin-catalog:** when the entity page's lookup misses, try the former-ref lookup. On a hit, redirect (replace) to the current entity's route and show a dismissible "This entity was renamed from X" notice. Do this in both the old and new frontend systems.
5. **techdocs:** do the same on the docs reader route, keeping the path inside the docs and the anchor. Reuse the existing redirect-notice pattern.
6. **Docs:** document the annotation in well-known-annotations, the endpoint in the catalog API docs, and the TechDocs behaviour. Add changesets for every published package touched.

## Files in scope

- `packages/catalog-model/src/**`, `packages/catalog-model/report*.api.md`
- `plugins/catalog-backend/src/**`, including `src/schema/openapi.yaml` and `src/schema/openapi/generated/**` (regenerated only, never hand-edited), plus `plugins/catalog-backend/report*.api.md`
- `packages/catalog-client/src/**`, including `src/schema/openapi/generated/**` (regenerated only), plus `packages/catalog-client/report*.api.md`
- `plugins/catalog-node/src/**`, `plugins/catalog-node/report*.api.md` (the CatalogService interface and its test mocks)
- `plugins/catalog-react/src/**`, `plugins/catalog-react/report*.api.md` (the mock catalog API and translations, if needed)
- `plugins/catalog/src/**`, `plugins/catalog/report*.api.md`
- `plugins/techdocs/src/**`, `plugins/techdocs/report*.api.md`
- `docs/features/software-catalog/well-known-annotations.md`, `docs/features/software-catalog/api.md`, `docs/features/techdocs/how-to-guides.md`
- `.changeset/*.md` (new files only)
- `.gitignore` (append `.sdlc/`, only if confirmed at Gate 0)

## Files off-limits

- Project defaults: `.env`, `.env.*`, `.mcp.json`, `.cursor/rules/**`, `.claude/settings.local.json`, `node_modules/**`, `dist/**`, `build/**`, `.next/**`, `.sdlc/**`, `.git/**`
- AI configs: `.claude/**`, `.cursor/**`, `AGENTS.md`, `.github/copilot-instructions.md`
- `.envrc`, `.yarn/**`, `docs/releases/**`, and existing `.changeset/*` entries
- ESLint, Prettier and TypeScript configuration files
- `plugins/catalog-backend/migrations/**` (no new tables)
- `plugins/techdocs-backend/**`

## Acceptance criteria

- Backend tests cover:
  - indexing of former names, including short-form refs and malformed values
  - conflict handling: a real name wins, and several claimants give no redirect
  - permissioned lookup: a target the user can't read gives not-found
- jsdom tests in plugin-catalog and techdocs show that an old route redirects to the new one and shows the rename notice, and that an unknown name still shows "Entity not found".
- These pass:
  - `CI=1 yarn test` for each touched package
  - `yarn tsc`
  - `yarn lint --fix`, with no remaining errors in touched files
- API reports are regenerated for every touched package, and the generated OpenAPI files match the yaml.
- New source files carry the Apache 2.0 header with the year 2026. Existing headers are left unchanged.
- Changesets use the correct bump for each package's version.

## Non-goals

- Automatic detection of renames, or new database tables or migrations.
- Changing techdocs-backend or the storage paths of TechDocs that were already built.
- Redirecting API calls that are made by entity name, such as `GET /entities/by-name` itself. Only the frontend pages redirect.
- Rewriting relations or refs held by other entities that still point at the old name.

## Gate 0 decisions (approved 2026-10-28)

- Stack: node-typescript (Backstage monorepo). Test command: `CI=1 yarn test <path>` per touched package, plus `yarn tsc` and `yarn lint --fix`.
- Auth mode: `estimated`. Policy: `opus55-plus-sonnet55`.
- AI configs are all off-limits.
- `.gitignore`: append `.sdlc/` (yes, the default).
- Generated OpenAPI folders in catalog-backend and catalog-client are allowlisted for regeneration only.
- Design defaults accepted as written in Goal §2.
- The write contract is frozen with the allowlist and off-limits listed above, plus ESLint, Prettier and tsconfig files as off-limits.
