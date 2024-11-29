# Release v1.18.0-next.2

## @backstage/core-app-api@1.10.0-next.2

### Minor Changes

- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## @backstage/core-plugin-api@1.6.0-next.2

### Minor Changes

- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## @backstage/plugin-catalog@1.13.0-next.2

### Minor Changes

- e44f45ac4515: This change allows a new annotation of `backstage.io/techdocs-entity` this ref allows you to reference another entity for its TechDocs. This allows you have a single TechDoc for all items in a system, for example you might have a frontend and a backend in the same repo. This would allow you to have TechDocs build under a `System` entity while referencing the system e.g.: `backstage.io/techdocs-entity: system:default/example` that will show the systems docs in both the TechDocs button and the TechDocs tab without needing to do duplicate builds and filling the TechDocs page with garbage.

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-scaffolder-common@1.4.1-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-permission-backend-module-allow-all-policy@0.1.0-next.0

### Minor Changes

- 5f7b2153526b: Created package with policy `permissionModuleAllowAllPolicy`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1

## @backstage/plugin-techdocs@1.7.0-next.2

### Minor Changes

- e44f45ac4515: This change allows a new annotation of `backstage.io/techdocs-entity` this ref allows you to reference another entity for its TechDocs. This allows you have a single TechDoc for all items in a system, for example you might have a frontend and a backend in the same repo. This would allow you to have TechDocs build under a `System` entity while referencing the system e.g.: `backstage.io/techdocs-entity: system:default/example` that will show the systems docs in both the TechDocs button and the TechDocs tab without needing to do duplicate builds and filling the TechDocs page with garbage.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/app-defaults@1.4.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/theme@0.4.1

## @backstage/backend-app-api@0.5.3-next.2

### Patch Changes

- 37a20c7f14aa: Adds include and exclude configuration to feature discovery of backend packages
  Adds alpha modules to feature discovery
- 3fc64b9e2f8f: Extension points are now tracked via their ID rather than reference, in order to support package duplication.
- b219d097b3f4: Backend startup will now fail if any circular service dependencies are detected.
- Updated dependencies
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/backend-common@0.19.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/backend-dev-utils@0.1.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/backend-defaults@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/backend-plugin-api@0.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## @backstage/backend-tasks@0.5.8-next.2

### Patch Changes

- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/backend-test-utils@0.2.3-next.2

### Patch Changes

- 58cb5e5cea7b: Introduced a new utility for testing service factories, `ServiceFactoryTester`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0

## @backstage/catalog-client@1.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1

## @backstage/catalog-model@1.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/cli@0.22.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- ea779492ad88: Updated dependency `run-script-webpack-plugin` to `^0.2.0`.
- Updated dependencies
  - @backstage/release-manifests@0.0.10-next.0
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1
  - @backstage/eslint-plugin@0.1.3
  - @backstage/types@1.1.0

## @backstage/config@1.1.0-next.1

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/config-loader@1.5.0-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/core-components@0.13.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- db92d1244897: Updated dependency `rc-progress` to `3.5.1`.
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/version-bridge@1.0.4

## @backstage/create-app@0.5.5-next.2

### Patch Changes

- 8db70ecbb325: Updated Dockerfile to include `apt-get update` when installing the SQLite dependency
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/cli-common@0.1.12

## @backstage/dev-utils@1.0.21-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/app-defaults@1.4.3-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/test-utils@1.4.3-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/integration@1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1

## @backstage/integration-aws-node@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1

## @backstage/integration-react@1.1.19-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/theme@0.4.1

## @backstage/release-manifests@0.0.10-next.0

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency

## @backstage/repo-tools@0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1

## @techdocs/cli@1.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-techdocs-node@1.8.0-next.2
  - @backstage/cli-common@0.1.12

## @backstage/test-utils@1.4.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## @backstage/plugin-adr@0.6.7-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-adr-common@0.2.15-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-adr-backend@0.3.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-adr-common@0.2.15-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-adr-common@0.2.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-airbrake@0.3.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/test-utils@1.4.3-next.2
  - @backstage/dev-utils@1.0.21-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-airbrake-backend@0.2.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-allure@0.1.40-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-analytics-module-ga@0.1.33-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-analytics-module-ga4@0.1.4-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-analytics-module-newrelic-browser@0.0.2-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1

## @backstage/plugin-apache-airflow@0.2.15-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2

## @backstage/plugin-api-docs@0.9.11-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/plugin-catalog@1.13.0-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-apollo-explorer@0.1.15-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-app-backend@0.3.51-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-app-node@0.1.3-next.2

## @backstage/plugin-app-node@0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-auth-backend@0.18.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-backend-module-gcp-iap-provider@0.1.0-next.2
  - @backstage/plugin-auth-backend-module-github-provider@0.1.0-next.2
  - @backstage/plugin-auth-backend-module-gitlab-provider@0.1.0-next.1
  - @backstage/plugin-auth-backend-module-google-provider@0.1.0-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-auth-backend-module-github-provider@0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-auth-backend-module-gitlab-provider@0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-auth-backend-module-google-provider@0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-auth-node@0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-azure-devops@0.3.6-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-azure-devops-common@0.3.0

## @backstage/plugin-azure-devops-backend@0.3.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-azure-devops-common@0.3.0

## @backstage/plugin-azure-sites@0.1.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-azure-sites-common@0.1.0

## @backstage/plugin-azure-sites-backend@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-azure-sites-common@0.1.0

## @backstage/plugin-badges@0.2.48-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-badges-backend@0.2.6-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-bazaar@0.2.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.13.0-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/cli@0.22.13-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-bazaar-backend@0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-bitbucket-cloud-common@0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.0-next.2

## @backstage/plugin-bitrise@0.1.51-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-catalog-backend@1.13.0-next.2

### Patch Changes

- acffa17027b6: Added some examples to the catalog OpenAPI definition
- 45947d3b2759: Fixes an issue where `order` was not a recognized parameter for the `/entities` endpoint.
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2
  - @backstage/plugin-scaffolder-common@1.4.1-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-catalog-backend-module-aws@0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## @backstage/plugin-catalog-backend-module-azure@0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.12-next.2

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.12-next.2
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-catalog-backend-module-gcp@0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## @backstage/plugin-catalog-backend-module-gerrit@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-catalog-backend-module-github@0.3.8-next.2

### Patch Changes

- 96353bb7cb4a: Properly support custom `userTransformer` returning `undefined` in `GithubMultiOrgEntityProvider`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-catalog-backend-module-gitlab@0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-catalog-backend-module-ldap@0.5.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-backend-module-msgraph@0.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-backend-module-openapi@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-catalog-backend-module-unprocessed@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1

## @backstage/plugin-catalog-common@1.0.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-catalog-graph@0.2.36-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## @backstage/plugin-catalog-graphql@0.3.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/types@1.1.0

## @backstage/plugin-catalog-import@0.9.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-node@1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-react@1.8.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-catalog-unprocessed-entities@0.1.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-cicd-statistics@0.1.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-cicd-statistics@0.1.26-next.2
  - @backstage/catalog-model@1.4.2-next.1

## @backstage/plugin-circleci@0.3.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-cloudbuild@0.3.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-code-climate@0.1.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-code-coverage@0.2.17-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-code-coverage-backend@0.2.17-next.2

### Patch Changes

- df005d9932fb: Add text body parser for LCOV reports

- 91ccb56fb418: Replace `express-xml-bodyparser` with `body-parser-xml`.

  `express-xml-bodyparser` was last updated 8 years ago
  and currently depends on a version of `xml2js` which
  contains a vulnerability.

  This change will swap it out in favor of `body-parser-xml`
  which is more maintained and depends on a more recent `xml2js`
  version without the vulnerability.

- 33e606a797ef: Include auth token when fetching entity

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-codescene@0.1.17-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- db92d1244897: Updated dependency `rc-progress` to `3.5.1`.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-config-schema@0.1.45-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## @backstage/plugin-cost-insights@0.12.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-cost-insights-common@0.1.1

## @backstage/plugin-devtools@0.1.4-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-devtools-common@0.1.4-next.1

## @backstage/plugin-devtools-backend@0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-devtools-common@0.1.4-next.1

## @backstage/plugin-devtools-common@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## @backstage/plugin-dynatrace@7.0.4-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-entity-feedback@0.2.7-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-entity-feedback-common@0.1.2

## @backstage/plugin-entity-feedback-backend@0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/plugin-entity-feedback-common@0.1.2

## @backstage/plugin-entity-validation@0.1.9-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-events-backend@0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-aws-sqs@0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-azure@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-gerrit@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-github@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-module-gitlab@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-backend-test-utils@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.12-next.2

## @backstage/plugin-events-node@0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-explore@0.4.10-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-explore-react@0.0.31-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-explore-backend@0.0.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-search-backend-module-explore@0.1.7-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-explore-react@0.0.31-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-explore-common@0.0.1

## @backstage/plugin-firehydrant@0.2.8-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-fossa@0.2.56-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-gcalendar@0.3.18-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-gcp-projects@0.3.41-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-git-release-manager@0.3.37-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-github-actions@0.6.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-github-deployments@0.1.55-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-github-issues@0.2.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-github-pull-requests-board@0.1.18-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-gitops-profiles@0.3.40-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-gocd@0.1.30-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-graphiql@0.2.54-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-graphql-backend@0.1.41-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-graphql@0.3.23-next.1

## @backstage/plugin-graphql-voyager@0.1.7-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-home@0.5.8-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-home-react@0.1.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-home-react@0.1.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2

## @backstage/plugin-ilert@0.2.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-jenkins@0.8.6-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-jenkins-common@0.1.19-next.1

## @backstage/plugin-jenkins-backend@0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-jenkins-common@0.1.19-next.1

## @backstage/plugin-jenkins-common@0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.1

## @backstage/plugin-kafka@0.3.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-kafka-backend@0.2.44-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-kubernetes@0.10.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## @backstage/plugin-kubernetes-backend@0.11.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-kubernetes-common@0.6.6-next.1

## @backstage/plugin-kubernetes-common@0.6.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1

## @backstage/plugin-lighthouse@0.4.9-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-lighthouse-common@0.1.3-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-lighthouse-backend@0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-lighthouse-common@0.1.3-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/types@1.1.0

## @backstage/plugin-lighthouse-common@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1

## @backstage/plugin-linguist@0.1.9-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-linguist-common@0.1.1

## @backstage/plugin-linguist-backend@0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-linguist-common@0.1.1

## @backstage/plugin-microsoft-calendar@0.1.7-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-newrelic@0.3.40-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-newrelic-dashboard@0.2.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-nomad@0.1.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-nomad-backend@0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-octopus-deploy@0.2.6-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-opencost@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-org@0.6.14-next.2

### Patch Changes

- dd9329caea1c: Entity relations toggle should by default be aggregated for User entities
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-org-react@0.1.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-pagerduty@0.6.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-home-react@0.1.3-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-periskop@0.1.22-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-periskop-backend@0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-permission-backend@0.5.26-next.2

### Patch Changes

- 84ad6fccd4d5: Moved `permissionModuleAllowAllPolicy` to `@backstage/plugin-permission-backend-module-allow-all-policy`
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-permission-common@0.7.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-permission-node@0.7.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-permission-react@0.4.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1

## @backstage/plugin-playlist@0.1.16-next.2

### Patch Changes

- 79847cb73ed7: Updated latest playlist screen in readme document
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-playlist-common@0.1.10-next.1

## @backstage/plugin-playlist-backend@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-playlist-common@0.1.10-next.1

## @backstage/plugin-playlist-common@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.8-next.1

## @backstage/plugin-proxy-backend@0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## @backstage/plugin-puppetdb@0.1.7-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-rollbar@0.4.24-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-rollbar-backend@0.1.48-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2

## @backstage/plugin-scaffolder@1.14.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-react@1.5.5-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## @backstage/plugin-scaffolder-backend@1.16.6-next.2

### Patch Changes

- ded27b83ead2: Add examples for `publish:bitbucket` scaffolder actions.
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-scaffolder-backend-module-gitlab@0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-scaffolder-backend-module-rails@0.4.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/types@1.1.0

## @backstage/plugin-scaffolder-common@1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## @backstage/plugin-scaffolder-node@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## @backstage/plugin-scaffolder-react@1.5.5-next.2

### Patch Changes

- 27fef07f9229: Updated dependency `use-immer` to `^0.9.0`.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## @backstage/plugin-search@1.4.0-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend@1.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-module-catalog@0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-module-elasticsearch@1.3.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-module-explore@0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-module-pg@0.5.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-module-techdocs@0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-techdocs-node@1.8.0-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-backend-node@1.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-search-common@1.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## @backstage/plugin-search-react@1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-sentry@0.5.9-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-shortcuts@0.3.14-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## @backstage/plugin-sonarqube@0.7.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- db92d1244897: Updated dependency `rc-progress` to `3.5.1`.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-sonarqube-react@0.1.8-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-sonarqube-backend@0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-sonarqube-react@0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/catalog-model@1.4.2-next.1

## @backstage/plugin-splunk-on-call@0.4.13-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @backstage/plugin-stack-overflow@0.1.20-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-home-react@0.1.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/theme@0.4.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-stack-overflow-backend@0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-stackstorm@0.1.6-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-tech-insights@0.3.16-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## @backstage/plugin-tech-insights-backend@0.5.17-next.2

### Patch Changes

- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-tech-insights-node@0.4.9-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.35-next.2

### Patch Changes

- 51b801f743b2: Handle extracting facts from 'not' conditions too
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-tech-insights-node@0.4.9-next.2
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11

## @backstage/plugin-tech-insights-node@0.4.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## @backstage/plugin-tech-radar@0.6.8-next.2

### Patch Changes

- b45d0ac68191: Add names to blip entry links in the radar to improve accessibility
- 6d35e9ea2afa: Add description property for Rings which will be shown in the footer.
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.21-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/plugin-techdocs@1.7.0-next.2
  - @backstage/plugin-catalog@1.13.0-next.2
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/test-utils@1.4.3-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-techdocs-backend@1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-techdocs-node@1.8.0-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-techdocs-module-addons-contrib@1.1.0-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/theme@0.4.1

## @backstage/plugin-techdocs-node@1.8.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/integration-aws-node@0.1.6-next.1
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-search-common@1.2.6-next.1

## @backstage/plugin-techdocs-react@1.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/version-bridge@1.0.4

## @backstage/plugin-todo@0.2.26-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-todo-backend@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/backend-openapi-utils@0.0.3
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1

## @backstage/plugin-user-settings@0.7.9-next.2

### Patch Changes

- e03f3ee2be94: changed auto theme tooltip title to camel case
- 8cec7664e146: Removed `@types/node` dependency
- 6e30769cc627: Introduced experimental support for internationalization.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## @backstage/plugin-user-settings-backend@0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## @backstage/plugin-vault@0.1.18-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## @backstage/plugin-vault-backend@0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1

## @backstage/plugin-xcmetrics@0.2.42-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1

## example-app@0.2.87-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-playlist@0.1.16-next.2
  - @backstage/plugin-tech-radar@0.6.8-next.2
  - @backstage/plugin-user-settings@0.7.9-next.2
  - @backstage/plugin-org@0.6.14-next.2
  - @backstage/plugin-techdocs@1.7.0-next.2
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.0-next.2
  - @backstage/plugin-catalog-unprocessed-entities@0.1.3-next.2
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/plugin-microsoft-calendar@0.1.7-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-entity-feedback@0.2.7-next.2
  - @backstage/plugin-apache-airflow@0.2.15-next.2
  - @backstage/plugin-github-actions@0.6.5-next.2
  - @backstage/plugin-octopus-deploy@0.2.6-next.2
  - @backstage/plugin-stack-overflow@0.1.20-next.2
  - @backstage/app-defaults@1.4.3-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/plugin-code-coverage@0.2.17-next.2
  - @backstage/plugin-cost-insights@0.12.13-next.2
  - @backstage/plugin-tech-insights@0.3.16-next.2
  - @backstage/plugin-azure-devops@0.3.6-next.2
  - @backstage/plugin-gcp-projects@0.3.41-next.2
  - @backstage/plugin-azure-sites@0.1.13-next.2
  - @backstage/plugin-cloudbuild@0.3.24-next.2
  - @backstage/plugin-kubernetes@0.10.3-next.2
  - @backstage/plugin-lighthouse@0.4.9-next.2
  - @backstage/plugin-scaffolder@1.14.5-next.2
  - @backstage/plugin-stackstorm@0.1.6-next.2
  - @backstage/plugin-dynatrace@7.0.4-next.2
  - @backstage/plugin-gcalendar@0.3.18-next.2
  - @backstage/plugin-pagerduty@0.6.5-next.2
  - @backstage/plugin-shortcuts@0.3.14-next.2
  - @backstage/plugin-airbrake@0.3.24-next.2
  - @backstage/plugin-api-docs@0.9.11-next.2
  - @backstage/plugin-circleci@0.3.24-next.2
  - @backstage/plugin-devtools@0.1.4-next.2
  - @backstage/plugin-graphiql@0.2.54-next.2
  - @backstage/plugin-linguist@0.1.9-next.2
  - @backstage/plugin-newrelic@0.3.40-next.2
  - @backstage/plugin-puppetdb@0.1.7-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-explore@0.4.10-next.2
  - @backstage/plugin-jenkins@0.8.6-next.2
  - @backstage/plugin-rollbar@0.4.24-next.2
  - @backstage/plugin-badges@0.2.48-next.2
  - @backstage/plugin-search@1.4.0-next.2
  - @backstage/plugin-sentry@0.5.9-next.2
  - @backstage/plugin-kafka@0.3.24-next.2
  - @backstage/plugin-nomad@0.1.5-next.2
  - @backstage/cli@0.22.13-next.2
  - @backstage/plugin-gocd@0.1.30-next.2
  - @backstage/plugin-home@0.5.8-next.2
  - @backstage/plugin-todo@0.2.26-next.2
  - @backstage/plugin-adr@0.6.7-next.2
  - @backstage/plugin-scaffolder-react@1.5.5-next.2
  - @internal/plugin-catalog-customized@0.0.14-next.2
  - @backstage/plugin-catalog-graph@0.2.36-next.2
  - @backstage/plugin-catalog-import@0.9.14-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-newrelic-dashboard@0.2.17-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-linguist-common@0.1.1
  - @backstage/plugin-search-common@1.2.6-next.1

## example-app-next@0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-playlist@0.1.16-next.2
  - @backstage/plugin-tech-radar@0.6.8-next.2
  - @backstage/plugin-user-settings@0.7.9-next.2
  - @backstage/plugin-org@0.6.14-next.2
  - @backstage/plugin-techdocs@1.7.0-next.2
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.0-next.2
  - @backstage/plugin-catalog-unprocessed-entities@0.1.3-next.2
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/plugin-microsoft-calendar@0.1.7-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-entity-feedback@0.2.7-next.2
  - @backstage/plugin-apache-airflow@0.2.15-next.2
  - @backstage/plugin-github-actions@0.6.5-next.2
  - @backstage/plugin-octopus-deploy@0.2.6-next.2
  - @backstage/plugin-stack-overflow@0.1.20-next.2
  - @backstage/app-defaults@1.4.3-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/plugin-code-coverage@0.2.17-next.2
  - @backstage/plugin-cost-insights@0.12.13-next.2
  - @backstage/plugin-tech-insights@0.3.16-next.2
  - @backstage/plugin-azure-devops@0.3.6-next.2
  - @backstage/plugin-gcp-projects@0.3.41-next.2
  - @backstage/plugin-azure-sites@0.1.13-next.2
  - @backstage/plugin-cloudbuild@0.3.24-next.2
  - @backstage/plugin-kubernetes@0.10.3-next.2
  - @backstage/plugin-lighthouse@0.4.9-next.2
  - @backstage/plugin-scaffolder@1.14.5-next.2
  - @backstage/plugin-stackstorm@0.1.6-next.2
  - @backstage/plugin-dynatrace@7.0.4-next.2
  - @backstage/plugin-gcalendar@0.3.18-next.2
  - @backstage/plugin-pagerduty@0.6.5-next.2
  - @backstage/plugin-shortcuts@0.3.14-next.2
  - @backstage/plugin-airbrake@0.3.24-next.2
  - @backstage/plugin-api-docs@0.9.11-next.2
  - @backstage/plugin-circleci@0.3.24-next.2
  - @backstage/plugin-devtools@0.1.4-next.2
  - @backstage/plugin-graphiql@0.2.54-next.2
  - @backstage/plugin-linguist@0.1.9-next.2
  - @backstage/plugin-newrelic@0.3.40-next.2
  - @backstage/plugin-puppetdb@0.1.7-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-explore@0.4.10-next.2
  - @backstage/plugin-jenkins@0.8.6-next.2
  - @backstage/plugin-rollbar@0.4.24-next.2
  - @backstage/plugin-badges@0.2.48-next.2
  - @backstage/plugin-search@1.4.0-next.2
  - @backstage/plugin-sentry@0.5.9-next.2
  - @backstage/plugin-kafka@0.3.24-next.2
  - @backstage/cli@0.22.13-next.2
  - @backstage/plugin-gocd@0.1.30-next.2
  - @backstage/plugin-home@0.5.8-next.2
  - @backstage/plugin-todo@0.2.26-next.2
  - @backstage/plugin-adr@0.6.7-next.2
  - @backstage/plugin-scaffolder-react@1.5.5-next.2
  - @internal/plugin-catalog-customized@0.0.14-next.2
  - @backstage/plugin-catalog-graph@0.2.36-next.2
  - @backstage/plugin-catalog-import@0.9.14-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-newrelic-dashboard@0.2.17-next.2
  - @backstage/plugin-search-react@1.7.0-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/frontend-app-api@0.0.1-next.1
  - @backstage/frontend-plugin-api@0.0.1-next.0
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-linguist-common@0.1.1
  - @backstage/plugin-search-common@1.2.6-next.1

## example-backend@0.2.87-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.16.6-next.2
  - @backstage/plugin-code-coverage-backend@0.2.17-next.2
  - @backstage/plugin-permission-backend@0.5.26-next.2
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/plugin-badges-backend@0.2.6-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.35-next.2
  - @backstage/plugin-tech-insights-backend@0.5.17-next.2
  - @backstage/backend-tasks@0.5.8-next.2
  - example-app@0.2.87-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-app-backend@0.3.51-next.2
  - @backstage/plugin-auth-backend@0.18.9-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-catalog-node@1.4.4-next.2
  - @backstage/plugin-entity-feedback-backend@0.1.9-next.2
  - @backstage/plugin-events-backend@0.2.12-next.2
  - @backstage/plugin-kubernetes-backend@0.11.6-next.2
  - @backstage/plugin-linguist-backend@0.4.3-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/plugin-playlist-backend@0.3.7-next.2
  - @backstage/plugin-proxy-backend@0.3.3-next.2
  - @backstage/plugin-rollbar-backend@0.1.48-next.2
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.4-next.2
  - @backstage/plugin-search-backend@1.4.3-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.2
  - @backstage/plugin-search-backend-module-explore@0.1.7-next.2
  - @backstage/plugin-search-backend-module-pg@0.5.12-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.2
  - @backstage/plugin-techdocs-backend@1.7.0-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-devtools-backend@0.1.6-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-adr-backend@0.3.9-next.2
  - @backstage/plugin-azure-devops-backend@0.3.30-next.2
  - @backstage/plugin-azure-sites-backend@0.1.13-next.2
  - @backstage/plugin-explore-backend@0.0.13-next.2
  - @backstage/plugin-graphql-backend@0.1.41-next.2
  - @backstage/plugin-jenkins-backend@0.2.6-next.2
  - @backstage/plugin-kafka-backend@0.2.44-next.2
  - @backstage/plugin-lighthouse-backend@0.2.7-next.2
  - @backstage/plugin-nomad-backend@0.1.5-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.20-next.2
  - @backstage/plugin-search-backend-module-elasticsearch@1.3.6-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-tech-insights-node@0.4.9-next.2
  - @backstage/plugin-todo-backend@0.2.3-next.2
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.2.3-next.2
  - @backstage/plugin-events-node@0.2.12-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## example-backend-next@0.0.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.16.6-next.2
  - @backstage/plugin-permission-backend@0.5.26-next.2
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/plugin-badges-backend@0.2.6-next.2
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-defaults@0.2.3-next.2
  - @backstage/plugin-app-backend@0.3.51-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-entity-feedback-backend@0.1.9-next.2
  - @backstage/plugin-kubernetes-backend@0.11.6-next.2
  - @backstage/plugin-linguist-backend@0.4.3-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/plugin-proxy-backend@0.3.3-next.2
  - @backstage/plugin-search-backend@1.4.3-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.7-next.2
  - @backstage/plugin-search-backend-module-explore@0.1.7-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.1.7-next.2
  - @backstage/plugin-techdocs-backend@1.7.0-next.2
  - @backstage/plugin-devtools-backend@0.1.6-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-adr-backend@0.3.9-next.2
  - @backstage/plugin-azure-devops-backend@0.3.30-next.2
  - @backstage/plugin-lighthouse-backend@0.2.7-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/plugin-todo-backend@0.2.3-next.2
  - @backstage/plugin-catalog-backend-module-unprocessed@0.2.3-next.2

## @backstage/backend-plugin-manager@0.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.13.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-events-backend@0.2.12-next.2
  - @backstage/plugin-permission-node@0.7.14-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/plugin-search-backend-node@1.2.7-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.12-next.2
  - @backstage/plugin-search-common@1.2.6-next.1

## e2e-test@0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.5-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1

## @backstage/frontend-app-api@0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-graphiql@0.2.54-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/frontend-plugin-api@0.0.1-next.0
  - @backstage/types@1.1.0

## @backstage/frontend-plugin-api@0.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/types@1.1.0

## techdocs-cli-embedded-app@0.2.86-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs@1.7.0-next.2
  - @backstage/plugin-catalog@1.13.0-next.2
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/app-defaults@1.4.3-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/test-utils@1.4.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/cli@0.22.13-next.2
  - @backstage/plugin-techdocs-react@1.1.10-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/theme@0.4.1

## @internal/plugin-catalog-customized@0.0.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.13.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2

## @internal/plugin-todo-list@1.0.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/theme@0.4.1

## @internal/plugin-todo-list-backend@1.0.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/errors@1.2.1

## @internal/plugin-todo-list-common@1.0.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.8-next.1
