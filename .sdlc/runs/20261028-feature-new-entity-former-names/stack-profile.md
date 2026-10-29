# Stack profile — learned from repo scan

Run: `20261028-feature-new-entity-former-names`. Scope: the job's packages only (catalog-model, catalog-backend,
catalog-client, catalog-node, catalog-react, catalog, techdocs). Built 2026-10-28 from HEAD `f20fd9b59828`.

## Language & runtime

TypeScript, Yarn workspaces (`workspace:^` deps), ESM-style `import` syntax compiled by `backstage-cli`. Tests are Jest
via `backstage-cli package test`, co-located as `*.test.ts(x)` next to the source. Run tests from the repo root with
`CI=1 yarn test <path>`. Type-check with `yarn tsc` from the root, no options. Imports are relative inside a package and
`@backstage/*` across packages. No path aliases. Node built-ins use the `node:` prefix (`node:crypto`, `node:perf_hooks`).
Every package has a committed `report*.api.md` that `yarn build:api-reports` regenerates; any public API change shows up there.

Package versions, which set the changeset bump rule (breaking = major at >=1.0, minor below; new API = minor at >=1.0, patch below):
catalog-model 1.10.2 · catalog-client 1.16.3 · catalog-node 2.2.7-next.0 · catalog-react 4.0.0-next.0 ·
catalog 2.0.11-next.0 · catalog-backend 4.0.3-next.0 · techdocs 1.19.1-next.0. All are >=1.0, and `.changeset/pre.json` shows pre-release mode (tag `next`).

## Copyright header (required on every new .ts/.tsx/.js file; use 2026; never change the year on existing files)

```ts
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```

## Framework

Backstage. Backend: the new backend system (`@backstage/backend-plugin-api`), an Express router built by
`createOpenApiRouter` from an OpenAPI spec, and Knex as the database layer. Frontend: both systems live side by side.
The old system uses `core-plugin-api` (`useApi`, `useRouteRefParams`, `createTranslationRef` from `core-plugin-api/alpha`).
The new system lives under `src/alpha` and uses `frontend-plugin-api` (`PageBlueprint.makeWithOverrides`).

## Conventions detected

### File naming

- Classes and React components use PascalCase files: `DefaultEntitiesCatalog.ts`, `AuthorizedEntitiesCatalog.ts`, `CatalogClient.ts`,
  `TechDocsRedirectNotification.tsx`. Hooks and functions use camelCase: `useEntityFromUrl.ts`, `useExternalRedirect.ts`, `buildEntitySearch.ts`, `createRouter.ts`.
- Component folders have an `index.ts` barrel (`components/TechDocsRedirectNotification/index.ts`, `components/CatalogEntityPage/index.ts`).
- Each test is a sibling file: `ref.test.ts`, `buildEntitySearch.test.ts`, `useExternalRedirect.test.tsx`.

### catalog-model — constants and helpers

Annotation constants live in `packages/catalog-model/src/entity/constants.ts` (`ANNOTATION_VIEW_URL`, `ANNOTATION_EDIT_URL`)
and in `src/location/annotation.ts`. Each constant has a one-line TSDoc block and a `@public` tag, and is re-exported through `export * from './constants'`
in `src/entity/index.ts`:

```ts
/**
 * Annotation for linking to entity page from catalog pages.
 *
 * @public
 */
export const ANNOTATION_EDIT_URL = 'backstage.io/edit-url';
```

Helper pattern (`src/location/helpers.ts`) reads annotations with optional chaining:

```ts
export function getEntitySourceLocation(entity: Entity): {
  type: string;
  target: string;
} {
  const locationRef =
    entity.metadata?.annotations?.[ANNOTATION_SOURCE_LOCATION] ??
    entity.metadata?.annotations?.[ANNOTATION_LOCATION];
  if (!locationRef) {
    throw new Error(
      `Entity '${stringifyEntityRef(entity)}' is missing location`,
    );
  }
  return parseLocationRef(locationRef);
}
```

Test shape (`src/entity/ref.test.ts`): nested `describe`, plain `it`, several `expect`s in each `it`:

```ts
describe('ref', () => {
  describe('parseEntityRef', () => {
    it('handles some omissions', () => {
      expect(parseEntityRef('a:b/c')).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(parseEntityRef('a:c')).toEqual({ kind: 'a', namespace: 'default', name: 'c' });
    });
```

Docs for well-known annotations: `docs/features/software-catalog/well-known-annotations.md` (`### backstage.io/<name>` + YAML example + prose).

### catalog-backend — router route handler (`src/service/createRouter.ts`, 956 lines; only the relevant region was read)

Routes are chained on the router that `createOpenApiRouter()` returns. Each one wraps its body in an auditor event and uses `try`/`success`/`fail`/rethrow:

```ts
    .get('/entities/by-name/:kind/:namespace/:name', async (req, res) => {
      const { kind, namespace, name } = req.params;
      const entityRef = stringifyEntityRef({ kind, namespace, name });
      const auditorEvent = await auditor.createEvent({
        eventId: 'entity-fetch', request: req,
        meta: { queryType: 'by-name', entityRef: entityRef },
      });
      try {
        const { items } = await entitiesCatalog.entitiesBatch({
          entityRefs: [stringifyEntityRef({ kind, namespace, name })],
          credentials: await httpAuth.credentials(req),
        });
        await auditorEvent?.success();
        writeSingleEntityResponse(res, items,
          `No entity named '${name}' found, with kind '${kind}' in namespace '${namespace}'`);
      } catch (err) {
        await auditorEvent?.fail({ error: err });
        throw err;
      }
    })
```

Sub-resource precedent: `.get('/entities/by-name/:kind/:namespace/:name/ancestry', ...)` calls
`entitiesCatalog.entityAncestry(entityRef, { credentials })` and returns `res.status(200).json(response)`.
Any new route must also be added to `src/schema/openapi.yaml`, or the validated router rejects it (see the OpenAPI section).

### catalog-backend — EntitiesCatalog method shape

The interface is `src/catalog/types.ts` `EntitiesCatalog`. Each method has a TSDoc comment and takes `options: { credentials: BackstageCredentials }`:

```ts
  /**
   * Returns the full ancestry tree upward along reference edges.
   *
   * @param entityRef - An entity reference to the root of the tree
   */
  entityAncestry(
    entityRef: string,
    options: { credentials: BackstageCredentials },
  ): Promise<EntityAncestryResponse>;
```

`DefaultEntitiesCatalog` (`src/service/DefaultEntitiesCatalog.ts`) runs Knex queries against typed rows and throws `NotFoundError` from `@backstage/errors`:

```ts
  async entityAncestry(rootRef: string): Promise<EntityAncestryResponse> {
    const [rootRow] = await this.database<DbFinalEntitiesRow>('final_entities')
      .where('final_entities.entity_ref', '=', rootRef)
      .select({ entityJson: 'final_entities.final_entity' });
    if (!rootRow) {
      throw new NotFoundError(`No such entity ${rootRef}`);
    }
    const rootEntity = JSON.parse(rootRow.entityJson) as Entity;
```

Search-table lookups use `search` rows (`DbSearchRow`: `entity_id`, `key`, `value` lowercased) joined to `final_entities`.
`AuthorizedEntitiesCatalog` wraps each method in a permission check and then delegates:

```ts
const rootEntityAuthorizeResponse = (
  await this.permissionApi.authorize(
    [{ permission: catalogEntityReadPermission, resourceRef: entityRef }],
    { credentials: options.credentials },
  )
)[0];
if (rootEntityAuthorizeResponse.result === AuthorizeResult.DENY) {
  throw new NotAllowedError();
}
const ancestryResult = await this.entitiesCatalog.entityAncestry(entityRef, {
  credentials: options.credentials,
});
```

Adding a method to `EntitiesCatalog` also requires updating the hand-written mock object in `createRouter.test.ts` `beforeEach`
(`entities, entitiesBatch, removeEntityByUid, entityAncestry, facets, queryEntities: jest.fn()`) and every other implementer
(search: `grep -rn "implements EntitiesCatalog" plugins/catalog-backend/src`).

### catalog-backend — stitcher search rows (`src/database/operations/stitcher/buildEntitySearch.ts`)

`traverse(entity)` flattens every path into `{key, value}` (except `SPECIAL_KEYS`). Arrays of strings produce both `a=b` and `a.b=true`.
Special keys are then pushed explicitly, so each always has a row even when null:

```ts
raw.push({ key: 'metadata.name', value: entity.metadata.name });
raw.push({ key: 'metadata.namespace', value: entity.metadata.namespace });
raw.push({ key: 'metadata.uid', value: entity.metadata.uid });
if (!entity.metadata.namespace) {
  raw.push({ key: 'metadata.namespace', value: DEFAULT_NAMESPACE });
}
for (const relation of entity.relations ?? []) {
  raw.push({ key: `relations.${relation.type}`, value: relation.targetRef });
}
```

After that come a case-collision check (throws `InputError`), then `mapToRows` (lowercases values and truncates at MAX 200 chars), then a (key,value) dedup.
Annotations are already indexed generically as `metadata.annotations.<key>`. A comma-separated annotation value is one row, so per-name rows need an explicit push.
Its test (`buildEntitySearch.test.ts`) is pure-function `expect(...).toEqual([...rows])` with no DB.

### catalog-backend — test shape

DB-backed tests use `TestDatabases` and run once per supported engine:

```ts
jest.setTimeout(60_000);
const databases = TestDatabases.create();
describe.each(databases.eachSupportedId())(
  'DefaultEntitiesCatalog, %p',
  databaseId => {
    let knex: Knex;
    async function createDatabase() {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
    }
```

Entities are inserted by hand into `refresh_state`, `final_entities` and `search` (the file's `addEntity` helper uses `buildEntitySearch`).
The catalog is built with `new DefaultEntitiesCatalog({ database: knex, logger: mockServices.logger.mock() })`.
Router tests use `supertest` with a mocked `EntitiesCatalog`, `mockServices.auth()/httpAuth()/auditor.mock()/permissions()`, and
`mockCredentials.user()`:

```ts
const response = await request(app).get('/entities/by-name/k/ns/n');
expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledWith({
  entityRefs: ['k:ns/n'],
  credentials: mockCredentials.user(),
});
expect(response.status).toEqual(200);
```

### OpenAPI spec and generated code (exact regeneration command)

The spec is `plugins/catalog-backend/src/schema/openapi.yaml` (OpenAPI 3.1, `operationId` PascalCase, e.g. `GetEntityAncestryByName`,
params reuse `$ref: '#/components/parameters/kind|namespace|name'`, errors `$ref: '#/components/responses/ErrorResponse'`,
`security: [{}, {JWT: []}]`). Generated outputs (header `THIS IS AN AUTOGENERATED FILE. DO NOT EDIT`):

- `plugins/catalog-backend/src/schema/openapi/generated/{router.ts,apis/,models/}`
- `packages/catalog-client/src/schema/openapi/generated/{apis/Api.client.ts,models/,pluginId.ts}`
  These are regenerated together by the catalog-backend package script
  `"generate": "backstage-repo-tools package schema openapi generate --server --client-package packages/catalog-client"`.
  To run it: **`yarn --cwd plugins/catalog-backend generate`** (it needs `java` on PATH; this machine has OpenJDK 21). Validate first with
  `yarn --cwd plugins/catalog-backend backstage-repo-tools package schema openapi validate`. Never hand-edit `generated/`.
  Generated client method shape: `getEntityByName(request: { path: { kind, namespace, name } }, options?) => Promise<TypedResponse<Entity>>`.
  Precedent: commit `b4e82492b90d` (queryLocations) changed the yaml, the client `generated/` files, `CatalogClient.ts` and both report files in one commit.

### catalog-client — CatalogClient method

Methods wrap the generated `DefaultApiClient`. `requestRequired` throws `ResponseError` on any non-ok response. `requestOptional`
maps 404 to `undefined`:

```ts
  /**
   * {@inheritdoc CatalogApi.getEntityAncestors}
   */
  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return await this.requestRequired(
      await this.apiClient.getEntityAncestryByName(
        { path: parseEntityRef(request.entityRef) },
        options,
      ),
    );
  }
```

`CatalogApi` (`src/types/api.ts`) uses TSDoc on every method plus `@public` request/response interfaces named `XxxRequest`/`XxxResponse`.
**No optional-method precedent exists in `CatalogApi`:** every method is required. New methods (`queryLocations`, `streamLocations`) were
added as required, with a `minor` bump for catalog-client, catalog-react and catalog-node together. Adding a required method breaks third-party
implementers. If the spec wants it optional (`method?(...)`), that is a new pattern, and callers must guard with `catalogApi.method?.(...)` or a fallback.
`CatalogClient.test.ts` uses `msw`: `setupServer()`, `server.use(http.get(\`${mockBaseUrl}/entities/by-name/...\`, () => HttpResponse.json(x)))`,
`new HttpResponse(null, { status: 404 })`. It checks both string and compound refs, and checks that a 404 resolves to `undefined`.

### catalog-client testUtils — InMemoryCatalogClient (`src/testUtils/InMemoryCatalogClient.ts`)

Holds `#entities`. Lookups go through `this.#createEntityRefMap()` and throw `NotFoundError` where the real API would 404:

```ts
  async getEntityByRef(entityRef: string | CompoundEntityRef): Promise<Entity | undefined> {
    return this.#createEntityRefMap().get(stringifyEntityRef(parseEntityRef(entityRef)));
  }
```

Its API surface is in `report-testUtils.api.md`. It has its own test file, `InMemoryCatalogClient.test.ts`.

### catalog-react catalogApiMock / catalog-node catalogServiceMock

Both enumerate every method by hand in `.mock` and use `InMemoryCatalogClient` for the default and `.factory`:

- `plugins/catalog-react/src/testUtils/catalogApiMock.ts`: `createApiMock(catalogApiRef, () => ({ getEntities: jest.fn(), ... streamEntityPages: jest.fn() }))`
- `plugins/catalog-node/src/testUtils/catalogServiceMock.ts`: `createServiceMock<CatalogServiceMock>(catalogServiceRef, () => ({ ...jest.fn() per method }))`
  `CatalogServiceMock extends CatalogService, CatalogApi` (`testUtils/types.ts`). `CatalogService` (`catalogService.ts`) mirrors `CatalogApi`
  with **required** `options: CatalogServiceRequestOptions`, and `DefaultCatalogService` delegates:

```ts
  async getEntityAncestors(request: GetEntityAncestorsRequest, options: CatalogServiceRequestOptions): Promise<GetEntityAncestorsResponse> {
    return this.#catalogApi.getEntityAncestors(request, await this.#getOptions(options));
  }
```

A new CatalogApi method means updating: CatalogClient, InMemoryCatalogClient, catalogApiMock.mock, CatalogService plus DefaultCatalogService,
catalogServiceMock.mock, and the report files of all four packages.

### plugin-catalog — useEntityFromUrl (`src/components/CatalogEntityPage/useEntityFromUrl.ts`, internal, no test file)

```ts
export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { value: entity, error, loading, retry: refresh } = useAsyncRetry(
    () => catalogApi.getEntityByRef({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );
  ...
  return { entity, loading, error, refresh };
};
```

It is used by the old `CatalogEntityPage` (`<AsyncEntityProvider {...useEntityFromUrl()}><Outlet /></AsyncEntityProvider>`) and by the
new-system `src/alpha/components/CatalogEntityPage.tsx`. The new one also compares `stringifyEntityRef(entity)` with the route params and shows
loading while they differ. **A redirect to a different ref would hit that mismatch guard.** The not-found UI is in `components/EntityLayout/EntityLayout.tsx`
(old, `WarningPanel`) and `alpha/components/EntityLayout/EntityLayoutBui.tsx` / `alpha/components/EntityLayout/EntityLayout.tsx` (new). All three use
`t('entityPage.notFoundMessage', { kind, link })`. Imports use `react-use/esm/useAsync(Retry)`.

### plugin-catalog — new-frontend-system page (`src/alpha/pages.tsx`)

```ts
export const catalogEntityPage = PageBlueprint.makeWithOverrides({
  name: 'entity',
  inputs: { headerLayouts: createExtensionInput([...]), contents: createExtensionInput([...]), ... },
  configSchema: { defaultContentOrder: z.enum(['title', 'natural']).optional().default('title'), ... },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/catalog/:namespace/:kind/:name',
      routeRef: convertLegacyRouteRef(entityRouteRef), // READ THE ABOVE
      loader: async () => {
        const { CatalogEntityPage } = await import('./components/CatalogEntityPage');
```

Techdocs follows the same pattern: `plugins/techdocs/src/alpha/index.tsx` `techDocsReaderPage = PageBlueprint.makeWithOverrides({ ... path: '/docs/:namespace/:kind/:name' ... })`.

### Frontend test shape (RTL)

Old system (`plugins/catalog/src/components/EntityLayout/EntityLayout.test.tsx`), using `@backstage/test-utils`:

```ts
const apis = TestApiRegistry.from(
  [catalogApiRef, catalogApiMock()],
  [alertApiRef, mockApis.alert()],
  [permissionApiRef, mockApis.permission()],
);
await renderInTestApp(
  <ApiProvider apis={apis}>
    <EntityProvider entity={mockEntity}>...</EntityProvider>
  </ApiProvider>,
  {
    mountedRoutes: {
      '/catalog/:namespace/:kind/:name': entityRouteRef,
      '/catalog': rootRouteRef,
    },
  },
);
```

New system (`plugins/catalog/src/alpha/pages.test.tsx`), using `@backstage/frontend-test-utils`:

```ts
const mockCatalogApi = catalogApiMock({ entities: [entityMock] });
const tester = createExtensionTester(
  Object.assign({ namespace: 'catalog' }, catalogEntityPage),
);
await renderInTestApp(tester.reactElement(), {
  apis: [mockCatalogApi, [starredEntitiesApiRef, mockStarredEntitiesApi]],
  mountPath: '/catalog/:namespace/:kind/:name',
  initialRouteEntries: [entityPath],
  mountedRoutes: {
    '/catalog': convertLegacyRouteRef(rootRouteRef),
    '/catalog/:namespace/:kind/:name': convertLegacyRouteRef(entityRouteRef),
  },
});
await expect(
  screen.findByRole('menuitemradio', { name: /TechDocs/ }),
).resolves.toHaveAttribute('href', `${entityPath}/techdocs`);
```

CLAUDE.md asks for `screen` + `findBy*` over `waitFor`, no test IDs, and fewer, thorough tests (existing files still use `waitFor` in places).

### techdocs — useExternalRedirect (`src/reader/components/TechDocsReaderPage/useExternalRedirect.ts`, `@internal`)

It uses `useAsync`, calls `catalogApi.getEntityByRef(entityRef)`, swallows errors, then `navigate(url, { replace: true })` inside `useEffect`. A `useRef`
guard ensures each entity is checked only once (`checkedEntityRef.current !== entityKey`). It returns `{ loading, shouldShowProgress }`.
`TechDocsReaderPage.tsx` renders `<Progress />` while `shouldShowProgress` is true:

```ts
const externalRedirectResult = useAsync(async () => {
  try {
    const catalogEntity = await catalogApi.getEntityByRef(entityRef);
    if (catalogEntity?.metadata?.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]) {
      return buildTechDocsURL(catalogEntity, viewTechdocLink);
    }
  } catch (error) {
    // Ignore errors and allow the current entity's TechDocs to load.
  }
  return undefined;
}, [entityKey, catalogApi]);
```

Its test (`useExternalRedirect.test.tsx`) uses `renderHook` with a `TestApiProvider` wrapper, a hand-rolled `{ getEntityByRef: jest.fn() }`, and
`jest.mock('react-router-dom', ...)` to capture `useNavigate`, plus `jest.mock('@backstage/core-plugin-api', ...)` for `useRouteRef`:

```ts
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
    {children}
  </TestApiProvider>
);
const { result } = renderHook(
  () =>
    useExternalRedirect({
      kind: 'Component',
      name: 'test-component',
      namespace: 'default',
    }),
  { wrapper },
);
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), {
  replace: true,
});
```

`TechDocsRedirectNotification` (`src/reader/components/TechDocsRedirectNotification/TechDocsRedirectNotification.tsx`) is an MUI v4 `Snackbar`
with props `{ message, handleButtonClick, autoHideDuration }` and a button labelled `t('redirectNotification.redirectNow')`. Today its only
caller is `reader/transformers/handleMetaRedirects.tsx`, which renders it imperatively via `renderReactElement` with a hard-coded English message
(not translated).

### Translation refs

`createTranslationRef` from `@backstage/core-plugin-api/alpha`, nested `messages` object, `{{var}}` interpolation:

```ts
/** @alpha */
export const techdocsTranslationRef = createTranslationRef({
  id: 'techdocs',
  messages: {
    redirectNotification: {
      redirectNow: 'Redirect now',
    },
```

- catalog: `plugins/catalog/src/alpha/translation.ts` (`catalogTranslationRef`, tagged `/** @public */`; `entityPage.notFoundMessage`, `entityPage.notFoundLinkText`)
- techdocs: `plugins/techdocs/src/translation.ts` (`@alpha`)
- catalog-react: `plugins/catalog-react/src/translation.ts` (`catalogReactTranslationRef`)
  Components read messages with `const { t } = useTranslationRef(xxxTranslationRef);`. New keys change `report-alpha.api.md`.

### Config

There are no config changes in this scope. The backend reads config as `config.getOptionalBoolean('catalog.readonly')`. Request parsing uses `zod/v3`.

### Data layer

Knex with typed table rows (`DbFinalEntitiesRow`, `DbSearchRow`, `DbRefreshStateRow`, `DbRefreshStateReferencesRow` in
`src/database/tables.ts`). Migrations are in `plugins/catalog-backend/migrations/` and applied with `applyDatabaseMigrations(knex)`. Relevant tables are
`final_entities(entity_id, entity_ref, final_entity)` and `search(entity_id, key, value)`.

### Framework-owned wiring

Backend routes register by being chained on `createOpenApiRouter()` and must exist in `openapi.yaml`. New-system pages register as
`PageBlueprint` extensions exported from `src/alpha/pages.tsx` (`export default [catalogPage, catalogEntityPage]`). Old-system pages register through the
`plugin.ts` routable extensions and `routes.ts`.

### Changeset format (`.changeset/<kebab-name>.md`, written by hand, never with the CLI)

```md
---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog-node': minor
---

Implemented support for the new `queryLocations` and `streamLocations` that allow paginated/streamed and filtered location queries
```

Another current example, `.changeset/catalog-rules-url-canonical-matching.md`: `'@backstage/plugin-catalog-backend': patch`, then a one-line summary,
then a paragraph about adopter impact. Split changesets when packages need different messages. Never mention internal symbols.

## Sample files inspected

- packages/catalog-model/src/entity/constants.ts (constants) · src/entity/ref.test.ts (test) · src/location/annotation.ts, helpers.ts, helpers.test.ts (helper)
- plugins/catalog-backend/src/service/createRouter.ts L17-120, L420-535 (route) · createRouter.test.ts L56-106, L515-554 (router test)
- plugins/catalog-backend/src/catalog/types.ts L140-200 · service/DefaultEntitiesCatalog.ts L733-778 · AuthorizedEntitiesCatalog.ts L245-280 (service)
- plugins/catalog-backend/src/service/DefaultEntitiesCatalog.test.ts L17-160 (DB test) · database/operations/stitcher/buildEntitySearch.ts(+test)
- plugins/catalog-backend/package.json scripts · src/schema/openapi.yaml L990-1040 · schema/openapi/generated/router.ts header
- packages/catalog-client/src/CatalogClient.ts, CatalogClient.test.ts, types/api.ts, testUtils/InMemoryCatalogClient.ts, generated/apis/Api.client.ts L402-424
- plugins/catalog-node/src/catalogService.ts, testUtils/catalogServiceMock.ts · plugins/catalog-react/src/testUtils/catalogApiMock.ts
- plugins/catalog/src/components/CatalogEntityPage/{useEntityFromUrl.ts,CatalogEntityPage.tsx} · alpha/components/CatalogEntityPage.tsx · alpha/pages.tsx
- plugins/catalog/src/alpha/pages.test.tsx, components/EntityLayout/EntityLayout.test.tsx (RTL) · EntityLayout.tsx, alpha/.../EntityLayoutBui.tsx (not-found)
- plugins/techdocs/src/reader/components/TechDocsReaderPage/{useExternalRedirect.ts,useExternalRedirect.test.tsx,TechDocsReaderPage.tsx L185-235}
- plugins/techdocs/src/reader/components/TechDocsRedirectNotification/TechDocsRedirectNotification.tsx · reader/transformers/handleMetaRedirects.tsx
- plugins/techdocs/src/translation.ts · plugins/catalog/src/alpha/translation.ts · .changeset/\*.md, commit b4e82492b90d
  Skipped: files over 500 lines were read only in the regions listed above, and `generated/` was read only for its header and one method.

## Notes for downstream codegen

**All packages**

- New source files carry the 2026 Apache header. Existing headers are never touched. Match each file's local style: prettier defaults, single quotes, trailing commas.
- Every public export needs TSDoc and a release tag (`@public`/`@alpha`/`@internal`). Expect `report*.api.md` diffs, which `yarn build:api-reports` regenerates.
- Format only the changed files: `yarn prettier --write <paths>`. Tests: `CI=1 yarn test <path>`. Do not run `yarn build`.

**packages/catalog-model**

- Put the new annotation constant in `src/entity/constants.ts` (generic metadata) next to `ANNOTATION_EDIT_URL`. `export *` picks it up automatically.
- A parse helper (for example, splitting and trimming a comma-separated value into refs) follows `getEntitySourceLocation`: read with optional chaining, use `parseEntityRef`/`stringifyEntityRef`
  from `./ref`, and put tests in a sibling file with a nested `describe` and many `expect`s. Bump: minor (new API). Document it in `docs/features/software-catalog/well-known-annotations.md`.

**plugins/catalog-backend**

- A new route goes into the `createRouter.ts` chain near the `by-name` routes, with an auditor event (`eventId: 'entity-fetch'`, a new `queryType`) and
  `httpAuth.credentials(req)`. Add the path to `openapi.yaml` **before** regenerating, then run `yarn --cwd plugins/catalog-backend generate`.
- A new `EntitiesCatalog` method must be implemented in `DefaultEntitiesCatalog` (Knex on `search`/`final_entities`) and in `AuthorizedEntitiesCatalog`
  (`catalogEntityReadPermission` check, `NotAllowedError` / filter), and added to the `createRouter.test.ts` mock literal.
- To make search rows per name, push explicit rows in `buildEntitySearch` the way relations are pushed, and add the key to `SPECIAL_KEYS` only if the generic row
  should be suppressed. Values are lowercased and truncated at 200 characters by `mapToRows`. Changes to search rows only take effect after restitching.
- DB tests use `TestDatabases` + `describe.each(databases.eachSupportedId())` + `applyDatabaseMigrations`. Router tests use supertest and `mockCredentials.user()`.

**packages/catalog-client**

- Use `CatalogClient` methods with `{@inheritdoc CatalogApi.x}` + `requestRequired`/`requestOptional` around the **generated** `apiClient` method. Never hand-write fetch.
- Decide in the spec whether the new `CatalogApi` method is optional (no precedent, non-breaking) or required (precedent: minor bump across client, react and node,
  but it breaks custom implementers). Implement it in `InMemoryCatalogClient` too (report-testUtils), and write msw-based tests.

**plugins/catalog-node**

- Mirror any `CatalogApi` addition in `CatalogService` (required `options`) + `DefaultCatalogService` (delegate with `await this.#getOptions(options)`) +
  `catalogServiceMock.mock` jest.fn list.

**plugins/catalog-react**

- Add the new method's `jest.fn()` to `catalogApiMock.mock`. Translation keys go in `src/translation.ts` only when a shared component needs them.

**plugins/catalog**

- Fallback or redirect logic belongs in `useEntityFromUrl` (internal; it currently has no dedicated test, so add `useEntityFromUrl.test.tsx` with `renderHook`
  - `TestApiProvider` + `catalogApiMock`). Both page variants consume it. The new-system page's `matchesRoute` guard treats an entity whose ref differs from the URL
    as loading, so the redirect must `navigate(..., { replace: true })` to the canonical URL (built with the `entityRouteRef` params) or the guard must be relaxed.
- Add UI strings to `src/alpha/translation.ts` under `entityPage.*`. Test with `renderInTestApp` (new: `createExtensionTester(...)` with `apis`/`mountPath`/`initialRouteEntries`;
  old: `TestApiRegistry` + `ApiProvider` + `mountedRoutes`). Use `screen.findBy*`.

**plugins/techdocs**

- Extend `useExternalRedirect` in the same `useAsync` block: catch errors and fall back. Keep the `checkedEntityRef` once-per-entity guard and `{ replace: true }`.
- Reuse `TechDocsRedirectNotification` (Snackbar) for any "you were redirected" notice. New strings go in `techdocsTranslationRef` (`redirectNotification.*`).
- Tests follow `useExternalRedirect.test.tsx`: `renderHook`, `TestApiProvider` wrapper, mocked `useNavigate`/`useRouteRef`, and assert `mockNavigate` was called with `{ replace: true }`.

**Changesets**

- Write a hand-written `.changeset/<kebab-name>.md`, with one per distinct adopter-facing message. Bumps: new API → `minor` (all packages are >=1.0, including the `-next` ones).
  `generated/` and test-only changes need no separate entry.
