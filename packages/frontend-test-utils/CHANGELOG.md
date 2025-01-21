# @backstage/frontend-test-utils

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.0
  - @backstage/frontend-app-api@0.10.5-next.0
  - @backstage/config@1.3.2
  - @backstage/test-utils@1.7.4
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.6-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4
  - @backstage/types@1.2.1
  - @backstage/config@1.3.2
  - @backstage/frontend-app-api@0.10.4
  - @backstage/test-utils@1.7.4
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.5

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4-next.0
  - @backstage/types@1.2.1-next.0
  - @backstage/frontend-app-api@0.10.4-next.0
  - @backstage/plugin-app@0.1.5-next.0
  - @backstage/test-utils@1.7.4-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/version-bridge@1.0.10

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4
  - @backstage/frontend-plugin-api@0.9.3
  - @backstage/config@1.3.1
  - @backstage/frontend-app-api@0.10.3
  - @backstage/test-utils@1.7.3
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.1-next.0
  - @backstage/frontend-app-api@0.10.3-next.2
  - @backstage/frontend-plugin-api@0.9.3-next.2
  - @backstage/test-utils@1.7.3-next.1
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.4-next.2

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/frontend-app-api@0.10.3-next.1
  - @backstage/frontend-plugin-api@0.9.3-next.1
  - @backstage/test-utils@1.7.3-next.0
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.4-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.0
  - @backstage/config@1.3.0
  - @backstage/frontend-app-api@0.10.3-next.0
  - @backstage/test-utils@1.7.3-next.0
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/frontend-app-api@0.10.1
  - @backstage/frontend-plugin-api@0.9.1
  - @backstage/test-utils@1.7.1
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.2

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/frontend-app-api@0.10.1-next.2
  - @backstage/frontend-plugin-api@0.9.1-next.2
  - @backstage/test-utils@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.2-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/frontend-app-api@0.10.1-next.1
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/test-utils@1.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.2-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/frontend-app-api@0.10.1-next.0
  - @backstage/frontend-plugin-api@0.9.1-next.0
  - @backstage/test-utils@1.7.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10
  - @backstage/plugin-app@0.1.2-next.0

## 0.2.1

### Patch Changes

- 666d5b1: Disable the built-in `SignInPage` in `createExtensionTester` in order to not mess with existing tests
- e969dc7: Move `@types/react` to a peer dependency.
- 873e424: Internal refactor of usage of opaque types.
- 0801db6: Added an `ApiMock`, analogous to `ServiceMock` from the backend test utils.
- 9cc7dd6: Added a `mockApis` export, which will replace the `MockX` API implementation classes and their related types. This is analogous with the backend's `mockServices`.

  **DEPRECATED** several old helpers:

  - Deprecated `MockAnalyticsApi`, please use `mockApis.analytics` instead.
  - Deprecated `MockConfigApi`, please use `mockApis.config` instead.
  - Deprecated `MockPermissionApi`, please use `mockApis.permission` instead.
  - Deprecated `MockStorageApi`, please use `mockApis.storage` instead.
  - Deprecated `MockTranslationApi`, please use `mockApis.translation` instead.

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0
  - @backstage/frontend-app-api@0.10.0
  - @backstage/version-bridge@1.0.10
  - @backstage/test-utils@1.7.0
  - @backstage/plugin-app@0.1.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.2.1-next.2

### Patch Changes

- 0801db6: Added an `ApiMock`, analogous to `ServiceMock` from the backend test utils.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/test-utils@1.6.1-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-app@0.1.1-next.2

## 0.2.1-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.1
  - @backstage/frontend-app-api@0.10.0-next.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/test-utils@1.6.1-next.1
  - @backstage/plugin-app@0.1.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.2.1-next.0

### Patch Changes

- 873e424: Internal refactor of usage of opaque types.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.0
  - @backstage/frontend-app-api@0.10.0-next.0
  - @backstage/plugin-app@0.1.1-next.0
  - @backstage/config@1.2.0
  - @backstage/test-utils@1.6.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.9

## 0.2.0

### Minor Changes

- 5446061: Removed support for testing "v1" extensions, where outputs are defined as an object rather than an array.
- e6e488c: **BREAKING**: The deprecated `.render()` method has been removed from the extension tester.

### Patch Changes

- 2a61422: The extension tester will no longer unconditionally enable any additional extensions that have been added.
- fec8b57: Updated exports to use the new type parameters for extensions and extension blueprints.
- 4a66456: Internal update to add support for passing an `ApiRegistry` when creating the node tree
- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- 948d431: Removing deprecated `namespace` parameter in favour of `pluginId` instead
- 043d7cd: Internal refactor
- f6d1874: Added the ability to provide additional `extensions` and `features` to `renderInTestApp`
- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0
  - @backstage/frontend-app-api@0.9.0
  - @backstage/plugin-app@0.1.0
  - @backstage/test-utils@1.6.0
  - @backstage/version-bridge@1.0.9
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.2.0-next.2

### Patch Changes

- 2a61422: The extension tester will no longer unconditionally enable any additional extensions that have been added.
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- 043d7cd: Internal refactor
- Updated dependencies
  - @backstage/test-utils@1.6.0-next.1
  - @backstage/plugin-app@0.1.0-next.2
  - @backstage/frontend-app-api@0.9.0-next.2
  - @backstage/frontend-plugin-api@0.8.0-next.2
  - @backstage/version-bridge@1.0.9-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.2.0-next.1

### Patch Changes

- 948d431: Removing deprecated `namespace` parameter in favour of `pluginId` instead
- Updated dependencies
  - @backstage/frontend-app-api@0.9.0-next.1
  - @backstage/frontend-plugin-api@0.8.0-next.1
  - @backstage/plugin-app@0.1.0-next.1
  - @backstage/config@1.2.0
  - @backstage/test-utils@1.6.0-next.0
  - @backstage/types@1.1.1

## 0.2.0-next.0

### Minor Changes

- 5446061: Removed support for testing "v1" extensions, where outputs are defined as an object rather than an array.
- e6e488c: **BREAKING**: The deprecated `.render()` method has been removed from the extension tester.

### Patch Changes

- fec8b57: Updated exports to use the new type parameters for extensions and extension blueprints.
- 4a66456: Internal update to add support for passing an `ApiRegistry` when creating the node tree
- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.
- f6d1874: Added the ability to provide additional `extensions` and `features` to `renderInTestApp`
- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0-next.0
  - @backstage/frontend-app-api@0.9.0-next.0
  - @backstage/plugin-app@0.1.0-next.0
  - @backstage/test-utils@1.6.0-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.1.12

### Patch Changes

- 8209449: Added new APIs for testing extensions
- 72754db: Updated usage of `useRouteRef`, which can now always return `undefined`.
- 3be9aeb: Added support for v2 extensions, which declare their inputs and outputs without using a data map.
- fe1fbb2: Migrating usages of the deprecated `createExtension` `v1` format to the newer `v2` format, and old `create*Extension` extension creators to blueprints.
- 2d21599: Added support for being able to override extension definitions.

  ```tsx
  const TestCard = EntityCardBlueprint.make({
    ...
  });

  TestCard.override({
    // override attachment points
    attachTo: { id: 'something-else', input: 'overridden' },
    // extend the config schema
    config: {
      schema: {
        newConfig: z => z.string().optional(),
      }
    },
    // override factory
    *factory(originalFactory, { inputs, config }){
      const originalOutput = originalFactory();

      yield coreExentsionData.reactElement(
        <Wrapping>
          {originalOutput.get(coreExentsionData.reactElement)}
        </Wrapping>
      );
    }
  });

  ```

- c00e1a0: Deprecate the `.render` method of the `createExtensionTester` in favour of using `renderInTestApp` directly.

  ```tsx
  import {
    renderInTestApp,
    createExtensionTester,
  } from '@backstage/frontend-test-utils';

  const tester = createExtensionTester(extension);

  const { getByTestId } = renderInTestApp(tester.reactElement());

  // or if you're not using `coreExtensionData.reactElement` as the output ref
  const { getByTestId } = renderInTestApp(tester.get(myComponentRef));
  ```

- 264e10f: Deprecate existing `ExtensionCreators` in favour of their new Blueprint counterparts.
- 264e10f: Refactor `.make` method on Blueprints into two different methods, `.make` and `.makeWithOverrides`.

  When using `createExtensionBlueprint` you can define parameters for the factory function, if you wish to take advantage of these parameters you should use `.make` when creating an extension instance of a Blueprint. If you wish to override more things other than the standard `attachTo`, `name`, `namespace` then you should use `.makeWithOverrides` instead.

  `.make` is reserved for simple creation of extension instances from Blueprints using higher level parameters, whereas `.makeWithOverrides` is lower level and you have more control over the final extension.

- 6349099: Added config input type to the extensions
- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0
  - @backstage/frontend-app-api@0.8.0
  - @backstage/config@1.2.0
  - @backstage/test-utils@1.5.10
  - @backstage/types@1.1.1

## 0.1.12-next.3

### Patch Changes

- 2d21599: Added support for being able to override extension definitions.

  ```tsx
  const TestCard = EntityCardBlueprint.make({
    ...
  });

  TestCard.override({
    // override attachment points
    attachTo: { id: 'something-else', input: 'overridden' },
    // extend the config schema
    config: {
      schema: {
        newConfig: z => z.string().optional(),
      }
    },
    // override factory
    *factory(originalFactory, { inputs, config }){
      const originalOutput = originalFactory();

      yield coreExentsionData.reactElement(
        <Wrapping>
          {originalOutput.get(coreExentsionData.reactElement)}
        </Wrapping>
      );
    }
  });

  ```

- 264e10f: Deprecate existing `ExtensionCreators` in favour of their new Blueprint counterparts.
- 264e10f: Refactor `.make` method on Blueprints into two different methods, `.make` and `.makeWithOverrides`.

  When using `createExtensionBlueprint` you can define parameters for the factory function, if you wish to take advantage of these parameters you should use `.make` when creating an extension instance of a Blueprint. If you wish to override more things other than the standard `attachTo`, `name`, `namespace` then you should use `.makeWithOverrides` instead.

  `.make` is reserved for simple creation of extension instances from Blueprints using higher level parameters, whereas `.makeWithOverrides` is lower level and you have more control over the final extension.

- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0-next.3
  - @backstage/frontend-app-api@0.7.5-next.3
  - @backstage/config@1.2.0
  - @backstage/test-utils@1.5.10-next.2
  - @backstage/types@1.1.1

## 0.1.12-next.2

### Patch Changes

- 8209449: Added new APIs for testing extensions
- 72754db: Updated usage of `useRouteRef`, which can now always return `undefined`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.7.0-next.2
  - @backstage/frontend-app-api@0.7.5-next.2
  - @backstage/test-utils@1.5.10-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.1.12-next.1

### Patch Changes

- 3be9aeb: Added support for v2 extensions, which declare their inputs and outputs without using a data map.
- 6349099: Added config input type to the extensions
- Updated dependencies
  - @backstage/frontend-app-api@0.7.5-next.1
  - @backstage/frontend-plugin-api@0.6.8-next.1
  - @backstage/test-utils@1.5.10-next.1
  - @backstage/types@1.1.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.8-next.0
  - @backstage/frontend-app-api@0.7.4-next.0
  - @backstage/test-utils@1.5.9-next.0
  - @backstage/types@1.1.1

## 0.1.10

### Patch Changes

- 95a3a0b: Rename frontend and backend `setupRequestMockHandlers` methods to `registerMswTestHooks`.
- Updated dependencies
  - @backstage/frontend-app-api@0.7.3
  - @backstage/test-utils@1.5.8
  - @backstage/frontend-plugin-api@0.6.7
  - @backstage/types@1.1.1

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.3-next.2
  - @backstage/frontend-plugin-api@0.6.7-next.1

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.3-next.1
  - @backstage/test-utils@1.5.8-next.1
  - @backstage/frontend-plugin-api@0.6.7-next.0
  - @backstage/types@1.1.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.2-next.0
  - @backstage/frontend-plugin-api@0.6.7-next.0
  - @backstage/test-utils@1.5.7-next.0
  - @backstage/types@1.1.1

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.1
  - @backstage/frontend-plugin-api@0.6.6
  - @backstage/test-utils@1.5.6
  - @backstage/types@1.1.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.1-next.2
  - @backstage/frontend-plugin-api@0.6.6-next.2
  - @backstage/test-utils@1.5.6-next.2
  - @backstage/types@1.1.1

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.1-next.1
  - @backstage/frontend-plugin-api@0.6.6-next.1
  - @backstage/test-utils@1.5.6-next.1
  - @backstage/types@1.1.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.1-next.0
  - @backstage/test-utils@1.5.6-next.0
  - @backstage/frontend-plugin-api@0.6.6-next.0
  - @backstage/types@1.1.1

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.0
  - @backstage/frontend-plugin-api@0.6.5
  - @backstage/test-utils@1.5.5

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.7.0-next.2
  - @backstage/frontend-plugin-api@0.6.5-next.1

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.5-next.1
  - @backstage/frontend-plugin-api@0.6.5-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.5-next.0
  - @backstage/frontend-plugin-api@0.6.5-next.0
  - @backstage/test-utils@1.5.5-next.0
  - @backstage/types@1.1.1

## 0.1.6

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- Updated dependencies
  - @backstage/frontend-app-api@0.6.4
  - @backstage/frontend-plugin-api@0.6.4
  - @backstage/test-utils@1.5.4
  - @backstage/types@1.1.1

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.4-next.1
  - @backstage/frontend-plugin-api@0.6.4-next.1
  - @backstage/test-utils@1.5.4-next.0
  - @backstage/types@1.1.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.4-next.0
  - @backstage/frontend-plugin-api@0.6.4-next.0
  - @backstage/test-utils@1.5.3
  - @backstage/types@1.1.1

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.3
  - @backstage/frontend-plugin-api@0.6.3
  - @backstage/test-utils@1.5.3
  - @backstage/types@1.1.1

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.2
  - @backstage/frontend-plugin-api@0.6.2
  - @backstage/test-utils@1.5.2
  - @backstage/types@1.1.1

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.1
  - @backstage/frontend-plugin-api@0.6.1
  - @backstage/test-utils@1.5.1
  - @backstage/types@1.1.1

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.1-next.2
  - @backstage/frontend-plugin-api@0.6.1-next.2
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/types@1.1.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.1-next.1
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/types@1.1.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.1-next.0
  - @backstage/test-utils@1.5.1-next.0
  - @backstage/frontend-plugin-api@0.6.1-next.0
  - @backstage/types@1.1.1

## 0.1.2

### Patch Changes

- bc621aa: Updates to use the new `RouteResolutionsApi`.
- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0
  - @backstage/frontend-app-api@0.6.0
  - @backstage/test-utils@1.5.0
  - @backstage/types@1.1.1

## 0.1.2-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/frontend-app-api@0.6.0-next.3
  - @backstage/frontend-plugin-api@0.6.0-next.3
  - @backstage/test-utils@1.5.0-next.3
  - @backstage/types@1.1.1

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0-next.2
  - @backstage/frontend-app-api@0.6.0-next.2
  - @backstage/test-utils@1.5.0-next.2
  - @backstage/types@1.1.1

## 0.1.2-next.1

### Patch Changes

- bc621aa: Updates to use the new `RouteResolutionsApi`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0-next.1
  - @backstage/frontend-app-api@0.6.0-next.1
  - @backstage/test-utils@1.5.0-next.1
  - @backstage/types@1.1.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.0-next.0
  - @backstage/frontend-plugin-api@0.5.1-next.0
  - @backstage/test-utils@1.5.0-next.0
  - @backstage/types@1.1.1

## 0.1.1

### Patch Changes

- f7566f9: Updates to reflect the `app/router` extension having been renamed to `app/root`.
- 516fd3e: Updated README to reflect release status
- c97fa1c: Added `elements`, `wrappers`, and `router` inputs to `app/root`, that let you add things to the root of the React tree above the layout. You can use the `createAppRootElementExtension`, `createAppRootWrapperExtension`, and `createRouterExtension` extension creator, respectively, to conveniently create such extensions. These are all optional, and if you do not supply a router a default one will be used (`BrowserRouter` in regular runs, `MemoryRouter` in tests/CI).
- Updated dependencies
  - @backstage/frontend-plugin-api@0.5.0
  - @backstage/frontend-app-api@0.5.0
  - @backstage/test-utils@1.4.7
  - @backstage/types@1.1.1

## 0.1.1-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.2
  - @backstage/frontend-app-api@0.4.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.4.1-next.1
  - @backstage/frontend-plugin-api@0.4.1-next.1
  - @backstage/test-utils@1.4.7-next.1
  - @backstage/types@1.1.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.0
  - @backstage/frontend-app-api@0.4.1-next.0
  - @backstage/test-utils@1.4.7-next.0
  - @backstage/types@1.1.1

## 0.1.0

### Minor Changes

- 59fabd5: New testing utility library for `@backstage/frontend-app-api` and `@backstage/frontend-plugin-api`.
- af7bc3e: Switched all core extensions to instead use the namespace `'app'`.

### Patch Changes

- 59fabd5: Added `createExtensionTester` for rendering extensions in tests.
- 7e4b0db: The `createExtensionTester` helper is now able to render more than one route in the test app.
- 818eea4: Updates for compatibility with the new extension IDs.
- b9aa6e4: Migrate `renderInTestApp` to `@backstage/frontend-test-utils` for testing individual React components in an app.
- e539735: Updates for `core.router` addition.
- c21c9cf: Re-export mock API implementations as well as `TestApiProvider`, `TestApiRegistry`, `withLogCollector`, and `setupRequestMockHandlers` from `@backstage/test-utils`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0
  - @backstage/frontend-app-api@0.4.0
  - @backstage/test-utils@1.4.6
  - @backstage/types@1.1.1

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.4.0-next.3
  - @backstage/frontend-plugin-api@0.4.0-next.3
  - @backstage/test-utils@1.4.6-next.2
  - @backstage/types@1.1.1

## 0.1.0-next.2

### Patch Changes

- 818eea4: Updates for compatibility with the new extension IDs.
- b9aa6e4: Migrate `renderInTestApp` to `@backstage/frontend-test-utils` for testing individual React components in an app.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.2
  - @backstage/frontend-app-api@0.4.0-next.2
  - @backstage/test-utils@1.4.6-next.2
  - @backstage/types@1.1.1

## 0.1.0-next.1

### Patch Changes

- e539735435: Updates for `core.router` addition.
- c21c9cf07b: Re-export mock API implementations as well as `TestApiProvider`, `TestApiRegistry`, `withLogCollector`, and `setupRequestMockHandlers` from `@backstage/test-utils`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/frontend-app-api@0.4.0-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 59fabd5106: New testing utility library for `@backstage/frontend-app-api` and `@backstage/frontend-plugin-api`.

### Patch Changes

- 59fabd5106: Added `createExtensionTester` for rendering extensions in tests.
- Updated dependencies
  - @backstage/frontend-app-api@0.3.1-next.0
  - @backstage/frontend-plugin-api@0.3.1-next.0
  - @backstage/test-utils@1.4.6-next.0
  - @backstage/types@1.1.1
