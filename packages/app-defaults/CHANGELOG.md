# @backstage/app-defaults

## 1.6.0

### Minor Changes

- 12f8e01: **BREAKING**: The default `DiscoveryApi` implementation has been switched to use `FrontendHostDiscovery`, which adds support for the `discovery.endpoints` configuration.

  This is marked as a breaking change because it will cause any existing `discovery.endpoints` configuration to be picked up and used, which may break existing setups.

  For example, consider the following configuration:

  ```yaml
  app:
    baseUrl: https://backstage.acme.org

  backend:
    baseUrl: https://backstage.internal.acme.org

  discovery:
    endpoints:
      - target: https://catalog.internal.acme.org/api/{{pluginId}}
        plugins: [catalog]
  ```

  This will now cause requests from the frontend towards the `catalog` plugin to be routed to `https://catalog.internal.acme.org/api/catalog`, but this might not be reachable from the frontend. To fix this, you should update the `discovery.endpoints` configuration to only override the internal URL of the plugin:

  ```yaml
  discovery:
    endpoints:
      - target:
          internal: https://catalog.internal.acme.org/api/{{pluginId}}
        plugins: [catalog]
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/core-app-api@1.16.0
  - @backstage/plugin-permission-react@0.4.32
  - @backstage/theme@0.6.4

## 1.6.0-next.1

### Minor Changes

- 12f8e01: **BREAKING**: The default `DiscoveryApi` implementation has been switched to use `FrontendHostDiscovery`, which adds support for the `discovery.endpoints` configuration.

  This is marked as a breaking change because it will cause any existing `discovery.endpoints` configuration to be picked up and used, which may break existing setups.

  For example, consider the following configuration:

  ```yaml
  app:
    baseUrl: https://backstage.acme.org

  backend:
    baseUrl: https://backstage.internal.acme.org

  discovery:
    endpoints:
      - target: https://catalog.internal.acme.org/api/{{pluginId}}
        plugins: [catalog]
  ```

  This will now cause requests from the frontend towards the `catalog` plugin to be routed to `https://catalog.internal.acme.org/api/catalog`, but this might not be reachable from the frontend. To fix this, you should update the `discovery.endpoints` configuration to only override the internal URL of the plugin:

  ```yaml
  discovery:
    endpoints:
      - target:
          internal: https://catalog.internal.acme.org/api/{{pluginId}}
        plugins: [catalog]
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.16.0-next.0
  - @backstage/core-components@0.16.5-next.1
  - @backstage/core-plugin-api@1.10.4
  - @backstage/theme@0.6.4
  - @backstage/plugin-permission-react@0.4.31

## 1.5.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/core-app-api@1.15.5
  - @backstage/core-plugin-api@1.10.4
  - @backstage/theme@0.6.4
  - @backstage/plugin-permission-react@0.4.31

## 1.5.17

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4
  - @backstage/core-plugin-api@1.10.4
  - @backstage/plugin-permission-react@0.4.31
  - @backstage/core-app-api@1.15.5
  - @backstage/theme@0.6.4

## 1.5.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-app-api@1.15.5-next.0
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/theme@0.6.4-next.0
  - @backstage/plugin-permission-react@0.4.31-next.0

## 1.5.17-next.0

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.0
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/plugin-permission-react@0.4.31-next.0
  - @backstage/core-app-api@1.15.5-next.0
  - @backstage/theme@0.6.4-next.0

## 1.5.16

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3
  - @backstage/core-components@0.16.3
  - @backstage/core-app-api@1.15.4
  - @backstage/theme@0.6.3
  - @backstage/plugin-permission-react@0.4.30

## 1.5.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/core-app-api@1.15.4-next.0
  - @backstage/core-components@0.16.3-next.0
  - @backstage/plugin-permission-react@0.4.30-next.0
  - @backstage/theme@0.6.3

## 1.5.15

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.15.3
  - @backstage/theme@0.6.3
  - @backstage/core-components@0.16.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/plugin-permission-react@0.4.29

## 1.5.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.15.3-next.1
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/theme@0.6.3-next.0
  - @backstage/plugin-permission-react@0.4.29-next.0

## 1.5.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/core-app-api@1.15.3-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/theme@0.6.3-next.0
  - @backstage/plugin-permission-react@0.4.28

## 1.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.15.3-next.0
  - @backstage/theme@0.6.3-next.0
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/plugin-permission-react@0.4.28

## 1.5.13

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.1
  - @backstage/core-components@0.16.0
  - @backstage/core-app-api@1.15.2
  - @backstage/core-plugin-api@1.10.1
  - @backstage/plugin-permission-react@0.4.28

## 1.5.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/core-app-api@1.15.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/theme@0.6.1-next.0
  - @backstage/plugin-permission-react@0.4.27

## 1.5.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.1-next.0
  - @backstage/core-app-api@1.15.1
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/plugin-permission-react@0.4.27

## 1.5.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/core-app-api@1.15.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/theme@0.6.0
  - @backstage/plugin-permission-react@0.4.27

## 1.5.12

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 46b5a20: Added `externalLink` to icon defaults
- 8c40e55: Updated the `bitbucket-server-auth` default API to set its environment based on the `auth.environment` config option instead of being hardcoded to `development`.
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/plugin-permission-react@0.4.27
  - @backstage/core-app-api@1.15.1
  - @backstage/theme@0.6.0

## 1.5.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-permission-react@0.4.27-next.1

## 1.5.12-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/theme@0.5.8-next.0

## 1.5.12-next.0

### Patch Changes

- 46b5a20: Added `externalLink` to icon defaults
- 8c40e55: Updated the `bitbucket-server-auth` default API to set its environment based on the `auth.environment` config option instead of being hardcoded to `development`.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/core-app-api@1.15.1-next.0
  - @backstage/theme@0.5.7
  - @backstage/plugin-permission-react@0.4.27-next.0

## 1.5.11

### Patch Changes

- b537bd7: Allow custom star icons to be provided via the `star` and `unstarred` icon overrides. See how to override existing icons in the [Backstage documentation](https://backstage.io/docs/getting-started/app-custom-theme/#custom-icons).
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/core-app-api@1.15.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/theme@0.5.7
  - @backstage/plugin-permission-react@0.4.26

## 1.5.11-next.1

### Patch Changes

- b537bd7: Allow custom star icons to be provided via the `star` and `unstarred` icon overrides. See how to override existing icons in the [Backstage documentation](https://backstage.io/docs/getting-started/app-custom-theme/#custom-icons).
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-app-api@1.14.3-next.0
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/theme@0.5.7-next.0
  - @backstage/plugin-permission-react@0.4.26-next.0

## 1.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.11-next.0
  - @backstage/core-app-api@1.14.2
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.25

## 1.5.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/core-app-api@1.14.2
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.25

## 1.5.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.25-next.1
  - @backstage/core-app-api@1.14.2-next.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6

## 1.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.25-next.0
  - @backstage/core-app-api@1.14.2-next.0
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6

## 1.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-app-api@1.14.1-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.24

## 1.5.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/core-app-api@1.14.0
  - @backstage/plugin-permission-react@0.4.24
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6

## 1.5.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.1

## 1.5.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.13.1-next.1
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.23

## 1.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-app-api@1.13.0-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.23

## 1.5.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.23
  - @backstage/core-app-api@1.12.6

## 1.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/plugin-permission-react@0.4.23-next.1
  - @backstage/core-app-api@1.12.6-next.0
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/theme@0.5.6-next.0

## 1.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/core-app-api@1.12.6-next.0
  - @backstage/plugin-permission-react@0.4.23-next.0
  - @backstage/theme@0.5.6-next.0

## 1.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.6-next.0
  - @backstage/core-components@0.14.8-next.0
  - @backstage/core-app-api@1.12.5
  - @backstage/core-plugin-api@1.9.2
  - @backstage/plugin-permission-react@0.4.22

## 1.5.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.7
  - @backstage/theme@0.5.4
  - @backstage/core-app-api@1.12.5

## 1.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 1.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.4-next.0
  - @backstage/core-components@0.14.5-next.0
  - @backstage/core-app-api@1.12.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/plugin-permission-react@0.4.22

## 1.5.4

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-app-api@1.12.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/theme@0.5.3
  - @backstage/plugin-permission-react@0.4.22

## 1.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.12.4-next.0
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/plugin-permission-react@0.4.21

## 1.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-app-api@1.12.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/plugin-permission-react@0.4.21

## 1.5.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-app-api@1.12.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/plugin-permission-react@0.4.21

## 1.5.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-app-api@1.12.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/plugin-permission-react@0.4.21

## 1.5.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/theme@0.5.2
  - @backstage/core-app-api@1.12.1
  - @backstage/core-plugin-api@1.9.1
  - @backstage/plugin-permission-react@0.4.21

## 1.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-permission-react@0.4.21-next.1

## 1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/theme@0.5.2-next.0

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.2-next.0
  - @backstage/core-components@0.14.1-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/core-app-api@1.12.1-next.0
  - @backstage/plugin-permission-react@0.4.21-next.0

## 1.5.0

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.
- 7f11009: Added stack trace display to `ErrorPage` and updated existing refs

### Patch Changes

- f899eec: Change default icon for `kind:resource` to the storage icon.
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 7da67ce: Change `defaultScopes` for Bitbucket auth from invalid `team` to `account`.
- 214f2da: Fix invalid HTTP status code 501 in Error Page
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/core-app-api@1.12.0
  - @backstage/theme@0.5.1
  - @backstage/core-plugin-api@1.9.0
  - @backstage/plugin-permission-react@0.4.20

## 1.5.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.1-next.1
  - @backstage/core-components@0.14.0-next.2
  - @backstage/core-app-api@1.12.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/plugin-permission-react@0.4.20-next.1

## 1.5.0-next.2

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.
- 7f11009: Added stack trace display to `ErrorPage` and updated existing refs

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 214f2da: Fix invalid HTTP status code 501 in Error Page
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-app-api@1.12.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/plugin-permission-react@0.4.20-next.1
  - @backstage/theme@0.5.1-next.0

## 1.4.8-next.1

### Patch Changes

- 7da67ce: Change `defaultScopes` for Bitbucket auth from invalid `team` to `account`.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/core-app-api@1.11.4-next.0
  - @backstage/theme@0.5.0
  - @backstage/plugin-permission-react@0.4.20-next.0

## 1.4.8-next.0

### Patch Changes

- f899eec: Change default icon for `kind:resource` to the storage icon.
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-app-api@1.11.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/theme@0.5.0
  - @backstage/plugin-permission-react@0.4.19

## 1.4.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/plugin-permission-react@0.4.19
  - @backstage/core-app-api@1.11.3
  - @backstage/theme@0.5.0

## 1.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1
  - @backstage/core-app-api@1.11.3-next.0
  - @backstage/plugin-permission-react@0.4.19-next.1
  - @backstage/theme@0.5.0

## 1.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/plugin-permission-react@0.4.19-next.0
  - @backstage/core-app-api@1.11.2
  - @backstage/core-plugin-api@1.8.1
  - @backstage/theme@0.5.0

## 1.4.6

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/core-components@0.13.9
  - @backstage/theme@0.5.0
  - @backstage/core-app-api@1.11.2
  - @backstage/plugin-permission-react@0.4.18

## 1.4.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1

## 1.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.0-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1

## 1.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/theme@0.5.0-next.0

## 1.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/theme@0.5.0-next.0
  - @backstage/core-app-api@1.11.2-next.0
  - @backstage/plugin-permission-react@0.4.18-next.0

## 1.4.5

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.8
  - @backstage/core-plugin-api@1.8.0
  - @backstage/plugin-permission-react@0.4.17
  - @backstage/core-app-api@1.11.1
  - @backstage/theme@0.4.4

## 1.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.2

## 1.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.1
  - @backstage/core-app-api@1.11.1-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/theme@0.4.4-next.0
  - @backstage/plugin-permission-react@0.4.17-next.0

## 1.4.5-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/plugin-permission-react@0.4.17-next.0
  - @backstage/core-app-api@1.11.1-next.0
  - @backstage/theme@0.4.4-next.0

## 1.4.4

### Patch Changes

- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3

## 1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.11.0-next.2
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/theme@0.4.3-next.0
  - @backstage/plugin-permission-react@0.4.16-next.1

## 1.4.4-next.1

### Patch Changes

- 1a0616fa10: Add missing resource and template app icons
- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/core-app-api@1.10.1-next.1
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/plugin-permission-react@0.4.16-next.0
  - @backstage/theme@0.4.2

## 1.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/core-components@0.13.6-next.0
  - @backstage/core-app-api@1.10.1-next.0
  - @backstage/plugin-permission-react@0.4.16-next.0
  - @backstage/theme@0.4.2

## 1.4.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5
  - @backstage/core-app-api@1.10.0
  - @backstage/core-plugin-api@1.6.0
  - @backstage/plugin-permission-react@0.4.15
  - @backstage/theme@0.4.2

## 1.4.3-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/core-app-api@1.10.0-next.3
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/plugin-permission-react@0.4.15-next.3
  - @backstage/theme@0.4.2-next.0

## 1.4.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/core-app-api@1.10.0-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/theme@0.4.1

## 1.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.1
  - @backstage/core-app-api@1.10.0-next.1
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/plugin-permission-react@0.4.15-next.1
  - @backstage/theme@0.4.1

## 1.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.10.0-next.0
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0
  - @backstage/theme@0.4.1
  - @backstage/plugin-permission-react@0.4.15-next.0

## 1.4.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.9.1
  - @backstage/core-components@0.13.4
  - @backstage/core-plugin-api@1.5.3
  - @backstage/theme@0.4.1
  - @backstage/plugin-permission-react@0.4.14

## 1.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.9.1-next.0
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/theme@0.4.1
  - @backstage/plugin-permission-react@0.4.14

## 1.4.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/core-components@0.13.3
  - @backstage/core-app-api@1.9.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/plugin-permission-react@0.4.14

## 1.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2
  - @backstage/core-app-api@1.8.2-next.1
  - @backstage/plugin-permission-react@0.4.14-next.2

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/core-app-api@1.8.2-next.0
  - @backstage/plugin-permission-react@0.4.14-next.1

## 1.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.3-next.0
  - @backstage/core-app-api@1.8.1
  - @backstage/core-plugin-api@1.5.2
  - @backstage/theme@0.4.0
  - @backstage/plugin-permission-react@0.4.14-next.0

## 1.4.0

### Minor Changes

- 1fd38bc4141a: **Material UI v5 Support:** Adding platform-wide support for Material UI v5 allowing a transition phase for migrating central plugins & components over. We still support v4 instances & plugins by adding a

  To allow the future support of plugins & components using Material UI v5 you want to upgrade your `AppTheme`'s to using the `UnifiedThemeProvider`

  ```diff
       Provider: ({ children }) => (
  -    <ThemeProvider theme={lightTheme}>
  -      <CssBaseline>{children}</CssBaseline>
  -    </ThemeProvider>
  +    <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
       ),
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.1
  - @backstage/core-plugin-api@1.5.2
  - @backstage/core-components@0.13.2
  - @backstage/theme@0.4.0
  - @backstage/plugin-permission-react@0.4.13

## 1.4.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/core-app-api@1.8.1-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/theme@0.4.0-next.1
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/core-components@0.13.2-next.2
  - @backstage/core-app-api@1.8.1-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.1
  - @backstage/core-app-api@1.8.1-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.4.0-next.0

### Minor Changes

- 1fd38bc4141a: **Material UI v5 Support:** Adding platform-wide support for Material UI v5 allowing a transition phase for migrating central plugins & components over. We still support v4 instances & plugins by adding a

  To allow the future support of plugins & components using Material UI v5 you want to upgrade your `AppTheme`'s to using the `UnifiedThemeProvider`

  ```diff
       Provider: ({ children }) => (
  -    <ThemeProvider theme={lightTheme}>
  -      <CssBaseline>{children}</CssBaseline>
  -    </ThemeProvider>
  +    <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
       ),
  ```

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.0
  - @backstage/core-app-api@1.8.0
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1

### Patch Changes

- 575d9178eff: Added a System Icon for resource entities.
  This can be obtained using:

  ```ts
  useApp().getSystemIcon('kind:resource');
  ```

- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/core-app-api@1.8.0
  - @backstage/core-components@0.13.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/core-components@0.13.1-next.1
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.1

### Patch Changes

- 575d9178eff: Added a System Icon for resource entities.
  This can be obtained using:

  ```ts
  useApp().getSystemIcon('kind:resource');
  ```

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.7.1-next.0
  - @backstage/core-components@0.13.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/theme@0.2.19
  - @backstage/plugin-permission-react@0.4.12

## 1.3.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/core-app-api@1.7.0
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.7.0-next.3
  - @backstage/core-components@0.13.0-next.3
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/plugin-permission-react@0.4.12-next.1

## 1.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.6-next.2
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/core-app-api@1.7.0-next.2
  - @backstage/theme@0.2.19-next.0
  - @backstage/plugin-permission-react@0.4.12-next.1

## 1.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.6-next.1
  - @backstage/core-app-api@1.7.0-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/plugin-permission-react@0.4.12-next.0
  - @backstage/theme@0.2.19-next.0

## 1.3.0-next.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.6-next.0
  - @backstage/core-app-api@1.7.0-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/plugin-permission-react@0.4.11
  - @backstage/theme@0.2.18

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.5
  - @backstage/core-plugin-api@1.5.0
  - @backstage/core-app-api@1.6.0
  - @backstage/theme@0.2.18
  - @backstage/plugin-permission-react@0.4.11

## 1.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.5-next.2
  - @backstage/core-app-api@1.6.0-next.2
  - @backstage/core-plugin-api@1.5.0-next.2
  - @backstage/plugin-permission-react@0.4.11-next.2

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.5-next.1
  - @backstage/core-app-api@1.5.1-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/theme@0.2.18-next.0
  - @backstage/plugin-permission-react@0.4.11-next.1

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/core-app-api@1.5.1-next.0
  - @backstage/core-components@0.12.5-next.0
  - @backstage/theme@0.2.17
  - @backstage/plugin-permission-react@0.4.11-next.0

## 1.2.0

### Minor Changes

- db10b6ef65: Added a Bitbucket Server Auth Provider and added its API to the app defaults

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.4
  - @backstage/theme@0.2.17
  - @backstage/core-app-api@1.5.0
  - @backstage/core-plugin-api@1.4.0
  - @backstage/plugin-permission-react@0.4.10

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.4-next.1
  - @backstage/core-app-api@1.4.1-next.0
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.9

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.4.1-next.0
  - @backstage/core-components@0.12.4-next.0
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.9

## 1.1.0

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3
  - @backstage/core-plugin-api@1.3.0
  - @backstage/core-app-api@1.4.0
  - @backstage/plugin-permission-react@0.4.9
  - @backstage/theme@0.2.16

## 1.1.0-next.2

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/core-app-api@1.4.0-next.1
  - @backstage/plugin-permission-react@0.4.9-next.1
  - @backstage/core-components@0.12.3-next.2
  - @backstage/theme@0.2.16

## 1.0.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.9-next.0

## 1.0.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.0
  - @backstage/core-app-api@1.3.0
  - @backstage/core-plugin-api@1.2.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.8

## 1.0.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.2

## 1.0.9

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/core-components@0.12.1
  - @backstage/core-app-api@1.3.0
  - @backstage/plugin-permission-react@0.4.8
  - @backstage/theme@0.2.16

## 1.0.9-next.4

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- Updated dependencies
  - @backstage/core-app-api@1.3.0-next.4
  - @backstage/core-components@0.12.1-next.4
  - @backstage/plugin-permission-react@0.4.8-next.3
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16

## 1.0.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.2.1-next.3
  - @backstage/core-components@0.12.1-next.3
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.8-next.2

## 1.0.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-app-api@1.2.1-next.2
  - @backstage/core-components@0.12.1-next.2
  - @backstage/plugin-permission-react@0.4.8-next.2
  - @backstage/theme@0.2.16

## 1.0.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.2.1-next.1
  - @backstage/core-components@0.12.1-next.1
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/plugin-permission-react@0.4.8-next.1
  - @backstage/theme@0.2.16

## 1.0.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.0
  - @backstage/core-app-api@1.2.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.8-next.0

## 1.0.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0
  - @backstage/core-app-api@1.2.0
  - @backstage/core-plugin-api@1.1.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.7

## 1.0.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0-next.1
  - @backstage/core-app-api@1.2.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.7-next.0

## 1.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.0-next.0
  - @backstage/core-app-api@1.2.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/plugin-permission-react@0.4.7-next.0
  - @backstage/theme@0.2.16

## 1.0.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.2
  - @backstage/core-app-api@1.1.1
  - @backstage/core-plugin-api@1.0.7
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.6

## 1.0.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.6-next.2
  - @backstage/core-app-api@1.1.1-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/theme@0.2.16

## 1.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.1.1-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.6-next.1

## 1.0.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.2-next.0
  - @backstage/core-app-api@1.1.1-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.6-next.0

## 1.0.6

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 7d47def9c4: Removed dependency on `@types/jest`.
- d9e39544be: Add missing peer dependencies
- Updated dependencies
  - @backstage/core-app-api@1.1.0
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-permission-react@0.4.5

## 1.0.6-next.2

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- d9e39544be: Add missing peer dependencies
- Updated dependencies
  - @backstage/core-app-api@1.1.0-next.3
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/plugin-permission-react@0.4.5-next.2

## 1.0.6-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-app-api@1.1.0-next.1
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-permission-react@0.4.5-next.1

## 1.0.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.6-next.0
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/plugin-permission-react@0.4.5-next.0

## 1.0.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/core-app-api@1.0.5
  - @backstage/plugin-permission-react@0.4.4

## 1.0.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0-next.2

## 1.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/core-app-api@1.0.5-next.0
  - @backstage/core-components@0.10.1-next.0
  - @backstage/plugin-permission-react@0.4.4-next.0

## 1.0.4

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/core-app-api@1.0.4
  - @backstage/core-plugin-api@1.0.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.3

## 1.0.4-next.3

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- Updated dependencies
  - @backstage/core-app-api@1.0.4-next.1
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/plugin-permission-react@0.4.3-next.1

## 1.0.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/theme@0.2.16-next.1

## 1.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/plugin-permission-react@0.4.3-next.0

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.0
  - @backstage/core-app-api@1.0.4-next.0

## 1.0.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5
  - @backstage/core-app-api@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/plugin-permission-react@0.4.2

## 1.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-app-api@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/plugin-permission-react@0.4.2-next.0

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/core-app-api@1.0.2
  - @backstage/plugin-permission-react@0.4.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/core-app-api@1.0.2-next.0
  - @backstage/plugin-permission-react@0.4.1-next.0

## 1.0.1

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0
  - @backstage/core-app-api@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1

## 1.0.1-next.2

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.1
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-permission-react@0.4.0-next.1

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0-next.0

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- Updated dependencies
  - @backstage/core-app-api@1.0.0
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-permission-react@0.3.4

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1-next.0

## 0.2.0

### Minor Changes

- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.0
  - @backstage/core-app-api@0.6.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-permission-react@0.3.3

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/core-plugin-api@0.7.0
  - @backstage/core-app-api@0.5.4
  - @backstage/plugin-permission-react@0.3.2

## 0.1.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-app-api@0.5.3
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-permission-react@0.3.1
  - @backstage/theme@0.2.15

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/core-app-api@0.5.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/core-app-api@0.5.2-next.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/core-app-api@0.5.0

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0-next.0
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/core-app-api@0.5.0-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/core-app-api@0.4.0
  - @backstage/plugin-permission-react@0.2.2

## 0.1.3

### Patch Changes

- 7927005152: Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.
- 1e49c23eb7: Added an instance of PermissionApi to the apis included by default in createApp.
- 68f8b10ccd: - Removed deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
  - Removed reference to `theme` in the `app-defaults` default `AppTheme`
  - Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`
- Updated dependencies
  - @backstage/core-app-api@0.3.0
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-permission-react@0.2.0
  - @backstage/core-components@0.8.2

## 0.1.2

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/core-app-api@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/core-app-api@0.1.21
