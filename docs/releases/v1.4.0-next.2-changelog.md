# Release v1.4.0-next.2

## @backstage/catalog-model@1.1.0-next.2

### Minor Changes

- 4cc81372f8: Introduced `GroupDefaultParentEntityPolicy` to set a default group entity parent.

## @backstage/core-components@0.10.0-next.2

### Minor Changes

- 32204fa794: Add `transformLinkUri` and `transformImageUri` to `MarkdownContent`

### Patch Changes

- b4b711bcc2: Fix the EntityLayout header style so that EntityContextMenu button can display in correct shape when user hover on it
- 15201b1032: Updated dependency `rc-progress` to `3.4.0`.
- 385389d23c: Updated to remove usage of the `bursts` object in the theme palette
- Updated dependencies
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-catalog@1.4.0-next.2

### Minor Changes

- a274fe38b9: Add hidden title column to catalog and API table to enable filtering by title.

### Patch Changes

- 258057a4b9: Adding ability to customize the "unregister entity" menu item in the entity context menu on the entity page with options 'visible','hidden','disabled'.With this three new options, one can hide the "unregister entity" menu item from the list, disable or keep it enabled.

  The boolean input for "unregister entity" will be deprecated later in favour of the above three options.

- 385389d23c: Updated to remove usage of the `bursts` object in the theme palette

- be26d95141: Added new `EntityProcessingStatusPicker` that will filter for entities with orphans and/or errors.

  If you are using the default Catalog page this picker will be added automatically. For those who have customized their Catalog page you'll need to add this manually by doing something like this:

  ```diff
  ...
  import {
    CatalogFilterLayout,
    EntityTypePicker,
    UserListPicker,
    EntityTagPicker
  + EntityProcessingStatusPicker,
  } from '@backstage/plugin-catalog-react';
  ...
  export const CustomCatalogPage = ({
    columns,
    actions,
    initiallySelectedFilter = 'owned',
  }: CatalogPageProps) => {
    return (
      ...
          <EntityListProvider>
            <CatalogFilterLayout>
              <CatalogFilterLayout.Filters>
                <EntityKindPicker initialFilter="component" hidden />
                <EntityTypePicker />
                <UserListPicker initialFilter={initiallySelectedFilter} />
                <EntityTagPicker />
  +             <EntityProcessingStatusPicker />
              <CatalogFilterLayout.Filters>
              <CatalogFilterLayout.Content>
                <CatalogTable columns={columns} actions={actions} />
              </CatalogFilterLayout.Content>
            </CatalogFilterLayout>
          </EntityListProvider>
      ...
  };
  ```

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/plugin-catalog-backend-module-msgraph@0.4.0-next.1

### Minor Changes

- a145672f0f: Align `msgraph` plugin's entity provider config with other providers. **Deprecated** entity processor as well as previous config.

  You will see warning at the log output until you migrate to the new setup.
  All deprecated parts will be removed eventually after giving some time to migrate.

  Please find information on how to migrate your current setup to the new one below.

  **Migration Guide:**

  There were two different way on how to use the msgraph plugin: processor or provider.

  Previous registration for the processor:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addProcessor(
    MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
      // [...]
    }),
  );
  ```

  Previous registration when using the provider:

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      id: 'https://graph.microsoft.com/v1.0',
      target: 'https://graph.microsoft.com/v1.0',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  Previous configuration as used for both:

  ```yaml
  # app-config.yaml
  catalog:
    processors:
      microsoftGraphOrg:
        providers:
          - target: https://graph.microsoft.com/v1.0
            # [...]
  ```

  **Replacement:**

  Please check <https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md> for the complete documentation of all configuration options (config as well as registration of the provider).

  ```yaml
  # app-config.yaml
  catalog:
    providers:
      microsoftGraphOrg:
        # In case you used the deprecated configuration with the entity provider
        # using the value of `target` will keep the same location key for all
        providerId: # some stable ID which will be used as part of the location key for all ingested data
          target: https://graph.microsoft.com/v1.0
          # [...]
  ```

  ```typescript
  // packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // [...]
    }),
  );
  ```

  In case you've used multiple entity providers before
  **and** you had different transformers for each of them
  you can provide these directly at the one `fromConfig` call
  by passing a Record with the provider ID as key.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2

## @backstage/plugin-cost-insights-common@0.1.0-next.0

### Minor Changes

- 81dd5ea989: Introduces a new isomorphic @backstage/plugin-cost-insight-common package to contain shared types across all other cost insights packages and modules.

## @backstage/plugin-scaffolder@1.4.0-next.2

### Minor Changes

- d8eb82f447: Add `allowedRepos` `ui:option` to `RepoUrlPicker` component, and move `repoName` field to own component

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 14146703e5: Add `allowArbitraryValues` to `ui:options` in `OwnedEntityPicker`, similar to `allowArbitraryValues` in `EntityPicker`

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/plugin-scaffolder-backend@1.4.0-next.2

### Minor Changes

- 4baf8a4ece: Update GitLab Merge Request Action to allow source branch to be deleted
- 2db07887cb: Added two new scaffolder actions: `github:repo:create` and `github:repo:push`

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-tech-insights-backend@0.5.0-next.2

### Minor Changes

- 818fa28d71: Allow FactRetrieverRegistry to be injected into buildTechInsightsContext so that we can override default registry implementation.

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2

## @backstage/app-defaults@1.0.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/backend-common@0.14.1-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/integration@1.2.2-next.2

## @backstage/backend-tasks@0.3.3-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## @backstage/backend-test-utils@0.1.26-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/cli@0.18.0-next.2

## @backstage/cli@0.18.0-next.2

### Patch Changes

- f6b6fb7165: The `test` command now ensures that all IO is flushed before exiting when printing `--help`.

## @backstage/create-app@0.4.29-next.2

### Patch Changes

- f281ad17c0: Adds the ability to define the Backstage app name using a `BACKSTAGE_APP_NAME`
  environment variable when running `create-app`.

## @backstage/dev-utils@1.0.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/app-defaults@1.0.4-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/integration@1.2.2-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

## @backstage/integration-react@1.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2

## @backstage/theme@0.2.16-next.1

### Patch Changes

- ff4f56eb49: **DEPRECATED**: The `bursts` object from `BackstagePaletteAdditions` has been depreciated and will be removed in a future release

  The `genPageTheme` function now includes an optional options object with an optional `fontColor` which defaults to white if not provided.

## @backstage/plugin-adr@0.1.2-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/plugin-airbrake@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/dev-utils@1.0.4-next.2

## @backstage/plugin-allure@0.1.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-analytics-module-ga@0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-apache-airflow@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2

## @backstage/plugin-api-docs@0.8.7-next.2

### Patch Changes

- a274fe38b9: Add hidden title column to catalog and API table to enable filtering by title.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog@1.4.0-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-app-backend@0.3.34-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-auth-backend@0.15.0-next.2

### Patch Changes

- 8e03db907a: Auth provider now also export createAuthProviderIntegration
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-azure-devops@0.1.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-badges@0.2.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-badges-backend@0.1.28-next.2

### Patch Changes

- 58fd5ee9d5: Add missing installation instructions
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-bazaar@0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-catalog@1.4.0-next.2
  - @backstage/cli@0.18.0-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-bazaar-backend@0.1.18-next.1

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-test-utils@0.1.26-next.2

## @backstage/plugin-bitrise@0.1.34-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-catalog-backend@1.2.1-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-catalog-backend-module-openapi@0.1.0-next.1

### Patch Changes

- 4881dc4c84: Updated dependency `openapi-types` to `^12.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-catalog-graph@0.2.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-catalog-import@0.8.10-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/plugin-catalog-react@1.1.2-next.2

### Patch Changes

- be26d95141: Added new `EntityProcessingStatusPicker` that will filter for entities with orphans and/or errors.

  If you are using the default Catalog page this picker will be added automatically. For those who have customized their Catalog page you'll need to add this manually by doing something like this:

  ```diff
  ...
  import {
    CatalogFilterLayout,
    EntityTypePicker,
    UserListPicker,
    EntityTagPicker
  + EntityProcessingStatusPicker,
  } from '@backstage/plugin-catalog-react';
  ...
  export const CustomCatalogPage = ({
    columns,
    actions,
    initiallySelectedFilter = 'owned',
  }: CatalogPageProps) => {
    return (
      ...
          <EntityListProvider>
            <CatalogFilterLayout>
              <CatalogFilterLayout.Filters>
                <EntityKindPicker initialFilter="component" hidden />
                <EntityTypePicker />
                <UserListPicker initialFilter={initiallySelectedFilter} />
                <EntityTagPicker />
  +             <EntityProcessingStatusPicker />
              <CatalogFilterLayout.Filters>
              <CatalogFilterLayout.Content>
                <CatalogTable columns={columns} actions={actions} />
              </CatalogFilterLayout.Content>
            </CatalogFilterLayout>
          </EntityListProvider>
      ...
  };
  ```

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-circleci@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-cloudbuild@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-code-climate@0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-code-coverage@0.1.34-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-code-coverage-backend@0.1.32-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-codescene@0.1.2-next.2

### Patch Changes

- 15201b1032: Updated dependency `rc-progress` to `3.4.0`.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-config-schema@0.1.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-cost-insights@0.11.29-next.2

### Patch Changes

- 3e032a5de2: Move cost-insights data specific API types (non react) into an @backstage/plugin-cost-insights-common
  isomorphic package. This allows these types to be shared in any backend packages or other cost-insight
  modules.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-cost-insights-common@0.1.0-next.0
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-dynatrace@0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-explore@0.3.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-firehydrant@0.1.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-fossa@0.2.39-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-gcalendar@0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-gcp-projects@0.3.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-git-release-manager@0.3.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-github-actions@0.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-github-deployments@0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## @backstage/plugin-github-pull-requests-board@0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-gitops-profiles@0.3.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-gocd@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-graphiql@0.2.39-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-home@0.4.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/plugin-stack-overflow@0.1.3-next.2

## @backstage/plugin-ilert@0.1.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-jenkins@0.7.6-next.2

### Patch Changes

- 8747824221: feature: added support for multiple branches to the `JenkinsApi`
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-jenkins-backend@0.1.24-next.2

### Patch Changes

- 8747824221: feature: added support for multiple branches to the `JenkinsApi`
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-kafka@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-kafka-backend@0.2.27-next.2

### Patch Changes

- 8751667541: Updated dependency `kafkajs` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-kubernetes@0.6.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-kubernetes-common@0.4.0-next.1
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-kubernetes-backend@0.7.0-next.2

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.4.0-next.1
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-kubernetes-common@0.4.0-next.1

### Patch Changes

- 60e5f9fe68: Fixed the lack of `limitranges` as part of the Default Objects to fetch from the kubernetes api
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2

## @backstage/plugin-lighthouse@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-newrelic@0.3.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-newrelic-dashboard@0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-org@0.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-pagerduty@0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-periskop@0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-rollbar@0.4.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-search@0.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-search-backend-module-pg@0.3.5-next.2

### Patch Changes

- 423e3d8e95: **DEPRECATED**: `PgSearchEngine` static `from` has been deprecated and will be removed in a future release. Use static `fromConfig` method to instantiate.

  Added support for highlighting matched terms in search result data

- 679b32172e: Updated dependency `knex` to `^2.0.0`.

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## @backstage/plugin-search-react@0.2.2-next.2

### Patch Changes

- 60408ca9d4: Fix search pagination to reset page cursor also when a term is cleared.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-sentry@0.3.45-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-shortcuts@0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-sonarqube@0.3.7-next.2

### Patch Changes

- 15201b1032: Updated dependency `rc-progress` to `3.4.0`.
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-splunk-on-call@0.3.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-stack-overflow@0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-home@0.4.23-next.2

## @backstage/plugin-tech-insights@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-tech-radar@0.5.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-techdocs@1.2.1-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 7739141ab2: Fix: When docs are shown in an entity page under the docs tab the sidebars start overlapping with the header and tabs in the page when you scroll the documentation content.

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2
  - @backstage/plugin-techdocs-react@1.0.2-next.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-techdocs@1.2.1-next.2
  - @backstage/plugin-catalog@1.4.0-next.2
  - @backstage/integration-react@1.1.2-next.2
  - @backstage/plugin-techdocs-react@1.0.2-next.1

## @backstage/plugin-techdocs-backend@1.2.0-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-techdocs-node@1.2.0-next.2

## @backstage/plugin-techdocs-module-addons-contrib@1.0.2-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/integration-react@1.1.2-next.2
  - @backstage/plugin-techdocs-react@1.0.2-next.1

## @backstage/plugin-techdocs-node@1.2.0-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/integration@1.2.2-next.2

## @backstage/plugin-techdocs-react@1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2

## @backstage/plugin-todo@0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-user-settings@0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## @backstage/plugin-vault@0.1.1-next.2

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## @backstage/plugin-vault-backend@0.2.0-next.2

### Patch Changes

- 7ee4abdcc9: Added a path notion in addition to secret name to allow to differentiate secrets in sub-paths
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/backend-test-utils@0.1.26-next.2

## @backstage/plugin-xcmetrics@0.2.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## example-app@0.2.73-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-cost-insights@0.11.29-next.2
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-scaffolder@1.4.0-next.2
  - @backstage/plugin-jenkins@0.7.6-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-import@0.8.10-next.2
  - @backstage/plugin-techdocs@1.2.1-next.2
  - @backstage/plugin-techdocs-module-addons-contrib@1.0.2-next.2
  - @backstage/plugin-api-docs@0.8.7-next.2
  - @backstage/plugin-catalog@1.4.0-next.2
  - @backstage/cli@0.18.0-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/app-defaults@1.0.4-next.2
  - @backstage/integration-react@1.1.2-next.2
  - @backstage/plugin-airbrake@0.3.7-next.2
  - @backstage/plugin-apache-airflow@0.2.0-next.2
  - @backstage/plugin-azure-devops@0.1.23-next.2
  - @backstage/plugin-badges@0.2.31-next.2
  - @backstage/plugin-catalog-graph@0.2.19-next.2
  - @backstage/plugin-circleci@0.3.7-next.2
  - @backstage/plugin-cloudbuild@0.3.7-next.2
  - @backstage/plugin-code-coverage@0.1.34-next.2
  - @backstage/plugin-dynatrace@0.1.1-next.2
  - @backstage/plugin-explore@0.3.38-next.2
  - @backstage/plugin-gcalendar@0.3.3-next.2
  - @backstage/plugin-gcp-projects@0.3.26-next.2
  - @backstage/plugin-github-actions@0.5.7-next.2
  - @backstage/plugin-gocd@0.1.13-next.2
  - @backstage/plugin-graphiql@0.2.39-next.2
  - @backstage/plugin-home@0.4.23-next.2
  - @backstage/plugin-kafka@0.3.7-next.2
  - @backstage/plugin-kubernetes@0.6.7-next.2
  - @backstage/plugin-lighthouse@0.3.7-next.2
  - @backstage/plugin-newrelic@0.3.25-next.2
  - @backstage/plugin-newrelic-dashboard@0.1.15-next.2
  - @backstage/plugin-org@0.5.7-next.2
  - @backstage/plugin-pagerduty@0.5.0-next.2
  - @backstage/plugin-rollbar@0.4.7-next.2
  - @backstage/plugin-search@0.9.1-next.2
  - @backstage/plugin-sentry@0.3.45-next.2
  - @backstage/plugin-shortcuts@0.2.8-next.2
  - @backstage/plugin-stack-overflow@0.1.3-next.2
  - @backstage/plugin-tech-insights@0.2.3-next.2
  - @backstage/plugin-tech-radar@0.5.14-next.2
  - @backstage/plugin-techdocs-react@1.0.2-next.1
  - @backstage/plugin-todo@0.2.9-next.2
  - @backstage/plugin-user-settings@0.4.6-next.2

## example-backend@0.2.73-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-backend@0.7.0-next.2
  - @backstage/plugin-tech-insights-backend@0.5.0-next.2
  - @backstage/plugin-jenkins-backend@0.1.24-next.2
  - @backstage/plugin-search-backend-module-pg@0.3.5-next.2
  - @backstage/plugin-scaffolder-backend@1.4.0-next.2
  - @backstage/plugin-auth-backend@0.15.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/plugin-kafka-backend@0.2.27-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2
  - @backstage/plugin-app-backend@0.3.34-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/plugin-code-coverage-backend@0.1.32-next.2
  - @backstage/plugin-techdocs-backend@1.2.0-next.2
  - @backstage/plugin-badges-backend@0.1.28-next.2
  - @backstage/integration@1.2.2-next.2
  - example-app@0.2.73-next.2

## techdocs-cli-embedded-app@0.2.72-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-techdocs@1.2.1-next.2
  - @backstage/plugin-catalog@1.4.0-next.2
  - @backstage/cli@0.18.0-next.2
  - @backstage/app-defaults@1.0.4-next.2
  - @backstage/integration-react@1.1.2-next.2
  - @backstage/plugin-techdocs-react@1.0.2-next.1

## @internal/plugin-todo-list@1.0.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1
