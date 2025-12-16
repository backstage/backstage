# @backstage/plugin-gateway-backend

## 1.1.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 7e860dd: Updated dependency `eventsource` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0

## 1.1.1-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0

## 1.1.0

### Minor Changes

- 229f63e: Added hop count tracking to prevent proxy loops. The gateway now tracks the number of proxy hops using the `backstage-gateway-hops` header and rejects requests that exceed 3 hops with a 508 Loop Detected error.
- a17d9df: Update usage of the `instanceMetadata` service.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## 1.1.0-next.1

### Minor Changes

- a17d9df: Update usage of the `instanceMetadata` service.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1

## 1.0.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.5-next.0

## 1.0.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4

## 1.0.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4-next.0

## 1.0.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3

## 1.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0

## 1.0.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2-next.0

## 1.0.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.1

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.1-next.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1

## 1.0.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.0

## 1.0.0

### Major Changes

- 6b5681c: Initial release of `@backstage/plugin-gateway-backend`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
