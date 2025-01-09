# @backstage/plugin-signals

## 0.0.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/types@1.2.1-next.0
  - @backstage/core-components@0.16.3-next.0
  - @backstage/plugin-signals-react@0.0.9-next.0
  - @backstage/theme@0.6.3

## 0.0.14

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.3
  - @backstage/core-components@0.16.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/types@1.2.0
  - @backstage/plugin-signals-react@0.0.8

## 0.0.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/theme@0.6.3-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-signals-react@0.0.8-next.0

## 0.0.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/theme@0.6.3-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-signals-react@0.0.7

## 0.0.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.3-next.0
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/types@1.2.0
  - @backstage/plugin-signals-react@0.0.7

## 0.0.12

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/theme@0.6.1
  - @backstage/types@1.2.0
  - @backstage/core-components@0.16.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/plugin-signals-react@0.0.7

## 0.0.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/core-plugin-api@1.10.0
  - @backstage/theme@0.6.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6

## 0.0.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.1-next.0
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6

## 0.0.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/theme@0.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6

## 0.0.11

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/plugin-signals-react@0.0.6
  - @backstage/core-plugin-api@1.10.0
  - @backstage/theme@0.6.0
  - @backstage/types@1.1.1

## 0.0.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6-next.1

## 0.0.11-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/plugin-signals-react@0.0.6-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/theme@0.5.8-next.0
  - @backstage/types@1.1.1

## 0.0.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/theme@0.5.7
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6-next.0

## 0.0.10

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- 5add8e1: Added a `SignalsDisplay` extension to allows the signals plugin to be installed in an app as follows:

  ```tsx
  export default app.createRoot(
    <>
      <AlertDisplay transientTimeoutMs={2500} />
      <OAuthRequestDialog />
      <SignalsDisplay />
      <AppRouter>
        <VisitListener />
        <Root>{routes}</Root>
      </AppRouter>
    </>,
  );
  ```

  With this in place you can remove the explicit installation via the `plugins` option for `createApp`.

- 3e9b1a4: Put a name on the `SignalsDisplay` component extension
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/theme@0.5.7
  - @backstage/plugin-signals-react@0.0.5
  - @backstage/types@1.1.1

## 0.0.10-next.2

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/theme@0.5.7-next.0
  - @backstage/plugin-signals-react@0.0.5-next.1
  - @backstage/types@1.1.1

## 0.0.10-next.1

### Patch Changes

- 3e9b1a4: Put a name on the `SignalsDisplay` component extension
- Updated dependencies
  - @backstage/core-components@0.14.11-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.5-next.0

## 0.0.10-next.0

### Patch Changes

- 5add8e1: Added a `SignalsDisplay` extension to allows the signals plugin to be installed in an app as follows:

  ```tsx
  export default app.createRoot(
    <>
      <AlertDisplay transientTimeoutMs={2500} />
      <OAuthRequestDialog />
      <SignalsDisplay />
      <AppRouter>
        <VisitListener />
        <Root>{routes}</Root>
      </AppRouter>
    </>,
  );
  ```

  With this in place you can remove the explicit installation via the `plugins` option for `createApp`.

- Updated dependencies
  - @backstage/plugin-signals-react@0.0.5-next.0
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1

## 0.0.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.4

## 0.0.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.4

## 0.0.8

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.4

## 0.0.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.1

## 0.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.4

## 0.0.7

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-signals-react@0.0.4
  - @backstage/types@1.1.1

## 0.0.7-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/plugin-signals-react@0.0.4-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/theme@0.5.6-next.0
  - @backstage/types@1.1.1

## 0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/plugin-signals-react@0.0.4-next.0
  - @backstage/theme@0.5.6-next.0
  - @backstage/types@1.1.1

## 0.0.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.6-next.0
  - @backstage/core-components@0.14.8-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.3

## 0.0.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.7
  - @backstage/theme@0.5.4

## 0.0.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 0.0.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.4-next.0
  - @backstage/core-components@0.14.5-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.3

## 0.0.5

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- 9a41a7b: Migrate signals and notifications to the new backend in local development
- f06458c: fixed typo in docs
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/theme@0.5.3
  - @backstage/plugin-signals-react@0.0.3
  - @backstage/types@1.1.1

## 0.0.5-next.1

### Patch Changes

- f06458c: fixed typo in docs
- Updated dependencies
  - @backstage/plugin-signals-react@0.0.3-next.0
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/types@1.1.1

## 0.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2

## 0.0.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2

## 0.0.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/theme@0.5.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2

## 0.0.2

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 72df7c6: Added ESLint rule `no-top-level-material-ui-4-imports` in the `signals` plugin to migrate the Material UI imports.
- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/theme@0.5.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2

## 0.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## 0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## 0.0.2-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/theme@0.5.2-next.0
  - @backstage/core-components@0.14.1-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.0

## 0.0.1

### Patch Changes

- 447d210: Fix disconnect loop on server start
- 8472188: Added or fixed the `repository` field in `package.json`.
- 047bead: Add support to subscribe and publish messages through signals plugins
- 1ab22c4: Allow defining signal type to publish and receive
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/plugin-signals-react@0.0.1
  - @backstage/theme@0.5.1
  - @backstage/core-plugin-api@1.9.0
  - @backstage/types@1.1.1

## 0.0.1-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- 1ab22c4: Allow defining signal type to publish and receive
- Updated dependencies
  - @backstage/theme@0.5.1-next.1
  - @backstage/plugin-signals-react@0.0.1-next.3
  - @backstage/core-components@0.14.0-next.2
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/types@1.1.1

## 0.0.1-next.2

### Patch Changes

- 447d210: Fix disconnect loop on server start
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/plugin-signals-react@0.0.1-next.2
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/theme@0.5.1-next.0
  - @backstage/types@1.1.1

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.1-next.1

## 0.0.1-next.0

### Patch Changes

- 047bead: Add support to subscribe and publish messages through signals plugins
- Updated dependencies
  - @backstage/plugin-signals-react@0.0.1-next.0
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
