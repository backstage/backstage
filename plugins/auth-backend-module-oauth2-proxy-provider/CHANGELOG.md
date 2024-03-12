# @backstage/plugin-auth-backend-module-oauth2-proxy-provider

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/errors@1.2.4-next.0

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.6-next.0

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- e77d7a9: Internal refactor to avoid deprecated method.
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0

## 0.1.2

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/errors@1.2.3

## 0.1.2-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/errors@1.2.3

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/errors@1.2.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/errors@1.2.3

## 0.1.1

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/errors@1.2.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3

## 0.1.1-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.1.0

### Minor Changes

- 271aa12: Release of `oauth2-proxy-provider` plugin

### Patch Changes

- a6be465: Exported the provider as default so it gets discovered when using `featureDiscoveryServiceFactory()`
- 510dab4: Change provider id from `oauth2ProxyProvider` to `oauth2Proxy`
- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/errors@1.2.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.1.0-next.1

### Patch Changes

- a6be465: Exported the provider as default so it gets discovered when using `featureDiscoveryServiceFactory()`
- 510dab4: Change provider id from `oauth2ProxyProvider` to `oauth2Proxy`
- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 271aa12c7c: Release of `oauth2-proxy-provider` plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
