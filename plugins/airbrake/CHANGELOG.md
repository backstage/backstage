# @backstage/plugin-airbrake

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/dev-utils@1.0.4-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0
  - @backstage/test-utils@1.1.2-next.0

## 0.3.6

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3
  - @backstage/test-utils@1.1.1
  - @backstage/catalog-model@1.0.3
  - @backstage/dev-utils@1.0.3

## 0.3.6-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/test-utils@1.1.1-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/dev-utils@1.0.3-next.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/dev-utils@1.0.3-next.0

## 0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/test-utils@1.1.0
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/dev-utils@1.0.2
  - @backstage/catalog-model@1.0.2

## 0.3.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/dev-utils@1.0.2-next.2
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/test-utils@1.1.0-next.2

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/test-utils@1.1.0-next.1
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1
  - @backstage/dev-utils@1.0.2-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0
  - @backstage/test-utils@1.0.2-next.0
  - @backstage/dev-utils@1.0.2-next.0

## 0.3.4

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/dev-utils@1.0.1
  - @backstage/test-utils@1.0.1

## 0.3.4-next.1

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/dev-utils@1.0.1-next.1
  - @backstage/test-utils@1.0.1-next.2
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/dev-utils@1.0.1-next.0
  - @backstage/test-utils@1.0.1-next.0

## 0.3.3

### Patch Changes

- 89c7e47967: Minor README update
- 7ff853b2d5: build(deps): bump `object-hash` from 2.2.0 to 3.0.0
- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/dev-utils@1.0.0
  - @backstage/test-utils@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0

## 0.3.2

### Patch Changes

- c5a462bff1: Fix a bug where API calls were being made and errors were being added to the snack bar when no project ID was present. This is a common use case for components that haven't added the Airbrake plugin annotation to their `catalog-info.yaml`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/dev-utils@0.2.25

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/dev-utils@0.2.25-next.0

## 0.3.1

### Patch Changes

- 3c1d3cb07e: The Airbrake plugin installation instructions have been updated to work better and conform to how the frontend and backend plugins are supposed to be integrated into a Backstage instance.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/test-utils@0.3.0
  - @backstage/dev-utils@0.2.24

## 0.3.0

### Minor Changes

- da78e79a94: This marks the first release where the Airbrake plugin is useable. Airbrake frontend and Airbrake backend work with each other. Currently just a summary of the latest Airbrakes is shown on Backstage.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0
  - @backstage/dev-utils@0.2.23
  - @backstage/test-utils@0.2.6

## 0.2.0

### Minor Changes

- 9e505d20a3: API connectivity has added, but currently will only work by running it standalone on a browser with CORS disabled.

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/test-utils@0.2.5
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/dev-utils@0.2.22
  - @backstage/theme@0.2.15

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0

## 0.1.0

### Minor Changes

- 04c86e5a10: A plugin for Airbrake (https://airbrake.io/) has been created

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
