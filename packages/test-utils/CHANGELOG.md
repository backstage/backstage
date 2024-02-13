# @backstage/test-utils

## 1.5.0-next.2

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-app-api@1.12.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/plugin-permission-react@0.4.20-next.1
  - @backstage/theme@0.5.1-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 1.5.0-next.1

### Patch Changes

- 07e7d12: Fix wording in API reference
- 7da67ce: Change `defaultScopes` for Bitbucket auth from invalid `team` to `account`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/core-app-api@1.11.4-next.0
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-react@0.4.20-next.0

## 1.5.0-next.0

### Minor Changes

- bb40898: Added `components` option to `TestAppOptions`, which will be forwarded as the `components` option to `createApp`.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/core-app-api@1.11.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/plugin-permission-react@0.4.19

## 1.4.7

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2
  - @backstage/plugin-permission-react@0.4.19
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/config@1.1.1
  - @backstage/core-app-api@1.11.3
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1

## 1.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-app-api@1.11.3-next.0
  - @backstage/plugin-permission-react@0.4.19-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.11

## 1.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.19-next.0
  - @backstage/config@1.1.1
  - @backstage/core-app-api@1.11.2
  - @backstage/core-plugin-api@1.8.1
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.11

## 1.4.6

### Patch Changes

- e8f2ace: Deprecated `mockBreakpoint`, as it is now available from `@backstage/core-components/testUtils` instead.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/theme@0.5.0
  - @backstage/core-app-api@1.11.2
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/plugin-permission-react@0.4.18
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.5.0-next.1
  - @backstage/config@1.1.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-react@0.4.18-next.1

## 1.4.6-next.1

### Patch Changes

- e8f2acef80: Deprecated `mockBreakpoint`, as it is now available from `@backstage/core-components/testUtils` instead.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 1.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/theme@0.5.0-next.0
  - @backstage/core-app-api@1.11.2-next.0
  - @backstage/plugin-permission-react@0.4.18-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 1.4.5

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 4aa43f62aa: Updated dependency `cross-fetch` to `^4.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.0
  - @backstage/plugin-permission-react@0.4.17
  - @backstage/core-app-api@1.11.1
  - @backstage/theme@0.4.4
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.4.5-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/plugin-permission-react@0.4.17-next.0
  - @backstage/core-app-api@1.11.1-next.0
  - @backstage/theme@0.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 1.4.4

### Patch Changes

- 322bbcae24: Removed the alpha `MockPluginProvider` export since the plugin configuration API has been removed.
- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.11.0-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/theme@0.4.3-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9-next.0
  - @backstage/plugin-permission-react@0.4.16-next.1

## 1.4.4-next.1

### Patch Changes

- 1a0616fa10: Add missing resource and template app icons
- Updated dependencies
  - @backstage/core-app-api@1.10.1-next.1
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/plugin-permission-react@0.4.16-next.0
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

## 1.4.4-next.0

### Patch Changes

- 322bbcae24: Removed the alpha `MockPluginProvider` export since the plugin configuration API has been removed.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/core-app-api@1.10.1-next.0
  - @backstage/plugin-permission-react@0.4.16-next.0
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

## 1.4.3

### Patch Changes

- 7032c214f3b4: Add pod exec terminal to Container Card
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency
- b5fbddc15dca: Add a new `MockTranslationApi` as an `/alpha` export.
- 9ceb6195275a: Add support for React Testing Library 13+, and thus React 18.

  We're exposing an additional option to the `render*` methods to enable the [`legacyRoot`](https://testing-library.com/docs/react-testing-library/api/#legacyroot) flow.

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/core-app-api@1.10.0
  - @backstage/core-plugin-api@1.6.0
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/plugin-permission-react@0.4.15
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1

## 1.4.3-next.3

### Patch Changes

- 7032c214f3b4: Add pod exec terminal to Container Card
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/core-app-api@1.10.0-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/plugin-permission-react@0.4.15-next.3
  - @backstage/theme@0.4.2-next.0
  - @backstage/types@1.1.1-next.0

## 1.4.3-next.2

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

## 1.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/core-app-api@1.10.0-next.1
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/plugin-permission-react@0.4.15-next.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## 1.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.10.0-next.0
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/config@1.0.8
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-react@0.4.15-next.0

## 1.4.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.9.1
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-react@0.4.14

## 1.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.9.1-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-react@0.4.14

## 1.4.1

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/core-app-api@1.9.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-react@0.4.14

## 1.4.1-next.2

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- Updated dependencies
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-app-api@1.8.2-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-react@0.4.14-next.2

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/core-app-api@1.8.2-next.0
  - @backstage/plugin-permission-react@0.4.14-next.1
  - @backstage/config@1.0.8

## 1.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/core-app-api@1.8.1
  - @backstage/core-plugin-api@1.5.2
  - @backstage/theme@0.4.0
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-react@0.4.14-next.0

## 1.4.0

### Minor Changes

- 1fd38bc4141a: Test App Wrapper is now using `UnifiedThemeProvider` for supporting Material UI v5 next to Material UI v4 in tests.

### Patch Changes

- 55853a367174: Add a `fetchApiRef` implementation by default
- Updated dependencies
  - @backstage/core-app-api@1.8.1
  - @backstage/core-plugin-api@1.5.2
  - @backstage/types@1.1.0
  - @backstage/theme@0.4.0
  - @backstage/plugin-permission-react@0.4.13
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.6

## 1.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/config@1.0.7
  - @backstage/core-app-api@1.8.1-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.1-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/config@1.0.7
  - @backstage/theme@0.4.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.4.0-next.0

### Minor Changes

- 1fd38bc4141a: Test App Wrapper is now using `UnifiedThemeProvider` for supporting Material UI v5 next to Material UI v4 in tests.

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.0-next.0
  - @backstage/config@1.0.7
  - @backstage/core-app-api@1.8.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5

## 1.3.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/core-app-api@1.8.0
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/config@1.0.7
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.12

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.7.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7
  - @backstage/theme@0.2.19
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-react@0.4.12

## 1.3.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-app-api@1.7.0
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.3.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.7.0-next.3
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-permission-react@0.4.12-next.1

## 1.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/core-app-api@1.7.0-next.2
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/plugin-permission-react@0.4.12-next.1

## 1.3.0-next.1

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/core-app-api@1.7.0-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/plugin-permission-react@0.4.12-next.0
  - @backstage/theme@0.2.19-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.3.0-next.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.7.0-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.11
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.4

## 1.2.6

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.0
  - @backstage/core-app-api@1.6.0
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.11

## 1.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.6.0-next.2
  - @backstage/core-plugin-api@1.5.0-next.2
  - @backstage/plugin-permission-react@0.4.11-next.2
  - @backstage/config@1.0.7-next.0

## 1.2.6-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/core-app-api@1.5.1-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/theme@0.2.18-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.11-next.1

## 1.2.6-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/config@1.0.6
  - @backstage/core-app-api@1.5.1-next.0
  - @backstage/theme@0.2.17
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-react@0.4.11-next.0

## 1.2.5

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.2.17
  - @backstage/core-app-api@1.5.0
  - @backstage/core-plugin-api@1.4.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-react@0.4.10

## 1.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.4.1-next.0
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3
  - @backstage/plugin-permission-react@0.4.9

## 1.2.4

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0
  - @backstage/core-app-api@1.4.0
  - @backstage/plugin-permission-react@0.4.9
  - @backstage/config@1.0.6
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3

## 1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/core-app-api@1.4.0-next.1
  - @backstage/plugin-permission-react@0.4.9-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3-next.0

## 1.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-react@0.4.9-next.0

## 1.2.3

### Patch Changes

- 5e238ed56a: The test utility for the plugin context called `MockPluginProvider` has been created. It will be handy in the cases when you use
  `__experimentalConfigure` in your plugin. It is experimental and exported through `@backstage/test-utils/alpha`.
- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- 830687539f: Sync components in @backstage/core-components with the Component Design Guidelines
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/core-app-api@1.3.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/plugin-permission-react@0.4.8
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5
  - @backstage/theme@0.2.16

## 1.2.3-next.4

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- Updated dependencies
  - @backstage/core-app-api@1.3.0-next.4
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/plugin-permission-react@0.4.8-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1

## 1.2.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.2.1-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1
  - @backstage/plugin-permission-react@0.4.8-next.2

## 1.2.3-next.2

### Patch Changes

- 830687539f: Sync components in @backstage/core-components with the Component Design Guidelines
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-app-api@1.2.1-next.2
  - @backstage/plugin-permission-react@0.4.8-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 1.2.3-next.1

### Patch Changes

- 5e238ed56a: The test utility for the plugin context called `MockPluginProvider` has been created. It will be handy in the cases when you use
  `__experimentalConfigure` in your plugin. It is experimental and exported through `@backstage/test-utils/alpha`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/core-app-api@1.2.1-next.1
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-permission-react@0.4.8-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-common@0.7.2-next.1

## 1.2.3-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- Updated dependencies
  - @backstage/core-app-api@1.2.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.8-next.0

## 1.2.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.2.0
  - @backstage/core-plugin-api@1.1.0
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.7

## 1.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.2.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-permission-react@0.4.7-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/theme@0.2.16

## 1.2.1

### Patch Changes

- e05e0f021b: Align on the version of `@material-ui/icons` used, to `^4.9.1` like other packages in the main repo
- Updated dependencies
  - @backstage/core-app-api@1.1.1
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/core-plugin-api@1.0.7
  - @backstage/config@1.0.3
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-react@0.4.6

## 1.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-permission-react@0.4.6-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/core-app-api@1.1.1-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.1.1-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-common@0.6.5-next.1
  - @backstage/plugin-permission-react@0.4.6-next.1

## 1.2.1-next.0

### Patch Changes

- e05e0f021b: Align on the version of `@material-ui/icons` used, to `^4.9.1` like other packages in the main repo
- Updated dependencies
  - @backstage/config@1.0.3-next.0
  - @backstage/core-app-api@1.1.1-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-common@0.6.5-next.0
  - @backstage/plugin-permission-react@0.4.6-next.0

## 1.2.0

### Minor Changes

- 817f3196f6: Elements rendered in a test app are no longer wrapped in a `Routes` and `Route` element, as this is not compatible with React Router v6 stable.

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 7d47def9c4: Removed dependency on `@types/jest`.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- d9e39544be: Add missing peer dependencies
- Updated dependencies
  - @backstage/core-app-api@1.1.0
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-permission-react@0.4.5
  - @backstage/config@1.0.2
  - @backstage/plugin-permission-common@0.6.4

## 1.2.0-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- d9e39544be: Add missing peer dependencies
- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/core-app-api@1.1.0-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/plugin-permission-react@0.4.5-next.2

## 1.2.0-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/core-app-api@1.1.0-next.2
  - @backstage/core-plugin-api@1.0.6-next.2
  - @backstage/plugin-permission-common@0.6.4-next.1

## 1.2.0-next.1

### Minor Changes

- 817f3196f6: Elements rendered in a test app are no longer wrapped in a `Routes` and `Route` element, as this is not compatible with React Router v6 stable.

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-app-api@1.1.0-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-permission-react@0.4.5-next.1

## 1.1.4-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/core-app-api@1.0.6-next.0
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0
  - @backstage/plugin-permission-react@0.4.5-next.0

## 1.1.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5
  - @backstage/core-app-api@1.0.5
  - @backstage/plugin-permission-react@0.4.4

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/core-app-api@1.0.5-next.0
  - @backstage/plugin-permission-react@0.4.4-next.0

## 1.1.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/core-app-api@1.0.4
  - @backstage/core-plugin-api@1.0.4
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.3

## 1.1.2-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/core-app-api@1.0.4-next.1
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/plugin-permission-common@0.6.3-next.1
  - @backstage/plugin-permission-react@0.4.3-next.1

## 1.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.2.16-next.0
  - @backstage/plugin-permission-common@0.6.3-next.0
  - @backstage/plugin-permission-react@0.4.3-next.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.4-next.0

## 1.1.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-app-api@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/plugin-permission-react@0.4.2

## 1.1.1-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-app-api@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/plugin-permission-react@0.4.2-next.0

## 1.1.0

### Minor Changes

- 1da8b248c2: Added the options parameter to `renderWithEffects`, which if forwarded to the `render` function from `@testling-library/react`. Initially only the `wrapper` option is supported.
- 1da8b248c2: Added `createTestAppWrapper`, which returns a component that can be used as the `wrapper` option for `render` or `renderWithEffects`.

### Patch Changes

- 1da8b248c2: Fixed `renderInTestApp` so that it is able to re-render the result without removing the app wrapping.
- 7a5ddfd595: Added missing `Routes` element to wrap the `Route` elements of the test app wrapping.
- 7a5ddfd595: The internal elements created as part of the `mountedRoutes` implementation are now hidden during rendering.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2
  - @backstage/config@1.0.1
  - @backstage/core-app-api@1.0.2
  - @backstage/plugin-permission-common@0.6.1
  - @backstage/plugin-permission-react@0.4.1

## 1.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1-next.0
  - @backstage/core-app-api@1.0.2-next.1
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/plugin-permission-react@0.4.1-next.1

## 1.1.0-next.1

### Minor Changes

- 1da8b248c2: Added the options parameter to `renderWithEffects`, which if forwarded to the `render` function from `@testling-library/react`. Initially only the `wrapper` option is supported.
- 1da8b248c2: Added `createTestAppWrapper`, which returns a component that can be used as the `wrapper` option for `render` or `renderWithEffects`.

### Patch Changes

- 1da8b248c2: Fixed `renderInTestApp` so that it is able to re-render the result without removing the app wrapping.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/core-app-api@1.0.2-next.0
  - @backstage/plugin-permission-react@0.4.1-next.0

## 1.0.2-next.0

### Patch Changes

- 7a5ddfd595: Added missing `Routes` element to wrap the `Route` elements of the test app wrapping.
- 7a5ddfd595: The internal elements created as part of the `mountedRoutes` implementation are now hidden during rendering.

## 1.0.1

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- c98d271466: Use updated types from `@backstage/plugin-permission-common`
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/core-app-api@1.0.1
  - @backstage/core-plugin-api@1.0.1

## 1.0.1-next.2

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.1
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/plugin-permission-react@0.4.0-next.1

## 1.0.1-next.1

### Patch Changes

- c98d271466: Use updated types from `@backstage/plugin-permission-common`
- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0-next.0
  - @backstage/plugin-permission-common@0.6.0-next.0

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-app-api@1.0.0
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-permission-react@0.3.4
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-common@0.5.3

## 0.3.0

### Minor Changes

- bb2bb36651: **BREAKING**: Removed the deprecated `get` method from `StorageAPI` and its implementations, this method has been replaced by the `snapshot` method. The return value from snapshot no longer includes `newValue` which has been replaced by `value`. For getting notified when a value changes, use `observe# @backstage/test-utils.
- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.6.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-react@0.3.3

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.7.0
  - @backstage/core-app-api@0.5.4
  - @backstage/plugin-permission-react@0.3.2

## 0.2.5

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-app-api@0.5.3
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/plugin-permission-react@0.3.1
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15
  - @backstage/types@0.1.2

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.5.2

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.5.2-next.0

## 0.2.3

### Patch Changes

- c54c0d9d10: Add MockPermissionApi
- 6bf7826258: Added a `MockFetchApi`
- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0
  - @backstage/plugin-permission-common@0.4.0
  - @backstage/core-plugin-api@0.6.0
  - @backstage/core-app-api@0.5.0
  - @backstage/config@0.1.13

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/core-app-api@0.5.0-next.0

## 0.2.2

### Patch Changes

- 2d3fd91e33: Add new `MockConfigApi` as a more discoverable and leaner method for mocking configuration.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-plugin-api@0.5.0
  - @backstage/core-app-api@0.4.0

## 0.2.1

### Patch Changes

- c36b7794f7: JSON serialize and freeze values stored by the `MockStorageApi`.

## 0.2.0

### Minor Changes

- a195284c7b: Updated `MockStorageApi` to reflect the `StorageApi` changes in `@backstage/core-plugin-api`.
- 771b9c07fe: Removed deprecated `Keyboard` class which has been superseded by `@testing-library/user-event#userEvent`
- f6722d2458: Removed deprecated `msw` definition which was replaced by calling `setupRequestMockHandlers` directly

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@0.3.0
  - @backstage/core-plugin-api@0.4.0

## 0.1.24

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/core-plugin-api@0.3.0
  - @backstage/core-app-api@0.2.0

## 0.1.23

### Patch Changes

- 000190de69: The `ApiRegistry` from `@backstage/core-app-api` class has been deprecated and will be removed in a future release. To replace it, we have introduced two new helpers that are exported from `@backstage/test-utils`, namely `TestApiProvider` and `TestApiRegistry`.

  These two new helpers are more tailored for writing tests and development setups, as they allow for partial implementations of each of the APIs.

  When migrating existing code it is typically best to prefer usage of `TestApiProvider` when possible, so for example the following code:

  ```tsx
  render(
    <ApiProvider
      apis={ApiRegistry.from([
        [identityApiRef, mockIdentityApi as unknown as IdentityApi]
      ])}
    >
      {...}
    </ApiProvider>
  )
  ```

  Would be migrated to this:

  ```tsx
  render(
    <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
      {...}
    </TestApiProvider>
  )
  ```

  In cases where the `ApiProvider` is used in a more standalone way, for example to reuse a set of APIs across multiple tests, the `TestApiRegistry` can be used instead. Note that the `TestApiRegistry` only has a single static factory method, `.from()`, and it is slightly different from the existing `.from()` method on `ApiRegistry` in that it doesn't require the API pairs to be wrapped in an outer array.

  Usage that looks like this:

  ```ts
  const apis = ApiRegistry.with(
    identityApiRef,
    mockIdentityApi as unknown as IdentityApi,
  ).with(configApiRef, new ConfigReader({}));
  ```

  OR like this:

  ```ts
  const apis = ApiRegistry.from([
    [identityApiRef, mockIdentityApi as unknown as IdentityApi],
    [configApiRef, new ConfigReader({})],
  ]);
  ```

  Would be migrated to this:

  ```ts
  const apis = TestApiRegistry.from(
    [identityApiRef, mockIdentityApi],
    [configApiRef, new ConfigReader({})],
  );
  ```

  If your app is still using the `ApiRegistry` to construct the `apis` for `createApp`, we recommend that you move over to use the new method of supplying API factories instead, using `createApiFactory`.

- Updated dependencies
  - @backstage/core-app-api@0.1.23
  - @backstage/core-plugin-api@0.2.1

## 0.1.22

### Patch Changes

- 0b1de52732: Migrated to using new `ErrorApiError` and `ErrorApiErrorContext` names.
- 2dd2a7b2cc: Migrated to using `createSpecializedApp`.
- Updated dependencies
  - @backstage/core-plugin-api@0.2.0
  - @backstage/core-app-api@0.1.21

## 0.1.21

### Patch Changes

- 71fd5cd735: Update Keyboard deprecation with a link to the recommended successor
- Updated dependencies
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13
  - @backstage/core-app-api@0.1.20

## 0.1.20

### Patch Changes

- bb12aae352: Migrates all utility methods from `test-utils-core` into `test-utils` and delete exports from the old package.
  This should have no impact since this package is considered internal and have no usages outside core packages.

  Notable changes are that the testing tool `msw.setupDefaultHandlers()` have been deprecated in favour of `setupRequestMockHandlers()`.

- c5bb1df55d: Bump `msw` to `v0.35.0` to resolve [CVE-2021-32796](https://github.com/advisories/GHSA-5fg8-2547-mr8q).
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/theme@0.2.12
  - @backstage/core-app-api@0.1.19
  - @backstage/core-plugin-api@0.1.12

## 0.1.19

### Patch Changes

- 54bbe25c34: Store the namespaced bucket storage for each instance that was created with `MockStorage.create()` instead of global variable.
- Updated dependencies
  - @backstage/core-app-api@0.1.17
  - @backstage/theme@0.2.11

## 0.1.18

### Patch Changes

- e749a38e89: Added a mock implementation of the `AnalyticsApi`, which can be used to make
  assertions about captured analytics events.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.10
  - @backstage/core-app-api@0.1.16
  - @backstage/test-utils-core@0.1.3

## 0.1.17

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- Updated dependencies
  - @backstage/core-app-api@0.1.8
  - @backstage/core-plugin-api@0.1.6
  - @backstage/test-utils-core@0.1.2

## 0.1.16

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-app-api@0.1.6
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.15

### Patch Changes

- 45b5fc3a8: Updated the layout of catalog and API index pages to handle smaller screen sizes. This adds responsive wrappers to the entity tables, and switches filters to a drawer when width-constrained. If you have created a custom catalog or API index page, you will need to update the page structure to match the updated [catalog customization](https://backstage.io/docs/features/software-catalog/catalog-customization) documentation.
- Updated dependencies
  - @backstage/core-app-api@0.1.5

## 0.1.14

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-app-api@0.1.3
  - @backstage/core-plugin-api@0.1.3

## 0.1.13

### Patch Changes

- 7af9cef07: Fix a bug in `MockStorageApi` where it unhelpfully returned new empty buckets every single time
- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [0160678b1]
  - @backstage/theme@0.2.8
  - @backstage/core-api@0.2.21

## 0.1.12

### Patch Changes

- 61c3f927c: Updated `MockErrorApi` to work with new `Observable` type in `@backstage/core`.
- Updated dependencies [61c3f927c]
- Updated dependencies [65e6c4541]
  - @backstage/core-api@0.2.19

## 0.1.11

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- Updated dependencies [062bbf90f]
- Updated dependencies [675a569a9]
  - @backstage/core-api@0.2.18

## 0.1.10

### Patch Changes

- ae6250ce3: Remove unnecessary wrapping of elements rendered by `wrapInTestApp` and `renderInTestApp`, which was breaking mount discovery.
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [b051e770c]
  - @backstage/core-api@0.2.16

## 0.1.9

### Patch Changes

- 4e0b5055a: Allow `ExternalRouteRef` bindings in `mountedRoutes` to work with the latest version of core-api.
- Updated dependencies [a51dc0006]
- Updated dependencies [e7f9b9435]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d88dd219e]
- Updated dependencies [c8b54c370]
  - @backstage/core-api@0.2.14

## 0.1.8

### Patch Changes

- dc12852c9: Allow `ExternalRouteRef` instances to be passed as a route ref to `mountedRoutes`.
- Updated dependencies [3a58084b6]
- Updated dependencies [1407b34c6]
- Updated dependencies [b6c4f485d]
- Updated dependencies [3a58084b6]
  - @backstage/core-api@0.2.11

## 0.1.7

### Patch Changes

- b51ee6ece: Added `mountedRoutes` option to `wrapInTestApp`, allowing routes to be associated to concrete paths to make `useRouteRef` usable in tested components.

## 0.1.6

### Patch Changes

- 1dc445e89: Update to use new plugin extension API
- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
  - @backstage/core-api@0.2.7

## 0.1.5

### Patch Changes

- e1f4e24ef: Fix @backstage/cli not being a devDependency
- Updated dependencies [b6557c098]
- Updated dependencies [d8d5a17da]
- Updated dependencies [1665ae8bb]
  - @backstage/core-api@0.2.5
  - @backstage/theme@0.2.2

## 0.1.4

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [4a655c89d]
- Updated dependencies [8a16e8af8]
- Updated dependencies [00670a96e]
  - @backstage/cli@0.4.0
  - @backstage/core-api@0.2.4

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [902340451]
  - @backstage/cli@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [3472c8be7]
- Updated dependencies [1d0aec70f]
- Updated dependencies [a3840bed2]
- Updated dependencies [b79017fd3]
- Updated dependencies [72f6cda35]
- Updated dependencies [8c2b76e45]
- Updated dependencies [cba4e4d97]
- Updated dependencies [8afce088a]
- Updated dependencies [9a3b3dbf1]
- Updated dependencies [26e69ab1a]
- Updated dependencies [cbab5bbf8]
- Updated dependencies [7bbeb049f]
  - @backstage/cli@0.2.0
  - @backstage/core-api@0.2.0
  - @backstage/theme@0.2.0
