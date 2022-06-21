# @backstage/plugin-catalog-backend

## 1.2.0

### Minor Changes

- b594679ae3: Allow array as non-spread arguments at the `CatalogBuilder`.

  ```typescript
  builder.addEntityProvider(...getArrayOfProviders());
  ```

  can be simplified to

  ```typescript
  builder.addEntityProvider(getArrayOfProviders());
  ```

### Patch Changes

- 8838b13038: Disallow anything but `'url'` locations from being registered via the location service.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-permission-node@0.6.2
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-scaffolder-common@1.1.1

## 1.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/plugin-catalog-common@1.0.3-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/plugin-permission-node@0.6.2-next.2

## 1.2.0-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/plugin-permission-node@0.6.2-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0
  - @backstage/plugin-scaffolder-common@1.1.1-next.0

## 1.2.0-next.0

### Minor Changes

- b594679ae3: Allow array as non-spread arguments at the `CatalogBuilder`.

  ```typescript
  builder.addEntityProvider(...getArrayOfProviders());
  ```

  can be simplified to

  ```typescript
  builder.addEntityProvider(getArrayOfProviders());
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-permission-node@0.6.2-next.0

## 1.1.2

### Patch Changes

- 16a40ac4c0: Fix wrong return type of the `isGroupEntity` function.
- 55e09b29dd: Fixing broken types for `knex` when checking returned rows
- 1ccbe081cc: Minor internal tweak to support TypeScript 4.6
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 2909746147: Updated parseEntityTransformParams to handle keys with '.' in them. This will allow for querying of entities based off annotations such as 'backstage.io/orgin-location' or other entity field keys that have '.' in them.
- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/integration@1.2.0
  - @backstage/plugin-scaffolder-common@1.1.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2
  - @backstage/plugin-permission-common@0.6.1
  - @backstage/plugin-permission-node@0.6.1

## 1.1.2-next.2

### Patch Changes

- 16a40ac4c0: Fix wrong return type of the `isGroupEntity` function.
- 2909746147: Updated parseEntityTransformParams to handle keys with '.' in them. This will allow for querying of entities based off annotations such as 'backstage.io/orgin-location' or other entity field keys that have '.' in them.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-scaffolder-common@1.1.0-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/plugin-permission-node@0.6.1-next.1
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.1.2-next.1

### Patch Changes

- 1ccbe081cc: Minor internal tweak to support TypeScript 4.6
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1

## 1.1.2-next.0

### Patch Changes

- 55e09b29dd: Fixing broken types for `knex` when checking returned rows
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-permission-node@0.6.1-next.0

## 1.1.0

### Minor Changes

- 8012ac46a0: **BREAKING (alpha api):** Replace `createCatalogPolicyDecision` export with `createCatalogConditionalDecision`, which accepts a permission parameter of type `ResourcePermission<'catalog-entity'>` along with conditions. The permission passed is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

- 8012ac46a0: **BREAKING:** Mark CatalogBuilder#addPermissionRules as @alpha.
- fb02d2d94d: export `locationSpecToLocationEntity`
- bf82edf4c9: Added `/validate-entity` endpoint

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- 8592cacfd3: Fixed an issue where sometimes entities would have stale relations "stuck" and
  not getting removed as expected, after the other end of the relation had stopped
  referring to them.
- 23646e51a5: Use new `PermissionEvaluator#authorizeConditional` method when retrieving permission conditions.
- 9fe24b0fc8: Adjust the error messages when entities fail validation, to clearly state what entity that failed it
- 48405ed232: Added `spec.profile.displayName` to search index for Group kinds
- 95408dbe99: Enable internal batching of very large deletions, to not run into SQL binding limits
- 8012ac46a0: Handle changes to @alpha permission-related types.

  - All exported permission rules and conditions now have a `resourceType`.
  - `createCatalogConditionalDecision` now expects supplied conditions to have the appropriate `resourceType`.
  - `createCatalogPermissionRule` now expects `resourceType` as part of the supplied rule object.
  - Introduce new `CatalogPermissionRule` convenience type.

- ffec894ed0: add gitlab to AnnotateScmSlugEntityProcessor
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/plugin-permission-node@0.6.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/catalog-client@1.0.1
  - @backstage/plugin-scaffolder-common@1.0.1

## 1.1.0-next.3

### Patch Changes

- 23646e51a5: Use new `PermissionEvaluator#authorizeConditional` method when retrieving permission conditions.
- 48405ed232: Added `spec.profile.displayName` to search index for Group kinds
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/plugin-permission-node@0.6.0-next.2
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 1.1.0-next.2

### Minor Changes

- bf82edf4c9: Added `/validate-entity` endpoint

### Patch Changes

- 8592cacfd3: Fixed an issue where sometimes entities would have stale relations "stuck" and
  not getting removed as expected, after the other end of the relation had stopped
  referring to them.
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.1

## 1.1.0-next.1

### Minor Changes

- 8012ac46a0: **BREAKING (alpha api):** Replace `createCatalogPolicyDecision` export with `createCatalogConditionalDecision`, which accepts a permission parameter of type `ResourcePermission<'catalog-entity'>` along with conditions. The permission passed is expected to be the handled permission in `PermissionPolicy#handle`, whose type must first be narrowed using methods like `isPermission` and `isResourcePermission`:

  ```typescript
  class TestPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyQuery<Permission>,
      _user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
      if (
        // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
        isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)
      ) {
        return createCatalogConditionalDecision(
          request.permission,
          catalogConditions.isEntityOwner(
            _user?.identity.ownershipEntityRefs ?? [],
          ),
        );
      }

      return {
        result: AuthorizeResult.ALLOW,
      };
  ```

- 8012ac46a0: **BREAKING:** Mark CatalogBuilder#addPermissionRules as @alpha.
- fb02d2d94d: export `locationSpecToLocationEntity`

### Patch Changes

- ada4446733: Specify type of `visibilityPermission` property on collators and collator factories.
- 1691c6c5c2: Clarify that config locations that emit User and Group kinds now need to declare so in the `catalog.locations.[].rules`
- 8012ac46a0: Handle changes to @alpha permission-related types.

  - All exported permission rules and conditions now have a `resourceType`.
  - `createCatalogConditionalDecision` now expects supplied conditions to have the appropriate `resourceType`.
  - `createCatalogPermissionRule` now expects `resourceType` as part of the supplied rule object.
  - Introduce new `CatalogPermissionRule` convenience type.

- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-permission-node@0.6.0-next.1
  - @backstage/plugin-catalog-common@1.0.1-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- 9fe24b0fc8: Adjust the error messages when entities fail validation, to clearly state what entity that failed it
- 95408dbe99: Enable internal batching of very large deletions, to not run into SQL binding limits
- ffec894ed0: add gitlab to AnnotateScmSlugEntityProcessor
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.0.1-next.0
  - @backstage/plugin-permission-node@0.5.6-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 6145ca7189: **BREAKING**: A number of types and classes have been removed, without a prior deprecation period. These were all very internal, essentially unused by the vast majority of users, and their being exposed was leading to excessive breaking of public interfaces for little-to-zero benefit. So for the 1.0 release of the catalog, the following interface changes have been made (but should have no effect on most users):

  - The return type of `CatalogBuilder.build()` now only has the fields `processingEngine` and `router` which is what most users actually consume; the other three fields (`entitiesCatalog`, `locationAnalyzer`, `locationService`) that see very little use have been removed. If you were relying on the presence of either of these in any way, please [open an issue](https://github.com/backstage/backstage/issues/new/choose) that describes your use case, and we'll see how we could fill the gap.

  - The function `createRouter` is removed; use `CatalogBuilder` as follows instead:

    ```ts
    const builder = await CatalogBuilder.create(env);
    // add things as needed, e.g builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
    ```

  - The following types were removed:

    - `CatalogProcessingOrchestrator`
    - `CatalogRule`
    - `CatalogRulesEnforcer`
    - `EntityAncestryResponse`
    - `EntityFacetsRequest`
    - `EntityFacetsResponse`
    - `EntityPagination`
    - `EntityProcessingRequest`
    - `EntityProcessingResult`
    - `EntitiesCatalog`
    - `EntitiesRequest`
    - `EntitiesResponse`
    - `LocationService`
    - `LocationInput`
    - `LocationStore`
    - `PageInfo`
    - `RefreshOptions`
    - `RefreshService`
    - `RouterOptions`

  - The following classes were removed:

    - `DefaultCatalogProcessingOrchestrator`
    - `DefaultCatalogRulesEnforcer`

- 02ad19d189: **BREAKING**: Removed the deprecated `metadata.generation` field entirely. It is no longer present in TS types, nor in the REST API output. Entities that have not yet been re-stitched may still have the field present for some time, but it will get phased out gradually by your catalog instance.
- 7250b6993d: **BREAKING**: Removed the previously deprecated `results` export. Please use `processingResult` instead.
- 077e7c132f: **BREAKING**: Removed the following deprecated symbols:

  - `catalogBuilder.setRefreshInterval`, use `catalogBuilder.setProcessingInterval` instead.
  - `catalogBuilder.setRefreshIntervalSeconds`, use `catalogBuilder.setProcessingIntervalSeconds` instead.
  - `createRandomRefreshInterval`, use `createRandomProcessingInterval` instead.
  - `RefreshIntervalFunction`, use `ProcessingIntervalFunction` instead.

- 74375be2c6: **BREAKING**: Removed the export of the `RecursivePartial` utility type. If you relied on this type it can be redefined like this:

  ```ts
  type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
  };
  ```

- ced3016f2a: **BREAKING**: The deprecated `CatalogEntityDocument` export has been removed, it can be imported from `@backstage/plugin-catalog-common` instead.
- 0163c41be2: **BREAKING**: Removed the deprecated `presence` field from `LocationInput`.
- d3e9ec43b7: **BREAKING**: Removed the `target` property from `EntityRelation`. This field has been replaced by `targetRef`.
  This means that `target: { name: 'team-a', kind: 'group', namespace: 'default' }` is now replaced with `targetRef: 'group:default/team-a'` in entity relations.

  The entities API endpoint still return the old `target` field for to ease transitions, however the future removal of this field will be considered non breaking.

### Patch Changes

- 89c7e47967: Minor README update
- 26fb159a30: Pass in auth token to ancestry endpoint
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- f24ef7864e: Minor typo fixes
- e949d68059: Made sure to move the catalog-related github and ldap config into their right places
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/plugin-scaffolder-common@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.0
  - @backstage/plugin-permission-common@0.5.3
  - @backstage/plugin-permission-node@0.5.5
  - @backstage/plugin-search-common@0.3.2

## 0.24.0

### Minor Changes

- 66ba5d9023: **BREAKING**: Removed `GithubDiscoveryProcessor`, `GithubMultiOrgReaderProcessor`, `GitHubOrgEntityProvider`, `GithubOrgReaderProcessor`, and `GithubMultiOrgConfig` which now instead should be imported from `@backstage/plugin-catalog-backend-module-github`. NOTE THAT the `GithubDiscoveryProcessor` and `GithubOrgReaderProcessor` were part of the default set of processors in the catalog backend, and if you are a user of discovery or location based org ingestion on GitLab, you MUST now add them manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import {
  +  GithubDiscoveryProcessor,
  +  GithubOrgReaderProcessor,
  +} from '@backstage/plugin-catalog-backend-module-github';
  +import {
  +  ScmIntegrations,
  +  DefaultGithubCredentialsProvider
  +} from '@backstage/integration';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  const integrations = ScmIntegrations.fromConfig(config);
  +  const githubCredentialsProvider =
  +    DefaultGithubCredentialsProvider.fromIntegrations(integrations);
  +  builder.addProcessor(
  +    GithubDiscoveryProcessor.fromConfig(config, {
  +      logger,
  +      githubCredentialsProvider,
  +    }),
  +    GithubOrgReaderProcessor.fromConfig(config, {
  +      logger,
  +      githubCredentialsProvider,
  +    }),
  +  );
  ```

  **BREAKING**: Removed `GitLabDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-gitlab`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on GitLab, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `BitbucketDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-bitbucket`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on Bitbucket, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `AzureDevOpsDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-azure`. This processor was not part of the set of default processors. If you were using it, you should already have a reference to it in your backend code and only need to update the import.

  **BREAKING**: Removed the formerly deprecated type `BitbucketRepositoryParser`, which is instead reintroduced in `@backstage/plugin-catalog-backend-module-bitbucket`.

- f115a7f8fd: **BREAKING**: Removed `AwsS3DiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-aws`.
- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 616f02ade2: support Bitbucket Cloud's code search to discover catalog files (multiple per repo, Location entities for existing files only)
- e421d77536: **BREAKING**:

  - Removed the previously deprecated `runPeriodically` export. Please use the `@backstage/backend-tasks` package instead, or copy [the actual implementation](https://github.com/backstage/backstage/blob/02875d4d56708c60f86f6b0a5b3da82e24988354/plugins/catalog-backend/src/util/runPeriodically.ts#L29) into your own code if you explicitly do not want coordination of task runs across your worker nodes.
  - Removed the previously deprecated `CatalogProcessorLocationResult.optional` field. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Related to the previous point, the `processingResult.location` function no longer has a second boolean `optional` argument. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Removed the previously deprecated `StaticLocationProcessor`. It has not been in use for some time; its functionality is covered by `ConfigLocationEntityProvider` instead.

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- c1168bb440: Fixed display of the location in the log message that is printed when entity envelope validation fails.
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-scaffolder-common@0.3.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-catalog-common@0.2.2
  - @backstage/plugin-search-common@0.3.1
  - @backstage/catalog-client@0.9.0
  - @backstage/plugin-permission-node@0.5.4

## 0.24.0-next.0

### Minor Changes

- 66ba5d9023: **BREAKING**: Removed `GitLabDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-gitlab`. NOTE THAT this processor was part of the default set of processors in the catalog backend, and if you are a user of discovery on GitLab, you MUST now add it manually in the catalog initialization code of your backend.

  ```diff
  // In packages/backend/src/plugins/catalog.ts
  +import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
  +  );
  ```

  **BREAKING**: Removed `AzureDevOpsDiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-azure`. This processor was not part of the set of default processors. If you were using it, you should already have a reference to it in your backend code and only need to update the import.

- f115a7f8fd: **BREAKING**: Removed `AwsS3DiscoveryProcessor`, which now instead should be imported from `@backstage/plugin-catalog-backend-module-aws`.
- 55150919ed: - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 616f02ade2: support Bitbucket Cloud's code search to discover catalog files (multiple per repo, Location entities for existing files only)
- e421d77536: **BREAKING**:

  - Removed the previously deprecated `runPeriodically` export. Please use the `@backstage/backend-tasks` package instead, or copy [the actual implementation](https://github.com/backstage/backstage/blob/02875d4d56708c60f86f6b0a5b3da82e24988354/plugins/catalog-backend/src/util/runPeriodically.ts#L29) into your own code if you explicitly do not want coordination of task runs across your worker nodes.
  - Removed the previously deprecated `CatalogProcessorLocationResult.optional` field. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Related to the previous point, the `processingResult.location` function no longer has a second boolean `optional` argument. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
  - Removed the previously deprecated `StaticLocationProcessor`. It has not been in use for some time; its functionality is covered by `ConfigLocationEntityProvider` instead.

- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- c1168bb440: Fixed display of the location in the log message that is printed when entity envelope validation fails.
- b1aacbf96a: Applied the fix for the `/alpha` entry point resolution that was part of the `v0.70.1` release of Backstage.
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-scaffolder-common@0.3.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-catalog-common@0.2.2-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/plugin-permission-node@0.5.4-next.0

## 0.23.1

### Patch Changes

- Marked `GithubMultiOrgReaderProcessor` as stable, as it was moved to `/alpha` by mistake.
- Fixed runtime resolution of the `/alpha` entry point.
- Updated dependencies
  - @backstage/backend-common@0.12.1
  - @backstage/catalog-model@0.12.1
  - @backstage/plugin-catalog-common@0.2.1

## 0.23.0

### Minor Changes

- 0c9cf2822d: **Breaking**: Mark permission-related exports as alpha. This means that the exports below should now be imported from `@backstage/plugin-catalog-backend/alpha` instead of `@backstage/plugin-catalog-backend`.

  - `catalogConditions`
  - `createCatalogPolicyDecision`
  - `permissionRules`
  - `createCatalogPermissionRule`

- 862e416239: **Breaking**: Removed `entityRef` from `CatalogProcessorRelationResult`. The field is not used by the catalog and relation information is already available inside the `reation` property.
- c85292b768: **Breaking**: Removed optional `handleError()` from `CatalogProcessor`. This optional method is never called by the catalog processing engine and can therefore be removed.

### Patch Changes

- 83a83381b0: **DEPRECATED**: The `results` export, and instead adding `processingResult` with the same shape and purpose.
- 83a83381b0: Internal restructuring to collect the various provider files in a `modules` folder while waiting to be externalized
- fc6d31b5c3: Deprecated the `BitbucketRepositoryParser` type.
- 022507c860: A `DefaultCatalogCollatorFactory`, which works with the new stream-based
  search indexing subsystem, is now available. The `DefaultCatalogCollator` will
  continue to be available for those unable to upgrade to the stream-based
  `@backstage/plugin-search-backend-node` (and related packages), however it is now
  marked as deprecated and will be removed in a future version.

  To upgrade this plugin and the search indexing subsystem in one go, check
  [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for necessary changes to your search backend plugin configuration.

- ab7b6cb7b1: **DEPRECATION**: Moved the `CatalogEntityDocument` to `@backstage/plugin-catalog-common` and deprecated the export from `@backstage/plugin-catalog-backend`.

  A new `type` field has also been added to `CatalogEntityDocument` as a replacement for `componentType`, which is now deprecated. Both fields are still present and should be set to the same value in order to avoid issues with indexing.

  Any search customizations need to be updated to use this new `type` field instead, including any custom frontend filters, custom frontend result components, custom search decorators, or non-default Catalog collator implementations.

- cb09096607: Tweaked the wording of the "does not have a location" errors to include the actual missing annotation name, to help users better in fixing their inputs.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- b753d22a56: **DEPRECATION**: Deprecated the `RefreshIntervalFunction` and `createRandomRefreshInterval` in favour of the `ProcessingIntervalFunction` and `createRandomProcessingInterval` type and method respectively. Please migrate to use the new names.

  **DEPRECATION**: Deprecated the `setRefreshInterval` and `setRefreshIntervalSeconds` methods on the `CatalogBuilder` for the new `setProcessingInterval` and `setProcessingIntervalSeconds` methods. Please migrate to use the new names.

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-catalog-common@0.2.0
  - @backstage/integration@0.8.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-node@0.5.3
  - @backstage/search-common@0.3.0
  - @backstage/plugin-scaffolder-common@0.2.3

## 0.22.0

### Minor Changes

- 209fd128e6: The `CodeOwnersProcessor` no longer supports the deprecated SCM-specific location types like `'github/api'`. This is a breaking change but it is unlikely to have an impact, as these location types haven't been supported by the rest of the catalog for a long time.
- 9876e7f172: **BREAKING**: Removed unused `durationText` utility.
- 25e97e7242: **BREAKING**: Removed `AwsOrganizationCloudAccountProcessor` from the default
  set of builtin processors, and instead moved it into its own module
  `@backstage/plugin-catalog-backend-module-aws`.

  If you were using this processor, through making use of the location type
  `aws-cloud-accounts` and/or using the configuration key
  `catalog.processors.awsOrganization`, you will from now on have to add the
  processor manually to your catalog.

  First, add the `@backstage/plugin-catalog-backend-module-aws` dependency to your
  `packages/backend` package.

  Then, in `packages/backend/src/plugins/catalog.ts`:

  ```diff
  +import { AwsOrganizationCloudAccountProcessor } from '@backstage/plugin-catalog-backend-module-aws';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    AwsOrganizationCloudAccountProcessor.fromConfig(
  +      env.config,
  +      { logger: env.logger }
  +    )
  +  );
     // ...
  ```

- e9cf0dd03e: Made the `GitLabDiscoveryProcessor.updateLastActivity` method private, as it was accidentally exposed. It has also been fixed to properly operate in its own cache namespace to avoid collisions with other processors.
- df61ca71dd: Updated all processors to implement `getProcessorName`.

  **BREAKING**: The `CatalogProcessor` interface now require that the `CatalogProcessor` class implements `getProcessorName()`.
  The processor name has previously defaulted processor class name. It's therefore _recommended_ to keep your return the same name as the class name if you did not implement this method previously.

  For example:

  ```ts
  class CustomProcessor implements CatalogProcessor {
    getProcessorName() {
      // Use the same name as the class name if this method was not previously implemented.
      return 'CustomProcessor';
    }
  }
  ```

### Patch Changes

- 919cf2f836: The catalog API now returns entity relations that have three fields: The old
  `type` and `target` fields, as well as a new `targetRef` field. The last one is
  the stringified form of the second one.

  **DEPRECATION**: The `target` field is hereby deprecated, both as seen from the
  catalog API as well as from the `@backstage/catalog-model` package. Both
  `target` and `targetRef` will be produced for some time, but eventually,
  `target` will be removed entirely. Please update your readers to stop consuming
  the `relations.[].target` field from the catalog API as soon as possible.

- 957cb4cb20: Deprecated the `runPeriodically` function which is no longer in use.
- 01e124ea60: Added an `/entity-facets` endpoint, which lets you query the distribution of
  possible values for fields of entities.

  This can be useful for example when populating a dropdown in the user interface,
  such as listing all tag values that are actually being used right now in your
  catalog instance, along with putting the most common ones at the top.

- 082c32f948: Deprecated the second parameter of `results.location()` that determines whether an emitted location is optional. In cases where this is currently being set to `false`, the parameter can simply be dropped, as that is the default. Usage where this was being set to `true` should be migrated to set the `presence` option of the emitted location to `optional`. For example:

  ```ts
  results.location(
    {
      type: 'url',
      target: 'http://example.com/foo',
    },
    true,
  );

  // migrated to

  results.location({
    type: 'url',
    target: 'http://example.com/foo',
    presence: 'optional',
  });
  ```

- ed09ad8093: Added `LocationSpec`, which was moved over from `@backstage/catalog-model`.

  Added `LocationInput`, which replaced `LocationSpec` where it was used in the `LocationService` and `LocationStore` interfaces. The `LocationInput` type deprecates the `presence` field, which was not being used in those contexts.

- 6d994fd9da: Cleanup catalog-backend API report.
- 7010349c9a: Added `EntityRelationSpec`, which was moved over from `@backstage/catalog-model`.
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- 420f8d710f: Removed the `processors.githubOrg` config section which is unused and has been replaced by the integrations config.
- b1296f1f57: Deprecated `StaticLocationProcessor` which is unused and replaced by `ConfigLocationEntityProvider`.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-scaffolder-common@0.2.2
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-permission-node@0.5.2
  - @backstage/integration@0.7.5

## 0.21.5

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/search-common@0.2.4
  - @backstage/types@0.1.3
  - @backstage/plugin-catalog-common@0.1.4
  - @backstage/plugin-permission-common@0.5.1
  - @backstage/plugin-permission-node@0.5.1
  - @backstage/plugin-scaffolder-common@0.2.1

## 0.21.4

### Patch Changes

- 379da9fb1d: The following processors now properly accept an `ScmIntegrationRegistry` (an
  interface) instead of an `ScmIntegrations` (which is a concrete class).

  - `AzureDevOpsDiscoveryProcessor`
  - `CodeOwnersProcessor`
  - `GitLabDiscoveryProcessor`
  - `GithubDiscoveryProcessor`
  - `GithubMultiOrgReaderProcessor`
  - `GithubOrgReaderProcessor`

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- ca1d6c1788: Support "dependencyOf" relation in Resource entities
- 244d24ebc4: Import `Location` from the `@backstage/catalog-client` package.
- e483dd6c72: Update internal `Location` validation.
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- b590e9b58d: Optimized entity provider mutations with large numbers of new additions, such as big initial startup commits
- Updated dependencies
  - @backstage/plugin-scaffolder-common@0.2.0
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3
  - @backstage/types@0.1.2
  - @backstage/plugin-catalog-common@0.1.3
  - @backstage/plugin-permission-node@0.5.0

## 0.21.3

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-permission-node@0.4.3

## 0.21.3-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-permission-node@0.4.3-next.0

## 0.21.2

### Patch Changes

- fac5f112b4: chore(deps): bump `prom-client` from 13.2.0 to 14.0.1
- 5bbffa60be: Pass authorization token to location service inside location api routes
- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-permission-node@0.4.2

## 0.21.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@0.1.2-next.0
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-permission-node@0.4.2-next.1

## 0.21.2-next.0

### Patch Changes

- fac5f112b4: chore(deps): bump `prom-client` from 13.2.0 to 14.0.1
- 5bbffa60be: Pass authorization token to location service inside location api routes
- Updated dependencies
  - @backstage/plugin-permission-node@0.4.2-next.0

## 0.21.1

### Patch Changes

- 4f5bde47e9: Add support for permissions to the DefaultCatalogCollator.
- Updated dependencies
  - @backstage/search-common@0.2.2
  - @backstage/backend-common@0.10.5
  - @backstage/plugin-permission-node@0.4.1

## 0.21.0

### Minor Changes

- 9f2a8dc423: **BREAKING**: Removed all remnants of the old catalog engine implementation.

  The old implementation has been deprecated for over half a year. To ensure that
  you are not using the old implementation, check that your
  `packages/backend/src/plugins/catalog.ts` creates the catalog builder using
  `CatalogBuilder.create`. If you instead call `new CatalogBuilder`, you are on
  the old implementation and will experience breakage if you upgrade to this
  version. If you are still on the old version, see [the relevant change log
  entry](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/CHANGELOG.md#patch-changes-27)
  for migration instructions.

  The minimal `packages/backend/src/plugins/catalog.ts` file is now:

  ```ts
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
  ```

  The following classes and interfaces have been removed:

  - The `CatalogBuilder` constructor (see above; use `CatalogBuilder.create`
    instead)
  - `AddLocationResult`
  - `CommonDatabase`
  - `CreateDatabaseOptions`
  - `createNextRouter` (use `createRouter` instead - or preferably, use the
    `router` field returned for you by `catalogBuilder.build()`)
  - `Database`
  - `DatabaseEntitiesCatalog` (use `EntitiesCatalog` instead)
  - `DatabaseLocationsCatalog` (use `LocationService` instead)
  - `DatabaseLocationUpdateLogEvent`
  - `DatabaseLocationUpdateLogStatus`
  - `DatabaseManager`
  - `DbEntitiesRequest`
  - `DbEntitiesResponse`
  - `DbEntityRequest`
  - `DbEntityResponse`
  - `DbLocationsRow`
  - `DbLocationsRowWithStatus`
  - `DbPageInfo`
  - `EntitiesCatalog.batchAddOrUpdateEntities` (was only used by the legacy
    engine)
  - `EntityUpsertRequest`
  - `EntityUpsertResponse`
  - `HigherOrderOperation`
  - `HigherOrderOperations`
  - `LocationReader`
  - `LocationReaders`
  - `LocationResponse`
  - `LocationsCatalog`
  - `LocationUpdateLogEvent`
  - `LocationUpdateStatus`
  - `NextCatalogBuilder` (use `CatalogBuilder.create` instead)
  - `NextRouterOptions` (use `RouterOptions` instead)
  - `ReadLocationEntity`
  - `ReadLocationError`
  - `ReadLocationResult`
  - `Transaction`

  The `RouterOptions` interface has been un-deprecated, and has instead found use
  for passing into `createRouter`. Its shape has been significantly changed to
  accommodate the new router.

### Patch Changes

- e15ce5c16e: Integrate authorization into the delete entities endpoint
- dce98a92f7: Now when entities are deleted, the parent entity state is updated such that it will "heal" accidental deletes on the next refresh round.
- 02687954ca: Fixed a typo and made a little clarification to a warning message
- 48248e2db5: Integrate permissions into entity ancestry endpoint in catalog-backend
- 68edbbeafd: Fix bug with resource loading in permission integration
- 7e38acaa9e: Integrate permissions into catalog-backend location endpoints
- 6680853e0c: Export conditional permission policy helpers from catalog-backend
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-permission-node@0.4.0
  - @backstage/plugin-catalog-common@0.1.1
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.21.0-next.0

### Minor Changes

- 9f2a8dc423: **BREAKING**: Removed all remnants of the old catalog engine implementation.

  The old implementation has been deprecated for over half a year. To ensure that
  you are not using the old implementation, check that your
  `packages/backend/src/plugins/catalog.ts` creates the catalog builder using
  `CatalogBuilder.create`. If you instead call `new CatalogBuilder`, you are on
  the old implementation and will experience breakage if you upgrade to this
  version. If you are still on the old version, see [the relevant change log
  entry](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/CHANGELOG.md#patch-changes-27)
  for migration instructions.

  The minimal `packages/backend/src/plugins/catalog.ts` file is now:

  ```ts
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(new ScaffolderEntitiesProcessor());
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
  ```

  The following classes and interfaces have been removed:

  - The `CatalogBuilder` constructor (see above; use `CatalogBuilder.create`
    instead)
  - `AddLocationResult`
  - `CommonDatabase`
  - `CreateDatabaseOptions`
  - `createNextRouter` (use `createRouter` instead - or preferably, use the
    `router` field returned for you by `catalogBuilder.build()`)
  - `Database`
  - `DatabaseEntitiesCatalog` (use `EntitiesCatalog` instead)
  - `DatabaseLocationsCatalog` (use `LocationService` instead)
  - `DatabaseLocationUpdateLogEvent`
  - `DatabaseLocationUpdateLogStatus`
  - `DatabaseManager`
  - `DbEntitiesRequest`
  - `DbEntitiesResponse`
  - `DbEntityRequest`
  - `DbEntityResponse`
  - `DbLocationsRow`
  - `DbLocationsRowWithStatus`
  - `DbPageInfo`
  - `EntitiesCatalog.batchAddOrUpdateEntities` (was only used by the legacy
    engine)
  - `EntityUpsertRequest`
  - `EntityUpsertResponse`
  - `HigherOrderOperation`
  - `HigherOrderOperations`
  - `LocationReader`
  - `LocationReaders`
  - `LocationResponse`
  - `LocationsCatalog`
  - `LocationUpdateLogEvent`
  - `LocationUpdateStatus`
  - `NextCatalogBuilder` (use `CatalogBuilder.create` instead)
  - `NextRouterOptions` (use `RouterOptions` instead)
  - `ReadLocationEntity`
  - `ReadLocationError`
  - `ReadLocationResult`
  - `Transaction`

  The `RouterOptions` interface has been un-deprecated, and has instead found use
  for passing into `createRouter`. Its shape has been significantly changed to
  accommodate the new router.

### Patch Changes

- e15ce5c16e: Integrate authorization into the delete entities endpoint
- dce98a92f7: Now when entities are deleted, the parent entity state is updated such that it will "heal" accidental deletes on the next refresh round.
- 02687954ca: Fixed a typo and made a little clarification to a warning message
- 48248e2db5: Integrate permissions into entity ancestry endpoint in catalog-backend
- 68edbbeafd: Fix bug with resource loading in permission integration
- 2b27e49eb1: Internal update to match status field changes in `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.4.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-permission-node@0.4.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-catalog-common@0.1.1-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0

## 0.20.0

### Minor Changes

- cd529c4094: In order to integrate the permissions system with the refresh endpoint in catalog-backend, a new AuthorizedRefreshService was created as a thin wrapper around the existing refresh service which performs authorization and handles the case when authorization is denied. In order to instantiate AuthorizedRefreshService, a permission client is required, which was added as a new field to `CatalogEnvironment`.

  The new `permissions` field in `CatalogEnvironment` should already receive the permission client from the `PluginEnvrionment`, so there should be no changes required to the catalog backend setup. See [the create-app changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md) for more details.

### Patch Changes

- 0ae759dad4: Add catalog permission rules.
- 3b4d8caff6: Allow a custom GithubCredentialsProvider to be passed to the GitHub processors.
- 6fd70f8bc8: Provide support for Bitbucket servers with custom BaseURLs.
- 5333451def: Cleaned up API exports
- 730d01ab1a: Add apply-conditions endpoint for evaluating conditional permissions in catalog backend.
- 0a6c68582a: Add authorization to catalog-backend entities GET endpoints
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-permission-node@0.3.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/plugin-permission-common@0.3.1

## 0.19.4

### Patch Changes

- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- 3a63491c5f: Filter out projects with missing `default_branch` from GitLab Discovery.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/integration@0.7.0

## 0.19.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3

## 0.19.2

### Patch Changes

- 3368f27aef: Fixed the handling of optional locations so that the catalog no longer logs `NotFoundError`s for missing optional locations.
- Updated dependencies
  - @backstage/backend-common@0.9.14
  - @backstage/catalog-model@0.9.8

## 0.19.1

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- 6bccc7d794: The `pagedRequest` method in the GitLab ingestion client is now public for re-use and may be used to make other calls to the GitLab API. Developers can now pass in a type into the GitLab `paginated` and `pagedRequest` functions as generics instead of forcing `any` (defaults to `any` to maintain compatibility). The `GitLabClient` now provides a `isSelfManaged` convenience method.
- 0e4daaa753: Reject catalog entities that have duplicate fields that vary only in casing.
- 98a9c35f0c: Honor database migration configuration
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.19.0

### Minor Changes

- 905dd952ac: **BREAKING** `DefaultCatalogCollator` has a new required option `tokenManager`. See the create-app changelog for how to create a `tokenManager` and add it to the `PluginEnvironment`. It can then be passed to the collator in `createPlugin`:

  ```diff
  // packages/backend/src/plugins/search.ts

  ...
  export default async function createPlugin({
    ...
  + tokenManager,
  }: PluginEnvironment) {
    ...

    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: DefaultCatalogCollator.fromConfig(config, {
        discovery,
  +     tokenManager,
      }),
    });

    ...
  }
  ```

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/backend-common@0.9.12

## 0.18.0

### Minor Changes

- 7f82ce9f51: **BREAKING** EntitiesSearchFilter fields have changed.

  EntitiesSearchFilter now has only two fields: `key` and `value`. The `matchValueIn` and `matchValueExists` fields are no longer are supported. Previous filters written using the `matchValueIn` and `matchValueExists` fields can be rewritten as follows:

  Filtering by existence of key only:

  ```diff
    filter: {
      {
        key: 'abc',
  -     matchValueExists: true,
      },
    }
  ```

  Filtering by key and values:

  ```diff
    filter: {
      {
        key: 'abc',
  -     matchValueExists: true,
  -     matchValueIn: ['xyz'],
  +     values: ['xyz'],
      },
    }
  ```

  Negation of filters can now be achieved through a `not` object:

  ```
  filter: {
    not: {
      key: 'abc',
      values: ['xyz'],
    },
  }
  ```

### Patch Changes

- 740f958290: Providing an empty values array in an EntityFilter will now return no matches.
- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- eddb82ab7c: Index User entities by displayName to be able to search by full name. Added displayName (if present) to the 'text' field in the indexed document.
- 563b039f0b: Added Azure DevOps discovery processor
- 8866b62f3d: Detect a duplicate entities when adding locations through dry run
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.17.4

### Patch Changes

- 5d2a7303bd: This fixes a bug where locations couldn't be added unless the processing engine is started.
  It's now possible to run the catalog backend without starting the processing engine and still allowing locations registrations.

  This is done by refactor the `EntityProvider.connect` to happen outside the engine.

- 06934f2f52: Adjust entity query construction to ensure sub-queries are always isolated from one another.
- b90fc74d70: adds getDefaultProcessor method to CatalogBuilder
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10

## 0.17.3

### Patch Changes

- 86bef79ad1: Allow singleton and flexibly nested EntityFilters
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/catalog-client@0.5.1

## 0.17.2

### Patch Changes

- b9ce1ce2c1: Allow custom LocationAnalyzer in NextCatalogBuilder
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1

## 0.17.1

### Patch Changes

- 3adaf88db2: Take CatalogParser in account when processing file locations.
- 1f62d1cbe9: Minor rearrangement of `Stitcher` to clarify the scope of one stitch round
- 3ba87f514e: Add a `GitHubOrgEntityProvider` that can be used instead of the `GithubOrgReaderProcessor`.
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- 177401b571: Use entity title (if defined) as title of documents indexed by `DefaultCatalogCollator`
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.17.0

### Minor Changes

- 9fb9256e50: This continues the deprecation of classes used by the legacy catalog engine. New deprecations can be viewed in this [PR](https://github.com/backstage/backstage/pull/7500) or in the API reference documentation.

  The `batchAddOrUpdateEntities` method of the `EntitiesCatalog` interface has been marked as optional and is being deprecated. It is still implemented and required to be implemented by the legacy catalog classes, but was never implemented in the new catalog.

  This change is only relevant if you are consuming the `EntitiesCatalog` interface directly, in which case you will get a type error that you need to resolve. It can otherwise be ignored.

### Patch Changes

- 3b59bb915e: Fixes a bug in the catalog where entities were not being marked as orphaned.
- 55ff928d50: This change refactors the internal package structure to remove the `next` catalog folder that was used during the implementation and testing phase of the new catalog engine. The implementation is now the default and is therefore restructured to no longer be packaged under `next/`. This refactor does not change catalog imports from other parts of the project.
- Updated dependencies
  - @backstage/integration@0.6.8

## 0.16.0

### Minor Changes

- 2c5bab2f82: Errors emitted from processors are now considered a failure during entity processing and will prevent entities from being updated. The impact of this change is that when errors are emitted while for example reading a location, then ingestion effectively stops there. If you emit a number of entities along with just one error, then the error will be persisted on the current entity but the emitted entities will _not_ be stored. This fixes [a bug](https://github.com/backstage/backstage/issues/6973) where entities would get marked as orphaned rather than put in an error state when the catalog failed to read a location.

  In previous versions of the catalog, an emitted error was treated as a less severe problem than an exception thrown by the processor. We are now ensuring that the behavior is consistent for these two cases. Even though both thrown and emitted errors are treated the same, emitted errors stay around as they allow you to highlight multiple errors related to an entity at once. An emitted error will also only prevent the writing of the processing result, while a thrown error will skip the rest of the processing steps.

### Patch Changes

- 957e4b3351: Updated dependencies
- f66c38148a: Avoid duplicate logging of entity processing errors.
- 426d5031a6: A number of classes and types, that were part of the old catalog engine implementation, are now formally marked as deprecated. They will be removed entirely from the code base in a future release.

  After upgrading to this version, it is recommended that you take a look inside your `packages/backend/src/plugins/catalog.ts` file (using a code editor), to see if you are using any functionality that it marks as deprecated. If you do, please migrate away from it at your earliest convenience.

  Migrating to using the new engine implementation is typically a matter of calling `CatalogBuilder.create({ ... })` instead of `new CatalogBuilder({ ... })`.

  If you are seeing deprecation warnings for `createRouter`, you can either use the `router` field from the return value from updated catalog builder, or temporarily call `createNextRouter`. The latter will however also be deprecated at a later time.

- 7b78dd17e6: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.15.0

### Minor Changes

- 1572d02b63: Introduced a new `CatalogProcessorCache` that is available to catalog processors. It allows arbitrary values to be saved that will then be visible during the next run. The cache is scoped to each individual processor and entity, but is shared across processing steps in a single processor.

  The cache is available as a new argument to each of the processing steps, except for `validateEntityKind` and `handleError`.

  This also introduces an optional `getProcessorName` to the `CatalogProcessor` interface, which is used to provide a stable identifier for the processor. While it is currently optional it will move to be required in the future.

  The breaking part of this change is the modification of the `state` field in the `EntityProcessingRequest` and `EntityProcessingResult` types. This is unlikely to have any impact as the `state` field was previously unused, but could require some minor updates.

- c1836728e0: Add `/entities/by-name/:kind/:namespace/:name/ancestry` to get the "processing parents" lineage of an entity.

  This involves a breaking change of adding the method `entityAncestry` to `EntitiesCatalog`.

### Patch Changes

- 3d10360c82: When issuing a `full` update from an entity provider, entities with updates are now properly persisted.
- 9ea4565b00: Fixed a bug where internal references within the catalog were broken when new entities where added through entity providers, such as registering a new location or adding one in configuration. These broken references then caused some entities to be incorrectly marked as orphaned and prevented refresh from working properly.
- Updated dependencies
  - @backstage/backend-common@0.9.5
  - @backstage/integration@0.6.6

## 0.14.0

### Minor Changes

- d6f90e934d: #### Enforcing catalog rules

  Apply the catalog rules enforcer, based on origin location.

  This is a breaking change, in the sense that this was not properly checked in earlier versions of the new catalog engine. You may see ingestion of certain entities start to be rejected after this update, if the following conditions apply to you:

  - You are using the configuration key `catalog.rules.[].allow`, and
  - Your registered locations point (directly or transitively) to entities whose kinds are not listed in `catalog.rules.[].allow`

  and/or

  - You are using the configuration key `catalog.locations.[].rules.[].allow`
  - The config locations point (directly or transitively) to entities whose kinds are not listed neither `catalog.rules.[].allow`, nor in the corresponding `.rules.[].allow` of that config location

  This is an example of what the configuration might look like:

  ```yaml
  catalog:
    # These do not list Template as a valid kind; users are therefore unable to
    # manually register entities of the Template kind
    rules:
      - allow:
          - Component
          - API
          - Resource
          - Group
          - User
          - System
          - Domain
          - Location
    locations:
      # This lists Template as valid only for that specific config location
      - type: file
        target: ../../plugins/scaffolder-backend/sample-templates/all-templates.yaml
        rules:
          - allow: [Template]
  ```

  If you are not using any of those `rules` section, you should not be affected by this change.

  If you do use any of those `rules` sections, make sure that they are complete and list all of the kinds that are in active use in your Backstage installation.

  #### Other

  Also, the class `CatalogRulesEnforcer` was renamed to `DefaultCatalogRulesEnforcer`, implementing the type `CatalogRulesEnforcer`.

- 501ce92f9c: Bitbucket Cloud Discovery support
- 89fd81a1ab: Add API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `RefreshService` is passed to `createRouter`.

  The new method is used to trigger a refresh of an entity in an as localized was as possible, usually by refreshing the parent location.

### Patch Changes

- 9ef2987a83: Update `createLocation` to optionally return `exists` to signal that the location already exists, this is only returned for dry runs.
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.13.8

### Patch Changes

- fab79adde1: Add AWS S3 Discovery Processor. Add readTree() to AwsS3UrlReader. Add ReadableArrayResponse type that implements ReadTreeResponse to use in AwsS3UrlReader's readTree()
- a41ac6b952: Fill in most missing type exports.
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.13.7

### Patch Changes

- ce17a1693: Allow the catalog search collator to filter the entities that it indexes
- dbb952787: Use `ScmIntegrationRegistry#resolveUrl` in the placeholder processors instead of a custom implementation.

  If you manually instantiate the `PlaceholderProcessor` (you most probably don't), add the new required constructor parameter:

  ```diff
  + import { ScmIntegrations } from '@backstage/integration';
    // ...
  + const integrations = ScmIntegrations.fromConfig(config);
    // ...
    new PlaceholderProcessor({
      resolvers: placeholderResolvers,
      reader,
  +   integrations,
    });
  ```

  All custom `PlaceholderResolver` can use the new `resolveUrl` parameter to resolve relative URLs.

- 1797c5ce5: This change drops support for deprecated location types which have all been replaced by the `url` type.
  There has been a deprecation warning in place since the beginning of this year so most should already be migrated and received information at this point.

  The now removed location types are:

  ```
  github
  github/api
  bitbucket/api
  gitlab/api
  azure/api
  ```

- Updated dependencies
  - @backstage/catalog-client@0.3.19
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2

## 0.13.6

### Patch Changes

- 4d62dc15b: GitHub discovery processor passes over repositories that do not have a default branch
- 977b1dfbe: Adds optional namespacing for users in the GitHub Multi Org Plugin
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/plugin-search-backend-node@0.4.2
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.13.5

### Patch Changes

- 8b39242c4: GitHub discovery processor adds support for discovering the default GitHub branch
- 96785dce3: Added GitLabDiscoveryProcessor, which allows catalog discovery from a GitLab instance
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.13.4

### Patch Changes

- 7ab55167d: Properly handle Date objects being returned for timestamps in the database driver

## 0.13.3

### Patch Changes

- 61aa6526f: Avoid duplicate work by comparing previous processing rounds with the next
- fe960ad0f: Updates the `DefaultProcessingDatabase` to accept a refresh interval function instead of a fixed refresh interval in seconds which used to default to 100s. The catalog now ships with a default refresh interval function that schedules entities for refresh every 100-150 seconds, this should
  help to smooth out bursts that occur when a lot of entities are scheduled for refresh at the same second.

  Custom `RefreshIntervalFunction` can be implemented and passed to the CatalogBuilder using `.setInterval(fn)`

- 54b441abe: Export the entity provider related types for external use.
- 03bb05af6: Enabled live reload of locations configured in `catalog.locations`.
- 2766b2aa5: Add experimental Prometheus metrics instrumentation to the catalog
- Updated dependencies
  - @backstage/backend-common@0.8.10
  - @backstage/config@0.1.7
  - @backstage/integration@0.6.1

## 0.13.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9

## 0.13.1

### Patch Changes

- 11c370af2: Support filtering entities via property existence. For example you can now query with `/entities?filter=metadata.annotations.blah` to fetch all entities that has the particular property defined.
- Updated dependencies
  - @backstage/catalog-client@0.3.18

## 0.13.0

### Minor Changes

- 8bfc0571c: Add a default catalog value for BitBucketDiscoveryProcessor. This allows to have a target like so: `https://bitbucket.mycompany.com/projects/backstage/repos/service-*`
  which will be expanded to `https://bitbucket.mycompany.com/projects/backstage/repos/service-a/catalog-info.yaml` given that repository 'service-a' exists.

  ## Migration

  If you are using a custom [Bitbucket parser](https://backstage.io/docs/integrations/bitbucket/discovery#custom-repository-processing) and your `bitbucket-discovery` target (e.g. in your app-config.yaml) omits the catalog path in any of the following ways:

  - `https://bitbucket.mycompany.com/projects/backstage/repos/service-*`
  - `https://bitbucket.mycompany.com/projects/backstage/repos/*`
  - `https://bitbucket.mycompany.com/projects/backstage/repos/*/`

  then you will be affected by this change.
  The 'target' input to your parser before this commit would be '/', and after this commit it will be '/catalog-info.yaml', and as such needs to be handled to maintain the same functionality.

### Patch Changes

- 8b048934b: The codeowners processor extracts the username of the primary owner and uses this as the owner field.
  Given the kind isn't specified this is assumed to be a group and so the link to the owner in the about card
  doesn't work. This change specifies the kind where the entity is a user. e.g:

  `@iain-b` -> `user:iain-b`

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/plugin-search-backend-node@0.4.0

## 0.12.0

### Minor Changes

- 60e830222: Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

  If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

  The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

  Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

  ```diff
  - import {
  -  DockerContainerRunner,
  -  SingleHostDiscovery,
  - } from '@backstage/backend-common';
  + import { DockerContainerRunner } from '@backstage/backend-common';
    import { CatalogClient } from '@backstage/catalog-client';
  - import {
  -   CookieCutter,
  -   CreateReactAppTemplater,
  -   createRouter,
  -   Preparers,
  -   Publishers,
  -   Templaters,
  - } from '@backstage/plugin-scaffolder-backend';
  + import { createRouter } from '@backstage/plugin-scaffolder-backend';
    import Docker from 'dockerode';
    import { Router } from 'express';
    import type { PluginEnvironment } from '../types';

    export default async function createPlugin({
      config,
      database,
      reader,
  +   discovery,
    }: PluginEnvironment): Promise<Router> {
      const dockerClient = new Docker();
      const containerRunner = new DockerContainerRunner({ dockerClient });

  -   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const templaters = new Templaters();

  -   templaters.register('cookiecutter', cookiecutterTemplater);
  -   templaters.register('cra', craTemplater);
  -
  -   const preparers = await Preparers.fromConfig(config, { logger });
  -   const publishers = await Publishers.fromConfig(config, { logger });

  -   const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
  -     preparers,
  -     templaters,
  -     publishers,
  +     containerRunner,
        logger,
        config,
        database,

  ```

### Patch Changes

- f7134c368: bump sqlite3 to 5.0.1
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- 2d41b6993: Make use of the new `readUrl` method on `UrlReader` from `@backstage/backend-common`.
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/plugin-search-backend-node@0.3.0
  - @backstage/catalog-client@0.3.16

## 0.11.0

### Minor Changes

- 45af985df: Handle entity name conflicts in a deterministic way and avoid crashes due to naming conflicts at startup.

  This is a breaking change for the database and entity provider interfaces of the new catalog. The interfaces with breaking changes are `EntityProvider` and `ProcessingDatabase`, and while it's unlikely that these interfaces have much usage yet, a migration guide is provided below.

  The breaking change to the `EntityProvider` interface lies within the items passed in the `EntityProviderMutation` type. Rather than passing along entities directly, they are now wrapped up in a `DeferredEntity` type, which is a tuple of an `entity` and a `locationKey`. The `entity` houses the entity as it was passed on before, while the `locationKey` is a new concept that is used for conflict resolution within the catalog.

  The `locationKey` is an opaque string that should be unique for each location that an entity could be located at, and undefined if the entity does not have a fixed location. In practice it should be set to the serialized location reference if the entity is stored in Git, for example `https://github.com/backstage/backstage/blob/master/catalog-info.yaml`. A conflict between two entity definitions happen when they have the same entity reference, i.e. kind, namespace, and name. In the event of a conflict the location key will be used according to the following rules to resolve the conflict:

  - If the entity is already present in the database but does not have a location key set, the new entity wins and will override the existing one.
  - If the entity is already present in the database the new entity will only win if the location keys of the existing and new entity are the same.
  - If the entity is not already present, insert the entity into the database along with the provided location key.

  The breaking change to the `ProcessingDatabase` is similar to the one for the entity provider, as it reflects the switch from `Entity` to `DeferredEntity` in the `ReplaceUnprocessedEntitiesOptions`. In addition, the `addUnprocessedEntities` method has been removed from the `ProcessingDatabase` interface, and the `RefreshStateItem` and `UpdateProcessedEntityOptions` types have received a new optional `locationKey` property.

- 8e533f92c: Move `LdapOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-ldap`.

  The `LdapOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-ldap` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    LdapOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-ldap` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-ldap/README.md).

### Patch Changes

- 22a60518c: Support ingesting multiple GitHub organizations via a new `GithubMultiOrgReaderProcessor`.

  This new processor handles namespacing created groups according to the org of the associated GitHub team to prevent potential name clashes between organizations. Be aware that this processor is considered alpha and may not be compatible with future org structures in the catalog.

  NOTE: This processor only fully supports auth via GitHub Apps

  To install this processor, import and add it as follows:

  ```typescript
  // Typically in packages/backend/src/plugins/catalog.ts
  import { GithubMultiOrgReaderProcessor } from '@backstage/plugin-catalog-backend';
  // ...
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    builder.addProcessor(
      GithubMultiOrgReaderProcessor.fromConfig(env.config, {
        logger: env.logger,
      }),
    );
    // ...
  }
  ```

  Configure in your `app-config.yaml` by pointing to your GitHub instance and optionally list which GitHub organizations you wish to import. You can also configure what namespace you want to set for teams from each org. If unspecified, the org name will be used as the namespace. If no organizations are listed, by default this processor will import from all organizations accessible by all configured GitHub Apps:

  ```yaml
  catalog:
    locations:
      - type: github-multi-org
        target: https://github.myorg.com
        rules:
          - allow: [User, Group]

    processors:
      githubMultiOrg:
        orgs:
          - name: fooOrg
            groupNamespace: foo
          - name: barOrg
            groupNamespace: bar
          - name: awesomeOrg
          - name: anotherOrg
  ```

- d408af872: Only return the selected fields from the new catalog.
- aa2b15d9d: Ensure that emitted relations are deduplicated
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.10.4

### Patch Changes

- 127048f92: Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
  to `@backstage/plugin-catalog-backend-module-msgraph`.

  The `MicrosoftGraphOrgReaderProcessor` isn't registered by default anymore, if
  you want to continue using it you have to register it manually at the catalog
  builder:

  1. Add dependency to `@backstage/plugin-catalog-backend-module-msgraph` to the `package.json` of your backend.
  2. Add the processor to the catalog builder:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(config, {
      logger,
    }),
  );
  ```

  For more configuration details, see the [README of the `@backstage/plugin-catalog-backend-module-msgraph` package](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md).

- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- Updated dependencies
  - @backstage/catalog-client@0.3.14
  - @backstage/plugin-search-backend-node@0.2.2
  - @backstage/catalog-model@0.8.4

## 0.10.3

### Patch Changes

- b45e29410: This release enables the new catalog processing engine which is a major milestone for the catalog!

  This update makes processing more scalable across multiple instances, adds support for deletions and ui flagging of entities that are no longer referenced by a location.

  **Changes Required** to `catalog.ts`

  ```diff
  -import { useHotCleanup } from '@backstage/backend-common';
   import {
     CatalogBuilder,
  -  createRouter,
  -  runPeriodically
  +  createRouter
   } from '@backstage/plugin-catalog-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  -  const builder = new CatalogBuilder(env);
  +  const builder = await CatalogBuilder.create(env);
     const {
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
  +    processingEngine,
       locationAnalyzer,
     } = await builder.build();

  -  useHotCleanup(
  -    module,
  -    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
  -  );
  +  await processingEngine.start();

     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
  -    higherOrderOperation,
  +    locationService,
       locationAnalyzer,
       logger: env.logger,
       config: env.config,
  ```

  As this is a major internal change we have taken some precaution by still allowing the old catalog to be enabled by keeping your `catalog.ts` in it's current state.
  If you encounter any issues and have to revert to the previous catalog engine make sure to raise an issue immediately as the old catalog engine is deprecated and will be removed in a future release.

- 72fbf4372: Switches the default catalog processing engine to use a batched streaming task execution strategy for higher parallelism.
- 18ab535c8: Rely on `SELECT ... FOR UPDATE SKIP LOCKED` where available in order to speed up processing item acquisition and reduce work duplication.
- db17fd734: Make refresh interval configurable for the `NextCatalogBuilder` using `.setRefreshIntervalSeconds()`.

  Change `DefaultProcessingDatabase` constructor to accept an options object instead of individual arguments.

- cb09e445e: Implement `NextCatalogBuilder.addEntityProvider`
- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/plugin-search-backend-node@0.2.1
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.10.2

### Patch Changes

- 9c63be545: Restructure the next catalog types and files a bit
- Updated dependencies [92963779b]
- Updated dependencies [27a9b503a]
- Updated dependencies [70bc30c5b]
- Updated dependencies [db1c8f93b]
- Updated dependencies [5aff84759]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/search-common@0.1.2
  - @backstage/plugin-search-backend-node@0.2.0
  - @backstage/integration@0.5.6

## 0.10.1

### Patch Changes

- e7a5a3474: Only validate the envelope for emitted entities, and defer full validation to when they get processed later on.
- 63a432e9c: Skip deletion of bootstrap location when running the new catalog.
- f46a9e82d: Move dependency to `@microsoft/microsoft-graph-types` from `@backstage/plugin-catalog`
  to `@backstage/plugin-catalog-backend`.
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.10.0

### Minor Changes

- 0fd4ea443: Updates the `GithubCredentialsProvider` to return the token type, it can either be `token` or `app` depending on the authentication method.

  Update the `GithubOrgReaderProcessor` NOT to query for email addresses if GitHub Apps is used for authentication, this is due to inconsistencies in the GitHub API when using server to server communications and installation tokens. See [this community discussion](https://github.community/t/api-v4-unable-to-retrieve-email-resource-not-accessible-by-integration/13831/4) for more info.

  **Removes** deprecated GithubOrgReaderProcessor provider configuration(`catalog.processors.githubOrg`). If you're using the deprecated config section make sure to migrate to [integrations](https://backstage.io/docs/integrations/github/locations) instead.

### Patch Changes

- add62a455: Foundation for standard entity status values
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.9.1

### Patch Changes

- 50a5348b7: Fix error handling in `LdapOrgReaderProcessor`, and support complex paging options
- 1b8e28aed: Resolve the `target` for glob `file` locations correctly
- dcd5a93a9: Correctly add `<source>/project-slug` annotation for new catalog-info.yaml PRs based on SCM integration.
- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 62579ced6: Skip adding entries to the `entities_search` table if their `key` exceeds a length limit.
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.9.0

### Minor Changes

- 9a207f052: Port `GithubOrgReaderProcessor` to support configuration via
  [`integrations`](https://backstage.io/docs/integrations/github/locations) in
  addition to [`catalog.processors.githubOrg.providers`](https://backstage.io/docs/integrations/github/org#configuration).
  The `integrations` package supports authentication with both personal access
  tokens and GitHub apps.

  This deprecates the `catalog.processors.githubOrg.providers` configuration.
  A [`integrations` configuration](https://backstage.io/docs/integrations/github/locations)
  for the same host takes precedence over the provider configuration.
  You might need to add additional scopes for the credentials.

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.8.2

### Patch Changes

- b219821a0: Expose `BitbucketRepositoryParser` introduced in [#5295](https://github.com/backstage/backstage/pull/5295)
- 227439a72: Add support for non-organization accounts in GitHub Discovery
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.8.1

### Patch Changes

- a99e0bc42: Entity lifecycle and owner are now indexed by the `DefaultCatalogCollator`. A `locationTemplate` may now optionally be provided to its constructor to reflect a custom catalog entity path in the Backstage frontend.
- Updated dependencies [e1e757569]
  - @backstage/plugin-search-backend-node@0.1.4

## 0.8.0

### Minor Changes

- 5fe62f124: Fix the schema / code mismatch in LDAP `set` config

### Patch Changes

- 09b5fcf2e: GithubDiscoveryProcessor now excludes archived repositories so they won't be added to Backstage.
- c2306f898: Externalize repository processing for BitbucketDiscoveryProcessor.

  Add an extension point where you can customize how a matched Bitbucket repository should
  be processed. This can for example be used if you want to generate the catalog-info.yaml
  automatically based on other files in a repository, while taking advantage of the
  build-in repository crawling functionality.

  `BitbucketDiscoveryProcessor.fromConfig` now takes an optional parameter `options.parser` where
  you can customize the logic for each repository found. The default parser has the same
  behaviour as before, where it emits an optional location for the matched repository
  and lets the other processors take care of further processing.

  ```typescript
  const customRepositoryParser: BitbucketRepositoryParser =
    async function* customRepositoryParser({ client, repository }) {
      // Custom logic for interpret the matching repository.
      // See defaultRepositoryParser for an example
    };

  const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
    parser: customRepositoryParser,
    logger: env.logger,
  });
  ```

- Updated dependencies [94da20976]
- Updated dependencies [b9b2b4b76]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [d367f63b5]
- Updated dependencies [937ed39ce]
- Updated dependencies [b42531cfe]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/plugin-search-backend-node@0.1.3
  - @backstage/backend-common@0.6.3

## 0.7.1

### Patch Changes

- 017192ee8: Add support for configure an LDAP query filter on multiple lines.
- 5d0740563: Implemented missing support for the dependsOn/dependencyOf relationships
  between `Component` and `Resource` catalog model objects.

  Added support for generating the relevant relationships to the
  `BuiltinKindsEntityProcessor`, and added simple support for fetching
  relationships between `Components` and `Resources` for rendering in the
  system diagram. All catalog-model changes backwards compatible.

- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.7.0

### Minor Changes

- 676ede643: DELETE on an entity now just deletes the entity, rather than removing all related entities and the location
- f1b2c1d2c: Add `readonly` mode to catalog backend

  This change adds a `catalog.readonly` field in `app-config.yaml` that can be used to configure the catalog in readonly mode which effectively disables the possibility of adding new components to the catalog after startup.

  When in `readonly` mode only locations configured in `catalog.locations` are loaded and served.
  By default `readonly` is disabled which represents the current functionality where locations can be added at run-time.

  This change requires the config API in the router which requires a change to `createRouter`.

  ```diff
     return await createRouter({
       entitiesCatalog,
       locationsCatalog,
       higherOrderOperation,
       locationAnalyzer,
       logger: env.logger,
  +    config: env.config,
     });
  ```

### Patch Changes

- 29e1789e1: Make sure that Group `spec.members` is taken into account when filling out an org hierarchy
- 8488a1a96: Added support for the "members" field of the Group entity, allowing specification of
  direct members from the Group side of the relationship. Added support to the
  `BuiltinKindsEntityProcessor` to generate the appropriate relationships.
- 6b2d54fd6: Fix mapping between users and groups for Microsoft Active Directories when using the LdapOrgProcessor
- 44590510d: Add Bitbucket Server discovery processor.
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.6.7

### Patch Changes

- f47e11427: Log how many repositories were actually matching in `GithubDiscoveryProcessor`
- c862b3f36: Introduce pagination in the /entities catalog endpoint.

  Pagination is requested using query parameters. Currently supported parameters, all optional, are:

  - `limit` - an integer number of entities to return, at most
  - `offset` - an integer number of entities to skip over at the start
  - `after` - an opaque string cursor as returned by a previous paginated request

  Example request:

  `GET /entities?limit=100`

  Example response:

  ```
  200 OK
  Content-Type: application/json; charset=utf-8
  Link: </entities?limit=100&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D>; rel="next"
  <more headers>

  [{"metadata":{...
  ```

  Note the Link header. It contains the URL (path and query part, relative to the catalog root) to use for requesting the next page.
  It uses the `after` cursor to point out the end of the previous page. If the Link header is not present, there is no more data to read.

  The current implementation is naive and encodes offset/limit in the cursor implementation, so it is not robust in the face of overlapping
  changes to the catalog. This can be improved separately in the future without having to change the calling patterns.

- Updated dependencies [4d248725e]
  - @backstage/plugin-search-backend-node@0.1.2

## 0.6.6

### Patch Changes

- 010aed784: Add `AnnotateScmSlugEntityProcessor` that automatically adds the
  `github.com/project-slug` annotation for components coming from GitHub.

  The processor is optional and not automatically registered in the catalog
  builder. To add it to your instance, add it to your `CatalogBuilder` using
  `addProcessor()`:

  ```typescript
  const builder = new CatalogBuilder(env);
  builder.addProcessor(AnnotateScmSlugEntityProcessor.fromConfig(env.config));
  ```

- 4bc98a5b9: Refactor CodeOwnersProcessor to use ScmIntegrations
- d2f4efc5d: Add location to thrown exception when parsing YAML
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.6.5

### Patch Changes

- 9ef5a126d: Allow CodeOwnersProcessor to set `spec.owner` for `System`, `Resource`, and `Domain` entity kinds.
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 2ef5bc7ea: Implement proper AWS Credentials precedence with assume-role and explicit credentials
- 761698831: Bump to the latest version of the Knex library.
- 93c62c755: Move logic for generating URLs for the view, edit and source links of catalog
  entities from the catalog frontend into the backend. This is done using the
  existing support for the `backstage.io/view-url`, `backstage.io/edit-url` and
  `backstage.io/source-location` annotations that are now filled by the
  `AnnotateLocationEntityProcessor`. If these annotations are missing or empty,
  the UI disables the related controls.
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.6.4

### Patch Changes

- ecdd407b1: GithubDiscoveryProcessor outputs locations as optional to avoid outputting errors for missing locations (see https://github.com/backstage/backstage/issues/4730).
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.6.3

### Patch Changes

- 2499f6cde: Add support for assuming role in AWS integrations
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.6.2

### Patch Changes

- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.6.1

### Patch Changes

- 77ad0003a: Revert AWS SDK version to v2
- d2441aee3: use child logger, if provided, to log single location refresh
- fb53eb7cb: Don't respond to a request twice if an entity has not been found.
- f3fbfb452: add indices on columns referring locations(id)
- 84364b35c: Added an option to scan GitHub for repositories using a new location type `github-discovery`.
  Example:

  ```yaml
  type: 'github-discovery',
  target:
     'https://github.com/backstage/techdocs-*/blob/master/catalog.yaml'
  ```

  You can use wildcards (`*`) as well. This will add `location` entities for each matching repository.
  Currently though, you must specify the exact path of the `catalog.yaml` file in the repository.

- 82b2c11b6: Refactored route response handling to use more explicit types and throw errors.
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- 3149bfe63: Make use of the `resolveUrl` facility of the `integration` package.

  Also rename the `LocationRefProcessor` to `LocationEntityProcessor`, to match the file name. This constitutes an interface change since the class is exported, but it is unlikely to be consumed outside of the package since it sits comfortably with the other default processors inside the catalog builder.

### Patch Changes

- 24e47ef1e: Throw `NotAllowedError` when registering locations with entities of disallowed kinds
- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.5

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- a91aa6bf2: Support supplying a custom catalog descriptor file parser
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.5.4

### Patch Changes

- def2307f3: Adds a `backstage.io/managed-by-origin-location` annotation to all entities. It links to the
  location that was registered to the catalog and which emitted this entity. It has a different
  semantic than the existing `backstage.io/managed-by-location` annotation, which tells the direct
  parent location that created this entity.

  Consider this example: The Backstage operator adds a location of type `github-org` in the
  `app-config.yaml`. This setting will be added to a `bootstrap:boostrap` location. The processor
  discovers the entities in the following branch
  `Location bootstrap:bootstrap -> Location github-org:… -> User xyz`. The user `xyz` will be:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: User
  metadata:
    name: xyz
    annotations:
      # This entity was added by the 'github-org:…' location
      backstage.io/managed-by-location: github-org:…
      # The entity was added because the 'bootstrap:boostrap' was added to the catalog
      backstage.io/managed-by-origin-location: bootstrap:bootstrap
      # ...
  spec:
    # ...
  ```

- 318a6af9f: Change AWS Account type from Component to Resource
- ac7be581a: Refuse to remove the bootstrap location
- ad838c02f: Reduce log noise on locations refresh
- f9ba00a1c: Update the @azure/msal-node dependency to 1.0.0-beta.3.
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0

## 0.5.3

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- ade6b3bdf: AWS SDK version bump for Catalog Backend.
- abbee6fff: Implement System, Domain and Resource entity kinds.
- 147fadcb9: Add subcomponentOf to Component kind to represent subsystems of larger components.
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 99be3057c: Fixed a bug where the catalog would read back all entities when adding a location that already exists.
- 49d2016a4: Change `location_update_log` columns from `nvarchar(255)` to `text`
- 73e75ea0a: Add processor for ingesting AWS accounts from AWS Organizations
- 071711d70: Remove `sqlite3` as a dependency. You may need to add `sqlite3` as a dependency of your backend if you were relying on this indirect dependency.
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.5.1

### Patch Changes

- 5de26b9a6: Start warning about usage of deprecated location types, such as `github`
- 30d6c78fb: Added configuration schema for the commonly used properties
- 5084e5039: Updated the config schema

## 0.5.0

### Minor Changes

- 6b37c95bf: Write relations directly as part of batch add / update of entities.

  Slight change of the `CommonDatabase` contract:

  ## `addEntity` removed

  This method was unused by the core, and rendered unnecessary when `addEntities`
  exists.

  If you were a user of `addEntity`, please call `addEntities` instead, with an
  array of one element.

  ## `DbEntityRequest` has a new field `relations`

  This is the structure that is passed to `addEntities` and `updateEntity`. It
  used to be the case that you needed to call `setRelations` separately, but now
  this instead happens directly when you call `addEntities` or `updateEntity`.

  If you were using `addEntities` or `updateEntity` directly, please adapt your
  code to add the `relations` array to each request. If you were calling
  `setRelations` separately next to these methods, you no longer need to do so,
  after adding the relations to the `DbEntityRequest`s.

- ac3560b42: Remove `implementsApis` from `Component` entities. Deprecation happened in [#3449](https://github.com/backstage/backstage/pull/3449).
  Use `providesApis` instead.

### Patch Changes

- c6eeefa35: Add support for GitHub Enterprise in GitHubOrgReaderProcessor so you can properly ingest users of a GHE organization.
- fb386b760: Break the refresh loop into several smaller transactions
- 7c3ffc0cd: Support `profile` of groups including `displayName`, `email`, and `picture` in
  `LdapOrgReaderProcessor`. The source fields for them can be configured in the
  `ldapOrg` provider.
- e7496dc3e: Break out GithubOrgReaderProcessor config into its own file for consistency with the other org processors.
- 8dd0a906d: Support `profile` of groups including `displayName` and `picture` in
  `GithubOrgReaderProcessor`. Fixes the import of `description` for groups.
- 8c31c681c: Batch the writing of statuses after refreshes. This reduced the runtime on sqlite from 16s to 0.2s, and on pg from 60s to 1s on my machine, for the huge LDAP set.
- 7b98e7fee: Add index to foreign key columns. Postgres (and others) do not do this on the "source" side of a foreign key relation, which was what led to the slowness on large datasets. The full LDAP dataset ingestion now takes two minutes, which is not optimal yet but still a huge improvement over before when it basically never finished :)
- 0097057ed: Support `profile` of groups including `displayName` and `email` in
  `MicrosoftGraphOrgReaderProcessor`. Importing `picture` doesn't work yet, as
  the Microsoft Graph API does not expose them correctly.
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.4.0

### Minor Changes

- 83b6e0c1f: Remove the deprecated fields `ancestors` and `descendants` from the `Group` entity.

  See https://github.com/backstage/backstage/issues/3049 and the PRs linked from it for details.

### Patch Changes

- 6e8bb3ac0: leave unknown placeholder-lookalikes untouched in the catalog processing loop
- e708679d7: refreshAllLocations uses a child logger of the HigherOrderOperation with a meta `component` : `catalog-all-locations-refresh`
- 047c018c9: Batch the fetching of relations
- 38d63fbe1: Fix string template literal
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.0

### Minor Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 08835a61d: Add support for relative targets and implicit types in Location entities.
- e42402b47: Gracefully handle missing codeowners.

  The CodeOwnersProcessor now also takes a logger as a parameter.

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.2.3

### Patch Changes

- 1ec19a3f4: Ignore empty YAML documents. Having a YAML file like this is now ingested without an error:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: Component
  metadata:
    name: web
  spec:
    type: website
  ---
  ```

  This behaves now the same way as Kubernetes handles multiple documents in a single YAML file.

- ab94c9542: Add `providesApis` and `consumesApis` to the component entity spec.
- 2daf18e80: Start emitting all known relation types from the core entity kinds, based on their spec data.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- 0c2121240: Add support for reading groups and users from the Microsoft Graph API.
- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- f531d307c: An entity A, that exists in the catalog, can no longer be overwritten by registering a different location that also tries to supply an entity with the same kind+namespace+name. Writes of that new entity will instead be rejected with a log message similar to `Rejecting write of entity Component:default/artist-lookup from file:/Users/freben/dev/github/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml because entity existed from github:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/artist-lookup-component.yaml`
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- e0be86b6f: Entirely case insensitive read path of entities
- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- 57d555eb2: This feature works the same as \$secret does in config - it allows programmatic substitution of values into a document.

  This is particularly useful e.g. for API type entities where you do not want to repeat your entire API spec document inside the catalog-info.yaml file. For those cases, you can instead do something like

  ```
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: my-federated-service
  spec:
    type: graphql
    definition:
      $text: ./schema.graphql
  ```

  The textual content of that file will be injected as the value of definition, during each refresh loop. Both relative and absolute paths are supported, as well as any HTTP/HTTPS URL pointing to a service that returns the relevant data.

  The initial version supports injection of text file data, and structured data from JSON and YAML files. You can add any handler of your own in addition to these.

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- 81cb94379: Simplify the read function in processors
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- ce1f55398: Use the new `UrlReader` in `PlaceholderProcessor`.
  This allows to use the placeholder processor to include API definitions in API entities.
  Previously it was only possible to do this if the definition comes from the same location type as the entity itself.
- e6b00e3af: Remove the backstage.io/definition-at-location annotation.
  The annotation was superseded by the placeholder processor.

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: spotify
    description: The Spotify web API
    tags:
      - spotify
      - rest
    annotations:
      # Don't use this annotation, but the placeholder $text instead (see below).
      backstage.io/definition-at-location: 'url:https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml'
  spec:
    type: openapi
    lifecycle: production
    owner: spotify@example.com
    definition:
      $text: https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml
  ```

- 99710b102: The way that wiring together a catalog happens, has changed drastically. Now
  there is a new class `CatalogBuilder` that does almost all of the heavy lifting
  of how to augment/replace pieces of catalog functionality, such as adding
  support for custom entities or adding additional processors.

  As the builder was added, a lot of the static methods and builders for default
  setups have been removed from classes deep in the hierarchy. Instead, the
  builder contains the knowledge of what the defaults are.

- 002860e7a: Filters passed to the `/entities` endpoint of the catalog has changed format.

  The old way was to pass things on the form `?a=b&c=d`; the new way is to pass
  things on the form `?filter=a=b,c=d`. See discussion in
  [#2910](https://github.com/backstage/backstage/issues/2910) for details.

  The comma separated items within a single filter have an AND between them. If
  multiple such filters are passed, they have an OR between those item groups.

- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- 948052cbb: Add ability to dry run adding a new location to the catalog API.

  The location is now added in a transaction and afterwards rolled back.
  This allows users to dry run this operation to see if there entity has issues.
  This is probably done by automated tools in the CI/CD pipeline.

- 4036ff59d: - The `CatalogProcessor` API was updated to have `preProcessEntity` and
  `postProcessEntity` methods, instead of just one `processEntity`. This makes
  it easier to make processors that have several stages in one, and to make
  different processors more position independent in the list of processors.
  - The `EntityPolicy` is now given directly to the `LocationReaders`, instead of
    being enforced inside a policy. We have decided to separate out the act of
    validating an entity to be outside of the processing flow, to make it
    possible to apply more liberally and to evolve it as a separate concept.
  - Because of the above, the `EntityPolicyProcessor` has been removed.
- 512d70973: Use the new `UrlReader` in the `CodeOwnersProcessor`.
- 2f62e1804: Removed the parseData step from catalog processors. Locations readers should emit full entities instead.
- 36a71d278: Removed support for deprecated `catalog.providers` config that have been moved to `integrations`
- a5cb46bac: Renamed the `LocationProcessor` class to `CatalogProcessor`.

  Likewise, renamed `LocationProcessorResult`, `LocationProcessorLocationResult`,
  `LocationProcessorDataResult`, `LocationProcessorEntityResult`,
  `LocationProcessorErrorResult`, and `LocationProcessorEmit` to their `Catalog*`
  counterparts.

- 49d70ccab: Remove the `read` argument of `LocationProcessor.processEntity`.
  Instead, pass the `UrlReader` into the constructor of your `LocationProcessor`.
- 440a17b39: The catalog backend UrlReaderProcessor now uses a UrlReader from @backstage/backend-common, which must now be supplied to the constructor.

### Patch Changes

- 3472c8be7: Add codeowners processor

  - Add `codeowners-utils@^1.0.2` as a dependency
  - Add `core-js@^3.6.5` as a dependency
  - Added new CodeOwnersProcessor

- 33454c0f2: Fix `CatalogBuilder#addProcessor`.
- 183e2a30d: Add support for `fields` sub-selection of just parts of an entity when listing
  entities in the catalog backend.

  Example: `.../entities?fields=metadata.name,spec.type` will return partial
  entity objects with only those exact fields present and the rest cut out.
  Fields do not have to be simple scalars - you can for example do
  `fields=metadata`.

- 8bdf0bcf5: Fix CodeOwnersProcessor to handle non team users
- 4c4eab81b: The CodeOwnersProcessor now handles 'url' locations
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
