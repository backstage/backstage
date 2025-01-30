# @backstage/plugin-search-backend-module-explore

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/plugin-search-backend-node@1.3.8-next.0
  - @backstage/plugin-search-common@1.2.17

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/plugin-search-backend-node@1.3.7
  - @backstage/plugin-search-common@1.2.17

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-search-common@1.2.17-next.0
  - @backstage/plugin-search-backend-node@1.3.7-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/plugin-search-backend-node@1.3.7-next.0
  - @backstage/plugin-search-common@1.2.16

## 0.2.6

### Patch Changes

- ed0aaec: Update README
- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-search-backend-node@1.3.6
  - @backstage/config@1.3.1
  - @backstage/plugin-search-common@1.2.16

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-search-backend-node@1.3.6-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/plugin-search-common@1.2.16-next.0

## 0.2.6-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.6-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/plugin-search-common@1.2.15

## 0.2.6-next.0

### Patch Changes

- ed0aaec: Update README
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/config@1.3.0
  - @backstage/plugin-search-backend-node@1.3.6-next.0
  - @backstage/plugin-search-common@1.2.15

## 0.2.5

### Patch Changes

- a9a7c7c: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.7`.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-search-backend-node@1.3.5
  - @backstage/plugin-search-common@1.2.15

## 0.2.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.5-next.3
  - @backstage/plugin-search-common@1.2.14

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.5-next.2
  - @backstage/plugin-search-common@1.2.14

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.5-next.1
  - @backstage/plugin-search-common@1.2.14

## 0.2.5-next.0

### Patch Changes

- a9a7c7c: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.7`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.5-next.0
  - @backstage/plugin-search-common@1.2.14

## 0.2.3

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- c052931: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.6`.
- 2f88f88: Updated backend installation instructions.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.3
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.14

## 0.2.3-next.2

### Patch Changes

- c052931: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.6`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.3-next.1
  - @backstage/plugin-search-common@1.2.14

## 0.2.3-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 2f88f88: Updated backend installation instructions.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.14

## 0.2.2

### Patch Changes

- 19ff127: Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 5726390: The following collator factories are deprecated, please [migrate](https://backstage.io/docs/backend-system/building-backends/migrating) to the new backend system and follow the instructions below to install collators via module:

  - `DefaultCatalogCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-catalog/README.md#installation;
  - `ToolDocumentCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-explore/README.md#installation;
  - `DefaultTechDocsCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-techdocs/README.md#installation.

- 276f433: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.5`.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.2
  - @backstage/plugin-search-common@1.2.14

## 0.2.2-next.2

### Patch Changes

- 276f433: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.5`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.2-next.2
  - @backstage/plugin-search-common@1.2.14

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.2-next.1
  - @backstage/plugin-search-common@1.2.14

## 0.2.2-next.0

### Patch Changes

- 19ff127: Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 5726390: The following collator factories are deprecated, please [migrate](https://backstage.io/docs/backend-system/building-backends/migrating) to the new backend system and follow the instructions below to install collators via module:

  - `DefaultCatalogCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-catalog/README.md#installation;
  - `ToolDocumentCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-explore/README.md#installation;
  - `DefaultTechDocsCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-techdocs/README.md#installation.

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-search-backend-node@1.3.2-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.14

## 0.2.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 93fc1a0: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.4`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-search-backend-node@1.3.0
  - @backstage/plugin-search-common@1.2.14
  - @backstage/config@1.2.0

## 0.1.29-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.28-next.3
  - @backstage/plugin-search-common@1.2.14-next.1

## 0.1.29-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-search-backend-node@1.2.28-next.2
  - @backstage/plugin-search-common@1.2.14-next.1
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/config@1.2.0

## 0.1.29-next.1

### Patch Changes

- 93fc1a0: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.4`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-search-backend-node@1.2.28-next.1
  - @backstage/plugin-search-common@1.2.14-next.0
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/config@1.2.0

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.28-next.0
  - @backstage/plugin-search-common@1.2.13

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-search-backend-node@1.2.27
  - @backstage/plugin-search-common@1.2.13
  - @backstage/config@1.2.0

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.2.27-next.1
  - @backstage/plugin-search-common@1.2.12

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-search-backend-node@1.2.26-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.12

## 0.1.25

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-search-backend-node@1.2.24
  - @backstage/plugin-search-common@1.2.12
  - @backstage/config@1.2.0

## 0.1.25-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-search-backend-node@1.2.24-next.3
  - @backstage/plugin-search-common@1.2.12-next.0
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0

## 0.1.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-search-backend-node@1.2.24-next.2
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-search-backend-node@1.2.24-next.1

## 0.1.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-search-backend-node@1.2.24-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.1.24

### Patch Changes

- ca6e2e0: Migrate search collator to use the new auth services.
- 5d99272: Update README.md to point to explore plugin in community-plugins repository.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-search-backend-node@1.2.22

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-search-backend-node@1.2.22-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.23-next.0

### Patch Changes

- ca6e2e0: Migrate search collator to use the new auth services.
- 5d99272: Update README.md to point to explore plugin in community-plugins repository.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.22-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-search-common@1.2.11

## 0.1.21

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-search-backend-node@1.2.21
  - @backstage/backend-tasks@0.5.22
  - @backstage/config@1.2.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11

## 0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-search-backend-node@1.2.21-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.21-next.0
  - @backstage/plugin-search-common@1.2.11

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-search-backend-node@1.2.20
  - @backstage/config@1.2.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-search-backend-node@1.2.19
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11

## 0.1.18

### Patch Changes

- bb368a5: Migrated to support new auth services.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-search-common@1.2.11
  - @backstage/backend-tasks@0.5.19
  - @backstage/plugin-search-backend-node@1.2.18
  - @backstage/plugin-explore-common@0.0.2

## 0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.18-next.2
  - @backstage/plugin-search-common@1.2.11-next.1

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11-next.1

## 0.1.17-next.0

### Patch Changes

- bb368a5: Migrated to support new auth services.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-search-common@1.2.11-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/plugin-search-backend-node@1.2.17-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/plugin-explore-common@0.0.2

## 0.1.14

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/plugin-search-backend-node@1.2.14
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.10

## 0.1.14-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-search-backend-node@1.2.14-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.10

## 0.1.14-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-search-backend-node@1.2.14-next.2
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.10

## 0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.14-next.1
  - @backstage/plugin-search-common@1.2.10

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-search-backend-node@1.2.14-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.10

## 0.1.13

### Patch Changes

- 2e6c56b: Update wording to show that the backend system no longer is in alpha
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-search-backend-node@1.2.13
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.10

## 0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-search-backend-node@1.2.13-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-search-backend-node@1.2.13-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.9

## 0.1.13-next.0

### Patch Changes

- 2e6c56b: Update wording to show that the backend system no longer is in alpha
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.13-next.0
  - @backstage/plugin-search-common@1.2.9

## 0.1.12

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-search-backend-node@1.2.12
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.9

## 0.1.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.12-next.3
  - @backstage/plugin-search-common@1.2.8

## 0.1.12-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.12-next.2
  - @backstage/plugin-search-common@1.2.8

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-search-backend-node@1.2.12-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.8

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.11
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.8

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-search-backend-node@1.2.11-next.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/plugin-search-backend-node@1.2.11-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.11-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-search-backend-node@1.2.10-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7-next.0

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-search-backend-node@1.2.9-next.1
  - @backstage/config@1.1.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.6

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.9-next.0
  - @backstage/plugin-search-common@1.2.6

## 0.1.7

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.6
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-search-backend-node@1.2.7

## 0.1.7-next.3

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/plugin-explore-common@0.0.2-next.0
  - @backstage/plugin-search-common@1.2.6-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-search-backend-node@1.2.7-next.3

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.6-next.1

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.1
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.6-next.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.6-next.0
  - @backstage/plugin-search-common@1.2.5

## 0.1.4

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 29f77f923c71: Ensure that all services are dependency injected into the module instead of taken from options
- 12a8c94eda8d: Add package repository and homepage metadata
- 6694e79ab396: Breaking change for the alpha export moved `schedule` from module options into app-config for the new backend system. You can now pass in a `TaskScheduleDefinitionConfig` through the `search.collators.explore.schedule` configuration key.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-search-backend-node@1.2.4
  - @backstage/backend-tasks@0.5.5
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.5

## 0.1.4-next.2

### Patch Changes

- 29f77f923c71: Ensure that all services are dependency injected into the module instead of taken from options
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## 0.1.4-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-search-backend-node@1.2.4-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.5

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.2.4-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.5

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.3
  - @backstage/plugin-search-common@1.2.5

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.3-next.0
  - @backstage/plugin-search-common@1.2.5-next.0

## 0.1.2

### Patch Changes

- a5baeea2cb87: Allows for an optional `tokenManager` to authenticate requests from the collator to the explore backend. For example:

  ```diff
    indexBuilder.addCollator({
      schedule: every10MinutesSchedule,
      factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        logger: env.logger,
      + tokenManager: env.tokenManager,
      }),
    });
  ```

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-search-backend-node@1.2.2
  - @backstage/config@1.0.8
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.4

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.2-next.2
  - @backstage/plugin-search-common@1.2.4-next.0

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-search-backend-node@1.2.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.4-next.0

## 0.1.2-next.0

### Patch Changes

- a5baeea2cb87: Allows for an optional `tokenManager` to authenticate requests from the collator to the explore backend. For example:

  ```diff
    indexBuilder.addCollator({
      schedule: every10MinutesSchedule,
      factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        logger: env.logger,
      + tokenManager: env.tokenManager,
      }),
    });
  ```

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.2-next.0
  - @backstage/plugin-search-common@1.2.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-search-backend-node@1.2.1
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.3

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-search-backend-node@1.2.1-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.3

## 0.1.0

### Minor Changes

- 01ae205352e: Package introduced to export search backend modules that can be used with the new backend system to extend search with plugin specific functionality, such as collators. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/plugin-search-backend-node@1.2.0
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.3

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-backend-node@1.2.0-next.2
  - @backstage/plugin-search-common@1.2.3-next.0

## 0.1.0-next.0

### Minor Changes

- 01ae205352e: Package introduced to export search backend modules that can be used with the new backend system to extend search with plugin specific functionality, such as collators. For documentation on how to migrate, check out the [how to migrate to the new backend system guide](https://backstage.io/docs/features/search/how-to-guides/#how-to-migrate-your-backend-installation-to-use-search-together-with-the-new-backend-system).

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/plugin-search-backend-node@1.2.0-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.3-next.0
