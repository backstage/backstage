# @backstage/plugin-tech-insights-backend

## 0.5.24-next.2

### Patch Changes

- 7201af3: Add support for the new backend system.

  A new backend plugin for the tech-insights backend
  was added and exported as `default`.

  You can use it with the new backend system like

  ```ts title="packages/backend/src/index.ts"
  backend.add(import('@backstage/plugin-tech-insights-backend'));
  ```

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 341c2a2: Move `FactRetrieverRegistry` and `PersistenceContext` to `@backstage/plugin-tech-insights-node`.

  Original exports are marked as deprecated and re-export the moved types.

  Please replace uses like

  ```ts
  import {
    FactRetrieverRegistry,
    PersistenceContext,
  } from '@backstage/plugin-tech-insights-backend';
  ```

  with

  ```ts
  import {
    FactRetrieverRegistry,
    PersistenceContext,
  } from '@backstage/plugin-tech-insights-node';
  ```

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-tech-insights-node@0.4.16-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.16-next.1

## 0.5.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-tech-insights-node@0.4.16-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/catalog-client@1.5.2
  - @backstage/plugin-tech-insights-node@0.4.15
  - @backstage/backend-tasks@0.5.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/backend-tasks@0.5.14-next.2
  - @backstage/plugin-tech-insights-node@0.4.15-next.2

## 0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-tech-insights-node@0.4.15-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-tech-insights-node@0.4.15-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.22

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/catalog-client@1.5.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-tech-insights-node@0.4.14
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.22-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.3

## 0.5.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.2

## 0.5.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.1

## 0.5.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-tech-insights-node@0.4.14-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.21

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- 193ad022bb: Add `factRetrieverId` to the fact retriever's logger metadata.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-tasks@0.5.12
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.13

## 0.5.21-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-tech-insights-node@0.4.13-next.2

## 0.5.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/plugin-tech-insights-node@0.4.13-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.21-next.0

### Patch Changes

- 193ad022bb: Add `factRetrieverId` to the fact retriever's logger metadata.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.13-next.0

## 0.5.20

### Patch Changes

- cc7dddfa7f: Increase the maximum allowed length of an entity filter for tech insights fact schemas.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-node@0.4.12
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/plugin-tech-insights-node@0.4.12-next.2
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/plugin-tech-insights-node@0.4.11-next.1
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.5.19-next.0

### Patch Changes

- cc7dddfa7f: Increase the maximum allowed length of an entity filter for tech insights fact schemas.
- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.11-next.0

## 0.5.17

### Patch Changes

- cfc3ca6ce060: Changes needed to support MySQL
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-node@0.4.9

## 0.5.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-tech-insights-common@0.2.12-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-tech-insights-node@0.4.9-next.3

## 0.5.17-next.2

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

## 0.5.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-tech-insights-node@0.4.9-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.5.16-next.0

### Patch Changes

- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.8-next.0

## 0.5.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-tasks@0.5.5
  - @backstage/plugin-tech-insights-node@0.4.6
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.5.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-tech-insights-node@0.4.6-next.2

## 0.5.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/plugin-tech-insights-node@0.4.6-next.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.6-next.0

## 0.5.13

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-tasks@0.5.4
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.5

## 0.5.13-next.1

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.5-next.0

## 0.5.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.5-next.0

## 0.5.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/catalog-client@1.4.2
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-tech-insights-node@0.4.4
  - @backstage/config@1.0.8
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.5.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.4-next.2

## 0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-tech-insights-node@0.4.4-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.5.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.4-next.0

## 0.5.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-tech-insights-node@0.4.3
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-tech-insights-node@0.4.3-next.1
  - @backstage/config@1.0.7

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-tech-insights-node@0.4.3-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.5.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-client@1.4.1
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-tech-insights-node@0.4.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.5.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.2

## 0.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.2

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.1

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.0

## 0.5.9

### Patch Changes

- f244b589163: Add DB index to improve latency of latest fact query
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/plugin-tech-insights-node@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.5.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1-next.1

## 0.5.9-next.0

### Patch Changes

- f244b58916: Add DB index to improve latency of latest fact query
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1-next.0

## 0.5.8

### Patch Changes

- 4024b37449: TechInsightsApi interface now has getFactSchemas() method.
  TechInsightsClient now implements method getFactSchemas().

  **BREAKING** FactSchema type moved from @backstage/plugin-tech-insights-node into @backstage/plugin-tech-insights-common

  These changes are **required** if you were importing this type directly.

  ```diff
  - import { FactSchema } from '@backstage/plugin-tech-insights-node';
  + import { FactSchema } from '@backstage/plugin-tech-insights-common';
  ```

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.0
  - @backstage/catalog-model@1.2.0
  - @backstage/backend-tasks@0.4.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.10-next.0
  - @backstage/plugin-tech-insights-node@0.4.0-next.2

## 0.5.8-next.1

### Patch Changes

- 4024b37449: TechInsightsApi interface now has getFactSchemas() method.
  TechInsightsClient now implements method getFactSchemas().

  **BREAKING** FactSchema type moved from @backstage/plugin-tech-insights-node into @backstage/plugin-tech-insights-common

  These changes are **required** if you were importing this type directly.

  ```diff
  - import { FactSchema } from '@backstage/plugin-tech-insights-node';
  + import { FactSchema } from '@backstage/plugin-tech-insights-common';
  ```

- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.10-next.0
  - @backstage/plugin-tech-insights-node@0.4.0-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/plugin-tech-insights-node@0.3.10-next.0

## 0.5.6

### Patch Changes

- 7a38a31699: Complete check results run when a single check errors so that we don't block other checks from working due to an error in a single check
- 44c18b4d3f: Expose optional `persistenceContext` on `TechInsights` construction to enable integrators to provide their own database implementations for fact handling.
- b48317cfc6: Modifies database cleanup to remove all facts for entities instead of hand-picked ones only. Improves query execution a lot in large datasets.
  Changes semantics of the lifecycle deletion logic slightly for cases were historical entities/facts, that are , not present in the application anymore, were kept forever instead of being cleaned up. The new implementation is more along the expected lines.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8

## 0.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-tech-insights-node@0.3.8-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9

## 0.5.6-next.1

### Patch Changes

- 7a38a31699: Complete check results run when a single check errors so that we don't block other checks from working due to an error in a single check
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8-next.0

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.7

## 0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.7

## 0.5.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1
  - @backstage/plugin-tech-insights-node@0.3.7-next.3

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/plugin-tech-insights-node@0.3.7-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-tech-insights-node@0.3.7-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-tech-insights-common@0.2.9-next.0
  - @backstage/plugin-tech-insights-node@0.3.7-next.0

## 0.5.4

### Patch Changes

- f12e9e5b8c: Add Documentation on 404 Errors
- 06cf8f1cf2: Add a default delay to the fact retrievers to prevent cold-start errors
- 30e43717c7: Use `HumanDuration` from `@backstage/types`
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/plugin-tech-insights-node@0.3.6
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-tech-insights-common@0.2.8

## 0.5.4-next.1

### Patch Changes

- f12e9e5b8c: Add Documentation on 404 Errors
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-tech-insights-node@0.3.6-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-tech-insights-common@0.2.8-next.0

## 0.5.4-next.0

### Patch Changes

- 06cf8f1cf2: Add a default delay to the fact retrievers to prevent cold-start errors
- 30e43717c7: Use `HumanDuration` from `@backstage/types`
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-tech-insights-node@0.3.6-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-tech-insights-common@0.2.8-next.0

## 0.5.3

### Patch Changes

- 296aea34da: The Tech Insights plugin supports running fact retrievers across multiple instances. Update the README to remove the stale instructions.
- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- f7cbfb97ed: Modify router endpoint to handle singular and collections of request parameters similarly.
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/backend-tasks@0.3.6
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-tech-insights-node@0.3.5
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/plugin-tech-insights-common@0.2.7

## 0.5.3-next.2

### Patch Changes

- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-tech-insights-node@0.3.5-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/plugin-tech-insights-common@0.2.7-next.2

## 0.5.3-next.1

### Patch Changes

- f7cbfb97ed: Modify router endpoint to handle singular and collections of request parameters similarly.
- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-tech-insights-common@0.2.7-next.1
  - @backstage/plugin-tech-insights-node@0.3.5-next.1

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-tech-insights-node@0.3.5-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/plugin-tech-insights-common@0.2.7-next.0

## 0.5.2

### Patch Changes

- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- 12c6a07c2a: Changed the description of the `techdocsAnnotationFactName` fact.
- 2e0689e536: Support for timeout in FactRetrieverRegistrationOptions
- 9e8e9f5243: Modify Tech insight initialization to expose FactRetrieverEngine. Enables users to trigger fact retrieval manually or reschedule retrievers on runtime.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-tech-insights-node@0.3.4
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1
  - @backstage/plugin-tech-insights-node@0.3.4-next.1

## 0.5.2-next.1

### Patch Changes

- 12c6a07c2a: Changed the description of the `techdocsAnnotationFactName` fact.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1

## 0.5.2-next.0

### Patch Changes

- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- 2e0689e536: Support for timeout in FactRetrieverRegistrationOptions
- 9e8e9f5243: Modify Tech insight initialization to expose FactRetrieverEngine. Enables users to trigger fact retrieval manually or reschedule retrievers on runtime.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-tech-insights-node@0.3.4-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/catalog-client@1.0.5-next.0

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-tech-insights-common@0.2.6
  - @backstage/plugin-tech-insights-node@0.3.3

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-tech-insights-common@0.2.6-next.0
  - @backstage/plugin-tech-insights-node@0.3.3-next.0

## 0.5.0

### Minor Changes

- 818fa28d71: Allow FactRetrieverRegistry to be injected into buildTechInsightsContext so that we can override default registry implementation.
- 46cfda58aa: **BREAKING**: Update FactRetrieverRegistry interface to be async so that db backed implementations can be passed through to the FactRetrieverEngine.

  If you have existing custom `FactRetrieverRegistry` implementations, you'll need to remove the `retrievers` member and make all the methods async.

### Patch Changes

- 2ef58ab539: TechInsightsBackend: Added missing 'scheduler' to code examples
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- bcc122c46d: The `FactRetriever` model has been extended by adding optional title and description fields, allowing you to display them in the UI.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/catalog-client@1.0.4
  - @backstage/backend-tasks@0.3.3
  - @backstage/plugin-tech-insights-common@0.2.5
  - @backstage/plugin-tech-insights-node@0.3.2
  - @backstage/errors@1.1.0

## 0.5.0-next.3

### Minor Changes

- 46cfda58aa: **BREAKING**: Update FactRetrieverRegistry interface to be async so that db backed implementations can be passed through to the FactRetrieverEngine.

  If you have existing custom `FactRetrieverRegistry` implementations, you'll need to remove the `retrievers` member and make all the methods async.

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- bcc122c46d: The `FactRetriever` model has been extended by adding optional title and description fields, allowing you to display them in the UI.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/plugin-tech-insights-common@0.2.5-next.0
  - @backstage/plugin-tech-insights-node@0.3.2-next.1
  - @backstage/catalog-model@1.1.0-next.3

## 0.5.0-next.2

### Minor Changes

- 818fa28d71: Allow FactRetrieverRegistry to be injected into buildTechInsightsContext so that we can override default registry implementation.

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/backend-tasks@0.3.3-next.2

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/catalog-client@1.0.4-next.1

## 0.4.2-next.0

### Patch Changes

- 2ef58ab539: TechInsightsBackend: Added missing 'scheduler' to code examples
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-tech-insights-node@0.3.2-next.0
  - @backstage/catalog-client@1.0.4-next.0

## 0.4.1

### Patch Changes

- 4fee8f59e3: Updated tech-insights fetch/latest endpoint to return the actual latest row based on the timestamp
- aa15229ec3: Introduce additional JsonValue types to be storable as facts. This enables the possibility to store more complex objects for fact checking purposes. The rules engine supports walking keyed object values directly to create rules and checks

  Modify facts database table to have a more restricted timestamp precision for cases where the postgres server isn't configured to contain such value. This fixes the issue where in some cases `maxItems` lifecycle condition didn't work as expected.

- Updated dependencies
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/catalog-client@1.0.3
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-tech-insights-node@0.3.1

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/backend-tasks@0.3.2-next.2
  - @backstage/plugin-tech-insights-node@0.3.1-next.1

## 0.4.1-next.1

### Patch Changes

- 4fee8f59e3: Updated tech-insights fetch/latest endpoint to return the actual latest row based on the timestamp
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-tech-insights-node@0.3.1-next.0

## 0.4.0

### Minor Changes

- 3333e20b27: **BREAKING**: The `buildTechInsightsContext` function now takes an additional
  field in its options argument: `tokenManager`. This is an instance of
  `TokenManager`, which can be found in your backend initialization code's
  `env`.

  ```diff
   const builder = buildTechInsightsContext({
     logger: env.logger,
     config: env.config,
     database: env.database,
     discovery: env.discovery,
     scheduler: env.scheduler,
  +  tokenManager: env.tokenManager,
     factRetrievers: [ /* ... */ ],
   });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/backend-tasks@0.3.1
  - @backstage/plugin-tech-insights-node@0.3.0
  - @backstage/config@1.0.1
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2

## 0.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/plugin-tech-insights-node@0.3.0-next.2
  - @backstage/catalog-client@1.0.2-next.0

## 0.4.0-next.1

### Minor Changes

- 3333e20b27: **BREAKING**: The `buildTechInsightsContext` function now takes an additional
  field in its options argument: `tokenManager`. This is an instance of
  `TokenManager`, which can be found in your backend initialization code's
  `env`.

  ```diff
   const builder = buildTechInsightsContext({
     logger: env.logger,
     config: env.config,
     database: env.database,
     discovery: env.discovery,
     scheduler: env.scheduler,
  +  tokenManager: env.tokenManager,
     factRetrievers: [ /* ... */ ],
   });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1
  - @backstage/plugin-tech-insights-node@0.3.0-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/backend-tasks@0.3.1-next.0
  - @backstage/plugin-tech-insights-node@0.2.10-next.0

## 0.3.0

### Minor Changes

- 231fee736b: This backend now uses the `@backstage/backend-tasks` package facilities for scheduling fact retrievers.

  **BREAKING**: The `buildTechInsightsContext` function now takes an additional field in its options argument: `scheduler`. This is an instance of `PluginTaskScheduler`, which can be found in your backend initialization code's `env`.

  ```diff
   const builder = buildTechInsightsContext({
     logger: env.logger,
     config: env.config,
     database: env.database,
     discovery: env.discovery,
  +  scheduler: env.scheduler,
     factRetrievers: [ /* ... */ ],
   });
  ```

### Patch Changes

- 21de525ce9: Updated README.md with better install instructions
- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.
- 2fe58c7285: Improved the Tech-Insights documentation:

  - `lifecycle` examples used `ttl` when it should be `timeToLive`
  - Added list of included FactRetrievers
  - Added full backend example using all included FactRetrievers
  - Added boolean scorecard example image showing results of backend example

- Updated dependencies
  - @backstage/backend-tasks@0.3.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-tech-insights-node@0.2.9
  - @backstage/backend-common@0.13.2
  - @backstage/catalog-client@1.0.1

## 0.3.0-next.2

### Patch Changes

- 21de525ce9: Updated README.md with better install instructions
- Updated dependencies
  - @backstage/backend-tasks@0.3.0-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 0.3.0-next.1

### Minor Changes

- 231fee736b: This backend now uses the `@backstage/backend-tasks` package facilities for scheduling fact retrievers.

  **BREAKING**: The `buildTechInsightsContext` function now takes an additional field in its options argument: `scheduler`. This is an instance of `PluginTaskScheduler`, which can be found in your backend initialization code's `env`.

  ```diff
   const builder = buildTechInsightsContext({
     logger: env.logger,
     config: env.config,
     database: env.database,
     discovery: env.discovery,
  +  scheduler: env.scheduler,
     factRetrievers: [ /* ... */ ],
   });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.0-next.1
  - @backstage/plugin-tech-insights-node@0.2.9-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.2.11-next.0

### Patch Changes

- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.
- 2fe58c7285: Improved the Tech-Insights documentation:

  - `lifecycle` examples used `ttl` when it should be `timeToLive`
  - Added list of included FactRetrievers
  - Added full backend example using all included FactRetrievers
  - Added boolean scorecard example image showing results of backend example

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-tech-insights-node@0.2.9-next.0

## 0.2.10

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-tech-insights-common@0.2.4
  - @backstage/plugin-tech-insights-node@0.2.8

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0
  - @backstage/plugin-tech-insights-node@0.2.7

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/plugin-tech-insights-node@0.2.7-next.0

## 0.2.8

### Patch Changes

- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-tech-insights-node@0.2.6

## 0.2.7

### Patch Changes

- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-tech-insights-node@0.2.5

## 0.2.6

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-tech-insights-common@0.2.3
  - @backstage/plugin-tech-insights-node@0.2.4

## 0.2.5

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/plugin-tech-insights-common@0.2.2
  - @backstage/plugin-tech-insights-node@0.2.3

## 0.2.4

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-tech-insights-node@0.2.2

## 0.2.4-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-tech-insights-node@0.2.2-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-tech-insights-node@0.2.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-tech-insights-node@0.2.1-next.0

## 0.2.2

### Patch Changes

- bbb6622752: Update README to match config options.
- Updated dependencies
  - @backstage/backend-common@0.10.5

## 0.2.1

### Patch Changes

- ad0a7eb088: Fixed invalid access that caused an immediate crash with a `TypeError` when loading the package.

## 0.2.0

### Minor Changes

- dfd5e81721: BREAKING CHANGES:

  - The helper function to create a fact retriever registration is now expecting an object of configuration items instead of individual arguments.
    Modify your `techInsights.ts` plugin configuration in `packages/backend/src/plugins/techInsights.ts` (or equivalent) the following way:

  ```diff
  -createFactRetrieverRegistration(
  -  '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  -  entityOwnershipFactRetriever,
  -),
  +createFactRetrieverRegistration({
  +  cadence: '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  +  factRetriever: entityOwnershipFactRetriever,
  +}),

  ```

  - `TechInsightsStore` interface has changed its signature of `insertFacts` method. If you have created your own implementation of either `TechInsightsDatabase` or `FactRetrieverEngine` you need to modify the implementation/call to this method to accept/pass-in an object instead if individual arguments. The interface now accepts an additional `lifecycle` argument which is optional (defined below). An example modification to fact retriever engine:

  ```diff
  -await this.repository.insertFacts(factRetriever.id, facts);
  +await this.repository.insertFacts({
  + id: factRetriever.id,
  + facts,
  + lifecycle,
  +});
  ```

  Adds a configuration option to fact retrievers to define lifecycle for facts the retriever persists. Possible values are either 'max items' or 'time-to-live'. The former will keep only n number of items in the database for each fact per entity. The latter will remove all facts that are older than the TTL value.

  Possible values:

  - `{ maxItems: 5 }` // Deletes all facts for the retriever/entity pair, apart from the last five
  - `{ ttl: 1209600000 }` // (2 weeks) Deletes all facts older than 2 weeks for the retriever/entity pair
  - `{ ttl: { weeks: 2 } }` // Deletes all facts older than 2 weeks for the retriever/entity pair

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-tech-insights-node@0.2.0
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.2.0-next.0

### Minor Changes

- dfd5e81721: BREAKING CHANGES:

  - The helper function to create a fact retriever registration is now expecting an object of configuration items instead of individual arguments.
    Modify your `techInsights.ts` plugin configuration in `packages/backend/src/plugins/techInsights.ts` (or equivalent) the following way:

  ```diff
  -createFactRetrieverRegistration(
  -  '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  -  entityOwnershipFactRetriever,
  -),
  +createFactRetrieverRegistration({
  +  cadence: '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  +  factRetriever: entityOwnershipFactRetriever,
  +}),

  ```

  - `TechInsightsStore` interface has changed its signature of `insertFacts` method. If you have created your own implementation of either `TechInsightsDatabase` or `FactRetrieverEngine` you need to modify the implementation/call to this method to accept/pass-in an object instead if individual arguments. The interface now accepts an additional `lifecycle` argument which is optional (defined below). An example modification to fact retriever engine:

  ```diff
  -await this.repository.insertFacts(factRetriever.id, facts);
  +await this.repository.insertFacts({
  + id: factRetriever.id,
  + facts,
  + lifecycle,
  +});
  ```

  Adds a configuration option to fact retrievers to define lifecycle for facts the retriever persists. Possible values are either 'max items' or 'time-to-live'. The former will keep only n number of items in the database for each fact per entity. The latter will remove all facts that are older than the TTL value.

  Possible values:

  - `{ maxItems: 5 }` // Deletes all facts for the retriever/entity pair, apart from the last five
  - `{ ttl: 1209600000 }` // (2 weeks) Deletes all facts older than 2 weeks for the retriever/entity pair
  - `{ ttl: { weeks: 2 } }` // Deletes all facts older than 2 weeks for the retriever/entity pair

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-tech-insights-node@0.2.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.1.5

### Patch Changes

- 19f0f93504: Catch errors from a fact retriever and log them.
- 10f26e8883: Modify queries to perform better by filtering on sub-queries as well
- a60eb0f0dd: adding new operation to run checks for multiple entities in one request
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-tech-insights-common@0.2.1
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3
  - @backstage/plugin-tech-insights-node@0.1.2

## 0.1.3

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- b5bd60fddc: Removed unnecessary check for specific server error in `@backstage plugin-tech-insights-backend`.
- c6c8b8e53e: Minor fixes in Readme to make the examples more directly usable.
- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.0
  - @backstage/backend-common@0.9.12
  - @backstage/plugin-tech-insights-node@0.1.1

## 0.1.2

### Patch Changes

- 2017de90da: Update README docs to use correct function/parameter names
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.1.1

### Patch Changes

- 5c00e45045: Add catalog fact retrievers

  Add fact retrievers which generate facts related to the completeness
  of entity data in the catalog.

- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
