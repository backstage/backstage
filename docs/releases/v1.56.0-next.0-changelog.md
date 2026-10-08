# Release v1.56.0-next.0

Upgrade Helper: [https://backstage.github.io/upgrade-helper/?to=1.56.0-next.0](https://backstage.github.io/upgrade-helper/?to=1.56.0-next.0)

## @backstage/cli-module-catalog@0.2.0-next.0

### Minor Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/cli-module-scaffolder@0.2.0-next.0

### Minor Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/catalog-client@1.16.3-next.0

## @backstage/cli-module-search@0.2.0-next.0

### Minor Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.0-next.0

### Minor Changes

- e003123: Added a `source_key` column and a `UNIQUE(source_key, entity_ref)` constraint to the `ingestion_mark_entities` table, enabling a single native upsert instead of a select-then-update-or-insert sequence per ingestion mark.
  This significantly reduces the number of database round trips during ingestion.

  As part of this change, the table's `ref` column is renamed to `entity_ref` to standardize its naming with the rest of the table's columns.
  This rename means the migration cannot be applied as part of a rolling, zero-downtime upgrade, which is fine since incremental ingestion providers are designed to run sequentially on a single Backstage backend instance.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.1-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-techdocs@1.19.0-next.0

### Minor Changes

- 80a0da9: Added `withoutFeedbackLink` prop to `page:techdocs/reader` and `entity-content:techdocs` extensions, which can be set to `true` to disable the feedback button in the rendered documentation.

### Patch Changes

- 24fd0e8: Fixed TechDocs addons silently not rendering in apps using the new frontend system, on both the standalone documentation reader page and the entity documentation tab.
- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-auth-react@0.1.32-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-search-common@1.2.26-next.0
  - @backstage/plugin-search-react@1.11.9-next.0

## @backstage/app-defaults@1.7.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0

## @backstage/backend-app-api@1.7.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/backend-defaults@0.18.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-app-api@1.7.5-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/backend-dynamic-feature-service@0.8.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/plugin-catalog-backend@4.0.1-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-events-backend@0.6.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/cli-common@0.3.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-app-node@0.1.50-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/backend-openapi-utils@0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/backend-plugin-api@1.10.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/backend-test-utils@1.11.8-next.0

### Patch Changes

- 7728fcd: Improved test database cleanup reliability by shutting down independent database engines and removing their logical databases concurrently.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-app-api@1.7.5-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/catalog-client@1.16.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/catalog-model@1.10.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0

## @backstage/cli@0.36.7-next.0

### Patch Changes

- 36e3f24: Updated the test runner to use the latest Jest 30 releases.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-module-test-jest@0.1.7-next.0
  - @backstage/cli-defaults@0.1.7-next.0
  - @backstage/cli-module-build@0.1.9-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-common@0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0

## @backstage/cli-defaults@0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-module-catalog@0.2.0-next.0
  - @backstage/cli-module-scaffolder@0.2.0-next.0
  - @backstage/cli-module-search@0.2.0-next.0
  - @backstage/cli-module-test-jest@0.1.7-next.0
  - @backstage/cli-module-package-manager-yarn@0.1.3-next.0
  - @backstage/cli-module-actions@0.1.4-next.0
  - @backstage/cli-module-auth@0.1.5-next.0
  - @backstage/cli-module-build@0.1.9-next.0
  - @backstage/cli-module-config@0.1.8-next.0
  - @backstage/cli-module-github@0.1.5-next.0
  - @backstage/cli-module-info@0.1.5-next.0
  - @backstage/cli-module-lint@0.1.6-next.0
  - @backstage/cli-module-maintenance@0.1.6-next.0
  - @backstage/cli-module-migrate@0.2.2-next.0
  - @backstage/cli-module-new@0.1.8-next.0
  - @backstage/cli-module-translations@0.1.5-next.0

## @backstage/cli-module-actions@0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/cli-module-auth@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/cli-module-build@0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/module-federation-common@0.1.6-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-config@0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-github@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-info@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-lint@0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-maintenance@0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-migrate@0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-new@0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-package-manager-yarn@0.1.3-next.0

### Patch Changes

- 673a35d: Fixed `backstage-cli pm verify-patches` failing to load unless projects installed the Yarn CLI package separately.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-test-jest@0.1.7-next.0

### Patch Changes

- 36e3f24: Fixed CommonJS frontend test execution with ESM dependencies on Node.js 24.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-module-translations@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/cli-node@0.3.5-next.0

### Patch Changes

- 3d6721d: Add intent-based CLI modules for catalog, scaffolder, and search.

  New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

  - `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
  - `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
  - `@backstage/cli-module-search`: `search`, `docs search`

  The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

  `@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/config@1.3.10-next.0

### Patch Changes

- e156078: Reading a number from a configuration value that is an empty or whitespace-only string now fails with a clear conversion error, instead of silently returning `0`. Numeric strings, including ones with surrounding whitespace such as `'  42  '`, continue to be parsed as expected.
- Updated dependencies
  - @backstage/errors@1.3.2-next.0

## @backstage/config-loader@1.11.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/connections@0.4.1-next.0

### Patch Changes

- e3b418c: Fixed the `Connection` type so that `auth` is a union of method variants instead of an array when no specific auth method is provided.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/core-app-api@1.20.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/core-compat-api@0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-app-react@0.2.8-next.0

## @backstage/core-components@0.18.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/core-plugin-api@1.12.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/create-app@0.9.3-next.0

### Patch Changes

- 36e3f24: Updated generated applications to use the latest Jest 30 release.
- Updated dependencies
  - @backstage/cli-common@0.3.2-next.0

## @backstage/dev-utils@1.1.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/app-defaults@1.7.13-next.0

## @backstage/errors@1.3.2-next.0

### Patch Changes

- 603898f: Fixed `serializeError` so that stack traces are stripped from all nested error causes when stacks are not requested, not just the first-level cause.

## @backstage/filter-predicates@0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/frontend-app-api@0.16.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-defaults@0.5.7-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/frontend-defaults@0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/frontend-app-api@0.16.9-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-app@0.5.4-next.0

## @backstage/frontend-dev-utils@0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-defaults@0.5.7-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-app@0.5.4-next.0

## @backstage/frontend-dynamic-feature-loader@0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/module-federation-common@0.1.6-next.0

## @backstage/frontend-plugin-api@0.18.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0

## @backstage/frontend-test-utils@0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-app-api@0.16.9-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/test-utils@1.7.23-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-app@0.5.4-next.0
  - @backstage/plugin-app-react@0.2.8-next.0

## @backstage/integration@2.1.3-next.0

### Patch Changes

- 1f603db: Azure DevOps repository files now resolve to an edit URL when used by integrations such as TechDocs.
- 4bd3c42: Bitbucket Cloud OAuth access tokens returned by `getBitbucketCloudOAuthToken` are now cached separately for each set of OAuth client credentials. Previously a single token was cached globally, which could cause the wrong token to be used when more than one Bitbucket Cloud integration was configured or when OAuth credentials were rotated.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0

## @backstage/integration-aws-node@0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0

## @backstage/integration-react@1.2.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/module-federation-common@0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/repo-tools@0.19.2-next.0

### Patch Changes

- a281164: Updated SQL report generation to support newer Knex releases.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @techdocs/cli@1.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/plugin-techdocs-node@2.0.1-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/test-utils@1.7.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0

## @backstage/plugin-api-docs@0.14.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog@2.0.10-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-app@0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-app-react@0.2.8-next.0

## @backstage/plugin-app-backend@0.5.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-app-node@0.1.50-next.0

## @backstage/plugin-app-module-user-settings@0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-user-settings@0.9.8-next.0
  - @backstage/plugin-signals-react@0.0.27-next.0

## @backstage/plugin-app-node@0.1.50-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0

## @backstage/plugin-app-react@0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/plugin-app-visualizer@0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/plugin-auth@0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/plugin-auth-backend@0.30.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-auth-backend-module-atlassian-provider@0.4.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-auth0-provider@0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.4.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-backend@0.30.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-auth-backend-module-bitbucket-provider@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.4.20-next.0

### Patch Changes

- b96ec9e: Cache Google IAP public verification keys according to the response cache headers to reduce repeated key requests during authentication.
- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-github-provider@0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-auth-backend-module-gitlab-provider@0.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-google-provider@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-guest-provider@0.2.24-next.0

### Patch Changes

- c2ea521: Change visibility to auth.providers.guest configuration key to be visible by frontend plugins to align with other authentication providers.
- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-auth-backend-module-microsoft-provider@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-oauth2-provider@0.4.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-oidc-provider@0.4.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-backend@0.30.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-okta-provider@0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-onelogin-provider@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-openshift-provider@0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-auth-backend-module-pinniped-provider@0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.5.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-auth-node@0.7.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-auth-react@0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/plugin-bitbucket-cloud-common@0.3.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0

## @backstage/plugin-catalog@2.0.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-search-common@1.2.26-next.0
  - @backstage/plugin-search-react@1.11.9-next.0

## @backstage/plugin-catalog-backend@4.0.1-next.0

### Patch Changes

- a08e746: Improved large entity provider mutations by yielding to the event loop while preparing database changes.
- 727d53f: Improve responsiveness to other requests while reading large sets of entities with field selection, without reducing page sizes.

  Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.

- e783f4b: Fixed catalog processing error messages to report stable processor names in minified builds.
- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-ai-model@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-catalog-backend-module-aws@0.4.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-catalog-backend-module-azure@0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.14-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-gcp@0.3.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-catalog-backend-module-gerrit@0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-gitea@0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-github@0.14.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-github-org@0.3.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/plugin-catalog-backend-module-github@0.14.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-catalog-backend-module-gitlab@0.8.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-gitlab-org@0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-gitlab@0.8.9-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-catalog-backend-module-ldap@0.12.10-next.0

### Patch Changes

- 916e5b2: Improved the performance of LDAP organization ingestion, especially for large directories, without changing the resulting catalog entities.
- 1a20364: Improved large LDAP organization refreshes by yielding to the event loop while resolving relations.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-logs@0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-catalog-backend-module-msgraph@0.10.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-msgraph-incremental@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/plugin-catalog-backend-module-incremental-ingestion@0.9.0-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-catalog-backend-module-msgraph@0.10.7-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-catalog-backend-module-openapi@0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-puppetdb@0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-unprocessed@0.6.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-unprocessed-entities-common@0.0.18-next.0

## @backstage/plugin-catalog-common@1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-catalog-graph@0.6.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0

## @backstage/plugin-catalog-import@0.13.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-node@2.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-test-utils@1.11.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-catalog-react@3.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/frontend-test-utils@0.6.5-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0

## @backstage/plugin-catalog-unprocessed-entities@0.2.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0
  - @backstage/plugin-catalog-unprocessed-entities-common@0.0.18-next.0

## @backstage/plugin-catalog-unprocessed-entities-common@0.0.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-config-schema@0.1.85-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/plugin-devtools@0.1.44-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/core-compat-api@0.5.16-next.0
  - @backstage/plugin-devtools-common@0.1.27-next.0

## @backstage/plugin-devtools-backend@0.5.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/cli-common@0.3.2-next.0
  - @backstage/plugin-devtools-common@0.1.27-next.0

## @backstage/plugin-devtools-common@0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0

## @backstage/plugin-devtools-react@0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/plugin-events-backend@0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-aws-sqs@0.4.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-azure@0.2.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-bitbucket-server@0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-gerrit@0.2.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-github@0.4.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-gitlab@0.3.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-google-pubsub@0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-module-kafka@0.3.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-backend-test-utils@0.1.60-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-events-node@0.4.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-gateway-backend@1.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-home@0.9.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-home-react@0.1.43-next.0

## @backstage/plugin-home-react@0.1.43-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0

## @backstage/plugin-kubernetes@0.12.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-kubernetes-react@0.6.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-kubernetes-backend@0.21.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0
  - @backstage/plugin-kubernetes-node@0.4.9-next.0

## @backstage/plugin-kubernetes-cluster@0.0.42-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-kubernetes-react@0.6.1-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-kubernetes-common@0.9.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-kubernetes-node@0.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-kubernetes-react@0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.14-next.0

## @backstage/plugin-mcp-actions-backend@0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-mui-to-bui@0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @backstage/plugin-notifications@0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/plugin-home-react@0.1.43-next.0
  - @backstage/plugin-signals-react@0.0.27-next.0

## @backstage/plugin-notifications-backend@0.6.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0
  - @backstage/plugin-signals-node@0.2.6-next.0

## @backstage/plugin-notifications-backend-module-email@0.3.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0

## @backstage/plugin-notifications-backend-module-slack@0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0

## @backstage/plugin-notifications-common@0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0

## @backstage/plugin-notifications-node@0.2.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0

## @backstage/plugin-org@0.7.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0

## @backstage/plugin-org-react@0.1.55-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0

## @backstage/plugin-permission-backend@0.7.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0

## @backstage/plugin-permission-backend-module-allow-all-policy@0.2.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0

## @backstage/plugin-permission-common@0.9.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0

## @backstage/plugin-permission-node@0.11.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0

## @backstage/plugin-permission-react@0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0

## @backstage/plugin-proxy-backend@0.6.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-proxy-node@0.1.20-next.0

## @backstage/plugin-proxy-node@0.1.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder@1.39.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-scaffolder-react@2.1.1-next.0

## @backstage/plugin-scaffolder-backend@4.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-scaffolder-backend-module-azure@0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.14-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.3.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-gcp@0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-gerrit@0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-gitea@0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-github@0.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-scaffolder-backend-module-gitlab@0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-notifications@0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0

## @backstage/plugin-scaffolder-backend-module-rails@0.5.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-sentry@0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-workspace-database@0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-backend-module-yeoman@0.4.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-scaffolder-node-test-utils@0.3.16-next.0

## @backstage/plugin-scaffolder-common@2.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-scaffolder-node@0.13.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-test-utils@1.11.8-next.0
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-scaffolder-node-test-utils@0.3.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.11.8-next.0
  - @backstage/plugin-scaffolder-node@0.13.8-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @backstage/plugin-scaffolder-react@2.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@2.3.1-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/frontend-test-utils@0.6.5-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0

## @backstage/plugin-search@1.7.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-home-react@0.1.43-next.0
  - @backstage/plugin-search-common@1.2.26-next.0
  - @backstage/plugin-search-react@1.11.9-next.0

## @backstage/plugin-search-backend@2.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-catalog@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-elasticsearch@2.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-explore@0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-pg@0.5.60-next.0

### Patch Changes

- 7535616: Fixed PostgreSQL search highlighting when configured delimiters or selection tags contain punctuation that requires quoting.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.3.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-module-techdocs@0.4.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/plugin-techdocs-node@2.0.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-backend-node@1.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-search-common@1.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0

## @backstage/plugin-search-react@1.11.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-signals@0.0.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-signals-react@0.0.27-next.0

## @backstage/plugin-signals-backend@0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0
  - @backstage/plugin-signals-node@0.2.6-next.0

## @backstage/plugin-signals-node@0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## @backstage/plugin-signals-react@0.0.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.11-next.0

## @backstage/plugin-techdocs-addons-test-utils@2.0.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs@1.19.0-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/test-utils@1.7.23-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/plugin-catalog@2.0.10-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-search-react@1.11.9-next.0

## @backstage/plugin-techdocs-backend@2.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/plugin-techdocs-node@2.0.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-techdocs-module-addons-contrib@1.1.41-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0

## @backstage/plugin-techdocs-node@2.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-search-common@1.2.26-next.0

## @backstage/plugin-techdocs-react@1.3.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/catalog-model@1.10.2-next.0

## @backstage/plugin-user-settings@0.9.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-signals-react@0.0.27-next.0

## @backstage/plugin-user-settings-backend@0.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-signals-node@0.2.6-next.0

## example-app@0.0.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/cli@0.36.7-next.0
  - @backstage/plugin-techdocs@1.19.0-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/plugin-catalog-import@0.13.19-next.0
  - @backstage/plugin-scaffolder@1.39.1-next.0
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.41-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-app-api@0.16.9-next.0
  - @backstage/frontend-defaults@0.5.7-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-home@0.9.11-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/core-compat-api@0.5.16-next.0
  - @backstage/plugin-auth@0.1.13-next.0
  - @backstage/plugin-auth-react@0.1.32-next.0
  - @backstage/plugin-catalog@2.0.10-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.36-next.0
  - @backstage/plugin-devtools@0.1.44-next.0
  - @backstage/plugin-notifications@0.6.1-next.0
  - @backstage/plugin-search@1.7.9-next.0
  - @backstage/plugin-user-settings@0.9.8-next.0
  - @backstage/app-defaults@1.7.13-next.0
  - @backstage/plugin-api-docs@0.14.6-next.0
  - @backstage/plugin-app@0.5.4-next.0
  - @backstage/plugin-app-module-user-settings@0.1.3-next.0
  - @backstage/plugin-app-react@0.2.8-next.0
  - @backstage/plugin-app-visualizer@0.2.9-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-catalog-graph@0.6.9-next.0
  - @backstage/plugin-home-react@0.1.43-next.0
  - @backstage/plugin-kubernetes@0.12.24-next.0
  - @backstage/plugin-kubernetes-cluster@0.0.42-next.0
  - @backstage/plugin-org@0.7.10-next.0
  - @backstage/plugin-scaffolder-react@2.1.1-next.0
  - @backstage/plugin-search-common@1.2.26-next.0
  - @backstage/plugin-search-react@1.11.9-next.0
  - @backstage/plugin-signals@0.0.36-next.0

## app-example-plugin@0.0.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## example-app-legacy@0.2.126-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/cli@0.36.7-next.0
  - @backstage/plugin-techdocs@1.19.0-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/plugin-catalog-import@0.13.19-next.0
  - @backstage/plugin-scaffolder@1.39.1-next.0
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.41-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0
  - @backstage/frontend-app-api@0.16.9-next.0
  - @backstage/plugin-home@0.9.11-next.0
  - @backstage/plugin-permission-react@0.5.6-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-auth-react@0.1.32-next.0
  - @backstage/plugin-catalog@2.0.10-next.0
  - @backstage/plugin-catalog-react@3.2.4-next.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.36-next.0
  - @backstage/plugin-devtools@0.1.44-next.0
  - @backstage/plugin-notifications@0.6.1-next.0
  - @backstage/plugin-search@1.7.9-next.0
  - @backstage/plugin-user-settings@0.9.8-next.0
  - @backstage/app-defaults@1.7.13-next.0
  - @backstage/plugin-api-docs@0.14.6-next.0
  - @backstage/plugin-catalog-common@1.2.1-next.0
  - @backstage/plugin-catalog-graph@0.6.9-next.0
  - @backstage/plugin-home-react@0.1.43-next.0
  - @backstage/plugin-kubernetes@0.12.24-next.0
  - @backstage/plugin-kubernetes-cluster@0.0.42-next.0
  - @backstage/plugin-mui-to-bui@0.2.12-next.0
  - @backstage/plugin-org@0.7.10-next.0
  - @backstage/plugin-scaffolder-react@2.1.1-next.0
  - @backstage/plugin-search-common@1.2.26-next.0
  - @backstage/plugin-search-react@1.11.9-next.0
  - @backstage/plugin-signals@0.0.36-next.0

## example-backend@0.0.55-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@4.0.1-next.0
  - @backstage/plugin-auth-backend-module-guest-provider@0.2.24-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/plugin-catalog-backend-module-openapi@0.2.27-next.0
  - @backstage/plugin-scaffolder-backend@4.2.1-next.0
  - @backstage/plugin-scaffolder-backend-module-github@0.10.1-next.0
  - @backstage/plugin-techdocs-backend@2.3.1-next.0
  - @backstage/plugin-catalog-backend-module-logs@0.1.27-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-app-backend@0.5.19-next.0
  - @backstage/plugin-auth-backend@0.30.2-next.0
  - @backstage/plugin-auth-backend-module-openshift-provider@0.1.12-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.19-next.0
  - @backstage/plugin-devtools-backend@0.5.22-next.0
  - @backstage/plugin-events-backend@0.6.7-next.0
  - @backstage/plugin-events-backend-module-google-pubsub@0.2.8-next.0
  - @backstage/plugin-kubernetes-backend@0.21.12-next.0
  - @backstage/plugin-mcp-actions-backend@0.2.3-next.0
  - @backstage/plugin-notifications-backend@0.6.10-next.0
  - @backstage/plugin-permission-backend@0.7.17-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/plugin-search-backend@2.1.8-next.0
  - @backstage/plugin-search-backend-module-catalog@0.3.20-next.0
  - @backstage/plugin-search-backend-module-elasticsearch@2.0.1-next.0
  - @backstage/plugin-search-backend-module-explore@0.3.19-next.0
  - @backstage/plugin-search-backend-module-techdocs@0.4.19-next.0
  - @backstage/plugin-search-backend-node@1.4.9-next.0
  - @backstage/plugin-signals-backend@0.3.20-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-auth-backend-module-github-provider@0.5.8-next.0
  - @backstage/plugin-catalog-backend-module-unprocessed@0.6.17-next.0
  - @backstage/plugin-proxy-backend@0.6.19-next.0
  - @backstage/plugin-user-settings-backend@0.4.8-next.0
  - @backstage/plugin-catalog-backend-module-ai-model@0.1.5-next.0
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.25-next.0
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.2.24-next.0
  - @backstage/plugin-scaffolder-backend-module-notifications@0.1.27-next.0

## @internal/backend@0.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.2-next.0

## @internal/cli@0.0.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0

## @backstage/connections-node@0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## e2e-test@0.2.45-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/create-app@0.9.3-next.0
  - @backstage/cli-common@0.3.2-next.0

## @internal/frontend@0.0.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/filter-predicates@0.1.6-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0

## @internal/scaffolder@0.0.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/plugin-scaffolder-react@2.1.1-next.0

## techdocs-cli-embedded-app@0.2.125-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/cli@0.36.7-next.0
  - @backstage/plugin-techdocs@1.19.0-next.0
  - @backstage/integration-react@1.2.23-next.0
  - @backstage/core-app-api@1.20.6-next.0
  - @backstage/core-components@0.18.15-next.0
  - @backstage/frontend-defaults@0.5.7-next.0
  - @backstage/frontend-plugin-api@0.18.2-next.0
  - @backstage/test-utils@1.7.23-next.0
  - @backstage/plugin-techdocs-react@1.3.16-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog@2.0.10-next.0
  - @backstage/plugin-app-react@0.2.8-next.0

## yarn-plugin-backstage@0.0.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## @backstage/plugin-connections-example-backend@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## @backstage/plugin-connections-example-backend-module-gitlab@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/connections@0.4.1-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @internal/plugin-todo-list@1.0.56-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.15-next.0
  - @backstage/core-plugin-api@1.12.11-next.0

## @internal/plugin-todo-list-backend@1.0.55-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0

## @internal/plugin-todo-list-common@1.0.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.12-next.0
