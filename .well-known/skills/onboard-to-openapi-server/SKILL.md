---
name: onboard-to-openapi-server
description: Use this skill when the user wants to migrate an existing Backstage backend plugin's hand-written Express router to the typed OpenAPI tooling. Optionally, can also add typed client generation and migrate router tests to the OpenAPI test wrapper.
---

# OpenAPI Onboard Plugin

Onboard an existing Backstage backend plugin to the repo's OpenAPI tooling. The core flow reverse-engineers an `openapi.yaml` from the plugin's existing Express router, generates a server stub via `backstage-repo-tools`, switches the router over to `createOpenApiRouter`, and verifies with `yarn tsc` + the package's tests.

The OpenAPI spec is the source of truth. The router is the _starting point_: we read it once to derive the spec, then the spec drives generation forward.

## Up front: confirm scope with the user

Before writing anything, ask which of the optional steps the user wants. Default to **off** unless the user says yes.

| Step                                                   | Always or optional |
| ------------------------------------------------------ | ------------------ |
| Inventory router → write `openapi.yaml`                | Always             |
| Generate server stub (`--server`)                      | Always             |
| Switch router to `createOpenApiRouter`                 | Always             |
| Run `yarn tsc` and the plugin's existing tests         | Always             |
| **Generate a typed client (`--client-package <pkg>`)** | **Optional — ask** |
| **Migrate router tests to `wrapServer`**               | **Optional — ask** |
| Write changesets                                       | Optional — ask     |

When the user picks the minimal flow, skip the corresponding sections below and don't mention them in the final summary.

## Prerequisites

- Run from the monorepo root.
- `yarn install` has been run.
- The target plugin already has a working Express router (typically `src/service/router.ts` or `src/service/createRouter.ts`) and a passing test for it.
- The plugin builds and its tests pass _before_ starting — establish a green baseline first.

If any prerequisite is missing, stop and tell the user.

## Inputs

Ask the user for, or infer:

- **Target plugin directory** — e.g. `plugins/auth-backend`. Required.
- **Plugin id** — used in the spec's `info.title` (e.g. `auth`, `events`). Default to the plugin's `package.json` `backstage.pluginId`.
- **Client package directory** — only if the user opted into client generation. Suggest the conventional sibling `*-node` or `*-common` package and confirm.

## Core workflow

### Step 1 — Establish a baseline

1. Confirm a clean working tree with `git status`.
2. Run the plugin's existing tests to confirm they pass:
   ```
   CI=1 yarn test <plugin-dir>/src/service
   ```
3. Run `yarn tsc` from the repo root.

If either fails, stop. Do not start an onboarding on top of a red baseline — fixes will get tangled with the migration.

### Step 2 — Inventory the router

Read the router file(s) and produce a complete list of every route. For each route capture:

- HTTP method and path (including path params).
- Path/query/header parameters and which are required.
- Request body shape (TypeScript types, validation calls, or JSON schemas — whatever exists).
- Response shapes per status code, including error responses.
- Auth/permission decorators (`httpAuth.credentials`, `permissions.authorize`, etc.) — these are not in the spec but must be preserved verbatim in the post-migration router.

Read every helper the router pulls in (request validators, type guards, response builders) so the spec accurately reflects runtime behavior. Do _not_ skip routes mounted via `router.use(subRouter)` — recurse into them.

Present this inventory to the user before writing any spec. Misreading the router here causes the spec to drift from reality, which then poisons every downstream step.

### Step 3 — Author `src/schema/openapi.yaml`

Create `<plugin-dir>/src/schema/openapi.yaml` modeled on existing onboarded plugins:

- [`plugins/events-backend/src/schema/openapi.yaml`](https://github.com/backstage/backstage/blob/master/plugins/events-backend/src/schema/openapi.yaml) — small, modern reference.
- [`plugins/scaffolder-backend/src/schema/openapi.yaml`](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/schema/openapi.yaml) — larger, with more parameter and schema reuse.
- [`plugins/catalog-backend/src/schema/openapi.yaml`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/schema/openapi.yaml) — largest, good for query-param-heavy endpoints.

Conventions to follow:

- `openapi: 3.1.0`.
- `info.title` is the plugin id; `info.version: '1'`.
- `servers: [{ url: / }]`.
- Define a reusable `Error`/`ErrorResponse` under `components.schemas` and `components.responses` and reference it from every error status.
- Reuse path parameters via `components.parameters`.
- Each operation gets a stable `operationId` (PascalCase verb-noun, e.g. `ListNotifications`, `PostEvent`) — these become the generated client's method names. Match the convention used by the other onboarded Backstage plugins linked above.
- `requestBody` content type usually `application/json`; responses likewise.
- Required query/path params marked `required: true`.

Validate the spec is well-formed:

```
yarn backstage-repo-tools repo schema openapi lint <plugin-dir>/src/schema/openapi.yaml
```

Iterate on lint output until clean.

### Step 4 — Wire up dependencies and the `generate` script

In `<plugin-dir>/package.json`:

1. Ensure `@backstage/backend-openapi-utils` is in `dependencies` (required at runtime by the generated `router.ts`).
2. Add a `generate` script. The exact form depends on whether the user opted into client generation:
   - **Server only (default):**
     ```json
     "generate": "backstage-repo-tools package schema openapi generate --server"
     ```
   - **Server + client (opt-in):** see the optional client section below.

### Step 5 — Generate the server stub

Run from the plugin directory:

```
yarn --cwd <plugin-dir> generate
```

This will:

- Empty `<plugin-dir>/src/schema/openapi/generated/` and rewrite it.
- Produce `apis/Api.server.ts`, `models/*.model.ts`, an `index.ts`, and `router.ts` (which exports `spec` and `createOpenApiRouter`).
- Run lint and prettier on the generated output.

The generator also writes `<plugin-dir>/src/schema/openapi/index.ts` re-exporting `./generated`. Leave this alone.

If generation fails, the most common causes are: invalid YAML (fix and rerun), unsupported OpenAPI version (`@backstage/backend-openapi-utils` only supports OpenAPI 3.1.x — keep `openapi: 3.1.0` at the top of the spec).

### Step 6 — Switch the router over to `createOpenApiRouter`

In the existing router file:

1. Replace `const router = Router()` (or `express.Router()`) with:
   ```ts
   import { createOpenApiRouter } from '../schema/openapi';
   // ...
   const router = await createOpenApiRouter();
   ```
   (Adjust the import path to the router's location.) The function is async — propagate the `await` up to where the router is constructed.
2. Move route handlers onto the new router unchanged. The OpenAPI router validates incoming requests against the spec at runtime (response shapes are validated separately via `wrapServer` in tests); if a handler reads `req.body.foo` where the spec says it is `req.body.event.foo`, the spec is wrong, not the handler — go fix the spec and regenerate.
3. Remove request validation that the spec now covers. Anything the OpenAPI validator enforces — required path/query/body params, primitive types, enums, `format`, `minimum`/`maximum`, `minLength`/`pattern`, etc. — should be deleted from the handler. Typical things to strip out: manual `if (!req.body.x) throw new InputError(...)` guards, `typeof req.query.foo !== 'string'` checks, hand-rolled `enum` membership tests, `Number.parseInt`/`.toString()` coercion on values the spec already types correctly. Keep validation the spec _can't_ express — cross-field invariants, auth/permission checks, business-rule guards, lookups against the database.
4. Keep all middleware in the same order (cookie parsers, body parsers, auth, error handlers). Auth/permissions logic is NOT generated and must remain in the router code.
5. Preserve the function signature and exports of `createRouter`/`router` exactly so callers (the plugin's `*Plugin.ts`) need no change.

[`plugins/events-backend/src/service/hub/createEventBusRouter.ts`](https://github.com/backstage/backstage/blob/master/plugins/events-backend/src/service/hub/createEventBusRouter.ts) is the canonical example.

### Step 7 — Verify

Run, in order, and fix any failures before moving to the next:

1. **Type check** — `yarn tsc` from the repo root. Common failures: handler argument types now narrower than the spec allows, missing `await` on `createOpenApiRouter()`. Fix in code, never by widening spec types to `any`.
2. **Tests** — `CI=1 yarn test <plugin-dir>/src/service`. The existing tests should still pass against the new typed router without any test-side changes (test migration is a separate, optional step).
3. **Lint** — `yarn lint --fix <plugin-dir>`.

If a test fails because the spec is wrong, edit `openapi.yaml` and rerun `yarn --cwd <plugin-dir> generate`, then re-run the test. Never edit files under `src/schema/openapi/generated/` — they are clobbered on every generate.

## Optional: generate a typed client

Only do this if the user explicitly asked for it.

1. Decide which package will host the client. There are three common shapes — ask the user which one fits:

   - **Backend-only client** (`*-node` package, e.g. `plugins/foo-node`) — when only other backend plugins call this API.
   - **Frontend-only client** (`*-react` package, or a frontend plugin package like `plugins/foo`) — when only browser code calls this API.
   - **Shared client** (`*-common` package, e.g. `plugins/foo-common`) — when both backend and frontend need it. The `*-common` package is the safest default when in doubt because it's reachable from either side.

   If the chosen package does not yet exist as a workspace package, scaffold it with `yarn new` first (`backend-plugin-node` for `*-node`, `plugin-common` for `*-common`, etc.). Confirm naming and template with the user before scaffolding.

2. Update the `generate` script in the plugin's `package.json`:
   ```json
   "generate": "backstage-repo-tools package schema openapi generate --server --client-package <client-pkg-dir>"
   ```
3. Re-run `yarn --cwd <plugin-dir> generate`. The client package's `src/generated/` will be emptied and rewritten with `apis/<Name>Api.client.ts`, `models/`, and `pluginId.ts`.
4. Run `yarn build:api-reports` from the repo root, since the client package's public surface changed.
5. `yarn tsc` again from the repo root.
6. Lint the client package: `yarn lint --fix <client-pkg-dir>`.

[`plugins/events-node/src/generated/`](https://github.com/backstage/backstage/tree/master/plugins/events-node/src/generated) is a reference for what a client output looks like.

## Optional: migrate router tests to `wrapServer`

Only do this if the user explicitly asked for it. The server-side runtime validation in `createOpenApiRouter` already covers the request path; `wrapServer` adds response-side validation in tests, which is useful but not required.

For each router test file (`router.test.ts`, `createRouter.test.ts`):

1. Add the import:
   ```ts
   import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
   ```
2. Wrap every place a `supertest` `app` is constructed:
   ```ts
   const app = await wrapServer(express().use(router));
   ```
   `wrapServer` is async, so the surrounding `beforeEach`/`beforeAll` must `await`.
3. If the test uses `mockErrorHandler()`, mount it on the inner express app _before_ wrapping:
   ```ts
   const app = await wrapServer(express().use(router).use(mockErrorHandler()));
   ```
4. Do not change assertions. The wrapper validates every request and response against the spec at test time — assertion failures that surface as `Response did not match schema` mean the spec or the handler disagree; fix whichever is wrong.
5. Re-run `CI=1 yarn test <plugin-dir>/src/service`.

[`plugins/scaffolder-backend/src/service/router.test.ts`](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/service/router.test.ts) and [`plugins/catalog-backend/src/service/createRouter.test.ts`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/createRouter.test.ts) are reference migrations.

## Optional: changesets

Only if the user wants to land this as a PR. Create changesets in `.changeset/` per `/CONTRIBUTING.md`:

- A `minor` (or `patch` for `< 1.0.0` packages) changeset for the backend plugin describing the new typed router.
- If a client package was generated, a separate changeset for it.
- Tailor each message to its package's audience. Do not reference internal symbols (`createOpenApiRouter`, `EndpointMap`, etc.) — describe the user-facing impact.

Do not run `yarn changesets version`. Write the changeset markdown files directly.

## Reference files in the upstream Backstage repo

These all live in [`backstage/backstage`](https://github.com/backstage/backstage); the user's workspace likely doesn't contain them. Browse via the links below.

| What you need                      | Where to read                                                                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Spec example (small)               | [`plugins/events-backend/src/schema/openapi.yaml`](https://github.com/backstage/backstage/blob/master/plugins/events-backend/src/schema/openapi.yaml)                                      |
| Spec example (large)               | [`plugins/catalog-backend/src/schema/openapi.yaml`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/schema/openapi.yaml)                                    |
| Router using `createOpenApiRouter` | [`plugins/events-backend/src/service/hub/createEventBusRouter.ts`](https://github.com/backstage/backstage/blob/master/plugins/events-backend/src/service/hub/createEventBusRouter.ts)      |
| Test using `wrapServer`            | [`plugins/scaffolder-backend/src/service/router.test.ts`](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/service/router.test.ts)                        |
| Generate command source            | [`packages/repo-tools/src/commands/package/schema/openapi/generate/`](https://github.com/backstage/backstage/tree/master/packages/repo-tools/src/commands/package/schema/openapi/generate) |
| Spec lint command source           | [`packages/repo-tools/src/commands/repo/schema/openapi/lint.ts`](https://github.com/backstage/backstage/blob/master/packages/repo-tools/src/commands/repo/schema/openapi/lint.ts)          |
| `wrapServer` implementation        | [`packages/backend-openapi-utils/src/testUtils.ts`](https://github.com/backstage/backstage/blob/master/packages/backend-openapi-utils/src/testUtils.ts)                                    |
| Client output reference            | [`plugins/events-node/src/generated/`](https://github.com/backstage/backstage/tree/master/plugins/events-node/src/generated)                                                               |

## Things to refuse / hand back to the user

- Don't onboard a plugin whose tests are red on the baseline — fix those first in a separate change.
- Don't invent the auth/permissions story — preserve whatever the router does today.
- Don't use `--no-verify` on commits.
- Don't edit generated files. If something needs to change there, change the spec and regenerate.
- If the router has dynamic mounted sub-routers that you can't statically inventory (e.g. plugin extension points that register routes at runtime), stop and ask the user how they want those handled — the spec can't capture them faithfully.
