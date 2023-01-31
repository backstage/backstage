# @backstage/plugin-stack-overflow-backend

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/plugin-search-common@1.2.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.1.9

### Patch Changes

- 06f6a4f0f1: Enable configuration override for StackOverflow backend plugin when instantiating the search indexer. This makes it possible to set different configuration for frontend and backend of the plugin.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/plugin-search-common@1.2.1

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.1.9-next.0

### Patch Changes

- 06f6a4f0f1: Enable configuration override for StackOverflow backend plugin when instantiating the search indexer. This makes it possible to set different configuration for frontend and backend of the plugin.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/plugin-search-common@1.2.0

## 0.1.8

### Patch Changes

- fd0ca6f447: Added option to supply API Access Token. This is required in addition to an API key when trying to access the data for a private Stack Overflow Team.
- Updated dependencies
  - @backstage/cli@0.22.0
  - @backstage/plugin-search-common@1.2.0
  - @backstage/config@1.0.5

## 0.1.8-next.4

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.0-next.4
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-common@1.2.0-next.3

## 0.1.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.2-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-common@1.2.0-next.2

## 0.1.8-next.2

### Patch Changes

- fd0ca6f447: Added option to supply API Access Token. This is required in addition to an API key when trying to access the data for a private Stack Overflow Team.
- Updated dependencies
  - @backstage/cli@0.21.2-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-common@1.1.2-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/plugin-search-common@1.1.2-next.0

## 0.1.7

### Patch Changes

- cbe11d1e23: Tweak README
- a6d779d58a: Remove explicit default visibility at `config.d.ts` files.

  ```ts
  /**
   * @visibility backend
   */
  ```

- Updated dependencies
  - @backstage/cli@0.21.0
  - @backstage/config@1.0.4
  - @backstage/plugin-search-common@1.1.1

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.0-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 0.1.7-next.0

### Patch Changes

- cbe11d1e23: Tweak README
- a6d779d58a: Remove explicit default visibility at `config.d.ts` files.

  ```ts
  /**
   * @visibility backend
   */
  ```

- Updated dependencies
  - @backstage/cli@0.21.0-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-search-common@1.1.1-next.0

## 0.1.6

### Patch Changes

- 8006f8a602: In order to improve the debuggability of the search indexing process, messages logged during indexing are now tagged with a `documentType` whose value corresponds to the `type` being indexed.
- Updated dependencies
  - @backstage/cli@0.20.0
  - @backstage/plugin-search-common@1.1.0
  - @backstage/config@1.0.3

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.20.0-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/config@1.0.3-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.20.0-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/config@1.0.3-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.20.0-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/plugin-search-common@1.0.2-next.0

## 0.1.5

### Patch Changes

- 79040f73f7: Now requests all questions available using pagination. Default max page is set to 100, with a configurable `maxPage` option on the collator.
- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages
- Updated dependencies
  - @backstage/cli@0.19.0
  - @backstage/config@1.0.2
  - @backstage/plugin-search-common@1.0.1

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/cli@0.19.0-next.3

## 0.1.5-next.1

### Patch Changes

- 79040f73f7: Now requests all questions available using pagination. Default max page is set to 100, with a configurable `maxPage` option on the collator.
- 148568b5c2: Switched to using node-fetch instead of cross-fetch as is standard for our backend packages

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@1.0.1-next.0

## 0.1.4

### Patch Changes

- ea5631a8b2: Added API key as separate configuration

## 0.1.4-next.0

### Patch Changes

- ea5631a8b2: Added API key as separate configuration

## 0.1.3

### Patch Changes

- 52b4f796e3: app-config is now picked up properly.
- Updated dependencies
  - @backstage/plugin-search-common@1.0.0

## 0.1.3-next.0

### Patch Changes

- 52b4f796e3: app-config is now picked up properly.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.6-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0

## 0.1.0

### Minor Changes

- ac323de4ad: Add stack overflow backend plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.3

## 0.1.0-next.0

### Minor Changes

- ac323de4ad: Add stack overflow backend plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.3-next.1
