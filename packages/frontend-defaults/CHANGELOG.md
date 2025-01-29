# @backstage/frontend-defaults

## 0.1.6-next.1

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.1
  - @backstage/frontend-app-api@0.10.5-next.1
  - @backstage/plugin-app@0.1.6-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.0
  - @backstage/frontend-app-api@0.10.5-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-app@0.1.6-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.10.4
  - @backstage/plugin-app@0.1.5

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4-next.0
  - @backstage/frontend-app-api@0.10.4-next.0
  - @backstage/plugin-app@0.1.5-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4
  - @backstage/frontend-plugin-api@0.9.3
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/frontend-app-api@0.10.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/frontend-app-api@0.10.3-next.2
  - @backstage/frontend-plugin-api@0.9.3-next.2
  - @backstage/plugin-app@0.1.4-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.3-next.1
  - @backstage/frontend-plugin-api@0.9.3-next.1
  - @backstage/plugin-app@0.1.4-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.3-next.0

## 0.1.2

### Patch Changes

- 44b82da: The default config loader no longer requires `process.env.APP_CONFIG` to be set, allowing config to be read from other sources instead.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.1
  - @backstage/frontend-plugin-api@0.9.1
  - @backstage/plugin-app@0.1.2

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.2
  - @backstage/frontend-plugin-api@0.9.1-next.2
  - @backstage/plugin-app@0.1.2-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.1
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/plugin-app@0.1.2-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.0
  - @backstage/frontend-plugin-api@0.9.1-next.0
  - @backstage/plugin-app@0.1.2-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0
  - @backstage/frontend-app-api@0.10.0
  - @backstage/plugin-app@0.1.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-app@0.1.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.1
  - @backstage/frontend-app-api@0.10.0-next.1
  - @backstage/plugin-app@0.1.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.0
  - @backstage/frontend-app-api@0.10.0-next.0
  - @backstage/plugin-app@0.1.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0

### Minor Changes

- 7c80650: Initial release of this package, which provides a default app setup through the `createApp` function. This replaces the existing `createApp` method from `@backstage/frontend-app-api`.

### Patch Changes

- 7d19cd5: Added a new `CreateAppOptions` type for the `createApp` options.
- 7d19cd5: Added `createPublicSignInApp`, used to creating apps for the public entry point.
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0
  - @backstage/frontend-app-api@0.9.0
  - @backstage/plugin-app@0.1.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0-next.1

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/plugin-app@0.1.0-next.2
  - @backstage/frontend-app-api@0.9.0-next.2
  - @backstage/frontend-plugin-api@0.8.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0-next.0

### Minor Changes

- 7c80650: Initial release of this package, which provides a default app setup through the `createApp` function. This replaces the existing `createApp` method from `@backstage/frontend-app-api`.

### Patch Changes

- 7d19cd5: Added a new `CreateAppOptions` type for the `createApp` options.
- 7d19cd5: Added `createPublicSignInApp`, used to creating apps for the public entry point.
- Updated dependencies
  - @backstage/frontend-app-api@0.9.0-next.1
  - @backstage/frontend-plugin-api@0.8.0-next.1
  - @backstage/plugin-app@0.1.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
