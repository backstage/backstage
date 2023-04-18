# @backstage/plugin-sonarqube-react

## 0.1.5

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/core-plugin-api@1.5.1-next.1

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/catalog-model@1.2.1

## 0.1.5-next.0

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/catalog-model@1.2.1

## 0.1.4

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 8ae65a0bc1d: Moved imports from `/alpha` to main public exports.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.0
  - @backstage/catalog-model@1.2.1

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/catalog-model@1.2.1-next.1

## 0.1.4-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- 8ae65a0bc1: Moved imports from `/alpha` to main public exports.
- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0
  - @backstage/core-plugin-api@1.4.0

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/core-plugin-api@1.3.0

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/core-plugin-api@1.3.0

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-plugin-api@1.2.1-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/core-plugin-api@1.2.0

## 0.1.0

### Minor Changes

- 6b59903bfa: Parts of plugin-sonarqube have been moved into a new plugin-sonarqube-react package. Additionally some types that were
  previously internal to plugin-sonarqube have been made public and will allow access for third-parties. As the sonarqube
  plugin has not yet reached 1.0 breaking changes are expected in the future. As such exports of plugin-sonarqube-react
  require importing via the `/alpha` entrypoint:

  ```ts
  import { sonarQubeApiRef } from '@backstage/plugin-sonarqube-react/alpha';

  const sonarQubeApi = useApi(sonarQubeApiRef);
  ```

  Moved from plugin-sonarqube to plugin-sonarqube-react:

  - isSonarQubeAvailable
  - SONARQUBE_PROJECT_KEY_ANNOTATION

  Exports that been introduced to plugin-sonarqube-react are documented in the [API report](https://github.com/backstage/backstage/blob/master/plugins/sonarqube-react/api-report.md).

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/catalog-model@1.1.4
