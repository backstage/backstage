# @backstage/frontend-plugin-api

## 0.10.0

### Minor Changes

- 4823831: Introduced a `createFrontendFeatureLoader()` function, as well as a `FrontendFeatureLoader` interface, to gather several frontend plugins, modules or feature loaders in a single exported entrypoint and load them, possibly asynchronously. This new feature, very similar to the `createBackendFeatureLoader()` already available on the backend, supersedes the previous `CreateAppFeatureLoader` type which has been deprecated.
- 8250ffe: **BREAKING**: Removed the deprecated `ExtensionOverrides` and `FrontendFeature` types.
- 0d1a397: **BREAKING**: Removed deprecated variant of `createExtensionDataRef` where the ID is passed directly.

### Patch Changes

- 5aa7f2c: Added a new Utility API, `DialogApi`, which can be used to show dialogs in the React tree that can collect input from the user.
- e23f5e0: Added new `ExtensionMiddlewareFactory` type.
- a6cb67d: The extensions map for plugins created with `createFrontendPlugin` is now sorted alphabetically by ID in the TypeScript type.
- de72253: Added a new `ExtensionBoundary.lazyComponent` helper in addition to the existing `ExtensionBoundary.lazy` helper.
- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.0-next.2

### Minor Changes

- 8250ffe: **BREAKING**: Removed the deprecated `ExtensionOverrides` and `FrontendFeature` types.
- 0d1a397: **BREAKING**: Removed deprecated variant of `createExtensionDataRef` where the ID is passed directly.

### Patch Changes

- 5aa7f2c: Added a new Utility API, `DialogApi`, which can be used to show dialogs in the React tree that can collect input from the user.
- e23f5e0: Added new `ExtensionMiddlewareFactory` type.
- a6cb67d: The extensions map for plugins created with `createFrontendPlugin` is now sorted alphabetically by ID in the TypeScript type.
- Updated dependencies
  - @backstage/core-components@0.16.5-next.1
  - @backstage/core-plugin-api@1.10.4
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.9.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/core-plugin-api@1.10.4
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.9.6-next.0

### Patch Changes

- de72253: Added a new `ExtensionBoundary.lazyComponent` helper in addition to the existing `ExtensionBoundary.lazy` helper.

## 0.9.5

### Patch Changes

- 3e21b8d: Added `getNodesByRoutePath` method to the `AppTreeApi`.
- f1efb47: Add support for defining multiple attachment points for extensions and blueprints.
- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- 9ff3322: Allow route references to be installed in multiple app instances as long as their name is the same.
- Updated dependencies
  - @backstage/core-components@0.16.4
  - @backstage/core-plugin-api@1.10.4
  - @backstage/version-bridge@1.0.11
  - @backstage/types@1.2.1

## 0.9.5-next.3

### Patch Changes

- f1efb47: Add support for defining multiple attachment points for extensions and blueprints.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11-next.0

## 0.9.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11-next.0

## 0.9.5-next.1

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- 9ff3322: Allow route references to be installed in multiple app instances as long as their name is the same.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.0
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/version-bridge@1.0.11-next.0
  - @backstage/types@1.2.1

## 0.9.5-next.0

### Patch Changes

- 3e21b8d: Added `getNodesByRoutePath` method to the `AppTreeApi`.
- Updated dependencies
  - @backstage/core-components@0.16.3
  - @backstage/core-plugin-api@1.10.3
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.10

## 0.9.4

### Patch Changes

- b40eb41: Move `Expand` and `ExpandRecursive` to `@backstage/types`
- Updated dependencies
  - @backstage/core-plugin-api@1.10.3
  - @backstage/types@1.2.1
  - @backstage/core-components@0.16.3
  - @backstage/version-bridge@1.0.10

## 0.9.4-next.0

### Patch Changes

- b40eb41: Move `Expand` and `ExpandRecursive` to `@backstage/types`
- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/types@1.2.1-next.0
  - @backstage/core-components@0.16.3-next.0
  - @backstage/version-bridge@1.0.10

## 0.9.3

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/core-components@0.16.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.9.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.9.3-next.0

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 0.9.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.0
  - @backstage/core-components@0.16.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/version-bridge@1.0.10

## 0.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/core-plugin-api@1.10.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10

## 0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10

## 0.9.0

### Minor Changes

- 4a5ba19: Removed deprecated `namespace` option from `createExtension` and `createExtensionBlueprint`, including `.make` and `.makeWithOverides`, it's no longer necessary and will use the `pluginId` instead.

  Removed deprecated `createExtensionOverrides` this should be replaced with `createFrontendModule` instead.

  Removed deprecated `BackstagePlugin` type, use `FrontendPlugin` type instead from this same package.

- bfd4bec: **BREAKING PRODUCERS**: The `IconComponent` no longer accepts `fontSize="default"`. This has effectively been removed from Material-UI since its last two major versions, and has not worked properly for them in a long time.

  This change should not have an effect on neither users of MUI4 nor MUI5/6, since the updated interface should still let you send the respective `SvgIcon` types into interfaces where relevant (e.g. as app icons).

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 873e424: Internal refactor of usage of opaque types.
- 323aae8: It is now possible to override the blueprint parameters when overriding an extension created from a blueprint:

  ```ts
  const myExtension = MyBlueprint.make({
    params: {
      myParam: 'myDefault',
    },
  });

  const myOverride = myExtension.override({
    params: {
      myParam: 'myOverride',
    },
  });
  const myFactoryOverride = myExtension.override({
    factory(origFactory) {
      return origFactory({
        params: {
          myParam: 'myOverride',
        },
      });
    },
  });
  ```

  The provided parameters will be merged with the original parameters of the extension.

- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/version-bridge@1.0.10
  - @backstage/types@1.1.1

## 0.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0

## 0.9.0-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/types@1.1.1

## 0.9.0-next.0

### Minor Changes

- 4a5ba19: Removed deprecated `namespace` option from `createExtension` and `createExtensionBlueprint`, including `.make` and `.makeWithOverides`, it's no longer necessary and will use the `pluginId` instead.

  Removed deprecated `createExtensionOverrides` this should be replaced with `createFrontendModule` instead.

  Removed deprecated `BackstagePlugin` type, use `FrontendPlugin` type instead from this same package.

- bfd4bec: **BREAKING PRODUCERS**: The `IconComponent` no longer accepts `fontSize="default"`. This has effectively been removed from Material-UI since its last two major versions, and has not worked properly for them in a long time.

  This change should not have an effect on neither users of MUI4 nor MUI5/6, since the updated interface should still let you send the respective `SvgIcon` types into interfaces where relevant (e.g. as app icons).

### Patch Changes

- 873e424: Internal refactor of usage of opaque types.
- 323aae8: It is now possible to override the blueprint parameters when overriding an extension created from a blueprint:

  ```ts
  const myExtension = MyBlueprint.make({
    params: {
      myParam: 'myDefault',
    },
  });

  const myOverride = myExtension.override({
    params: {
      myParam: 'myOverride',
    },
  });
  const myFactoryOverride = myExtension.override({
    factory(origFactory) {
      return origFactory({
        params: {
          myParam: 'myOverride',
        },
      });
    },
  });
  ```

  The provided parameters will be merged with the original parameters of the extension.

- Updated dependencies
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.9

## 0.8.0

### Minor Changes

- 5446061: **BREAKING**: Removed support for "v1" extensions. This means that it is no longer possible to declare inputs and outputs as objects when using `createExtension`. In addition, all extension creators except for `createComponentExtension` have been removed, use the equivalent blueprint instead. See the [1.30 migration documentation](https://backstage.io/docs/frontend-system/architecture/migrations/#130) for more information on this change.
- fec8b57: **BREAKING**: Updated the type parameters for `ExtensionDefinition` and `ExtensionBlueprint` to only have a single object parameter. The base type parameter is exported as `ExtensionDefinitionParameters` and `ExtensionBlueprintParameters` respectively. This is shipped as an immediate breaking change as we expect usage of these types to be rare, and it does not affect the runtime behavior of the API.

  This is a breaking change as it changes the type parameters. Existing usage can generally be updated as follows:

  - `ExtensionDefinition<any>` -> `ExtensionDefinition`
  - `ExtensionDefinition<any, any>` -> `ExtensionDefinition`
  - `ExtensionDefinition<TConfig>` -> `ExtensionDefinition<{ config: TConfig }>`
  - `ExtensionDefinition<TConfig, TConfigInput>` -> `ExtensionDefinition<{ config: TConfig, configInput: TConfigInput }>`

  If you need to infer the parameter you can use `ExtensionDefinitionParameters`, for example:

  ```ts
  import {
    ExtensionDefinition,
    ExtensionDefinitionParameters,
  } from '@backstage/frontend-plugin-api';

  function myUtility<T extends ExtensionDefinitionParameters>(
    ext: ExtensionDefinition<T>,
  ): T['config'] {
    // ...
  }
  ```

  The same patterns apply to `ExtensionBlueprint`.

  This change is made to improve the readability of API references and ability to evolve the type parameters in the future.

### Patch Changes

- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.
- c816e2d: Added `createFrontendModule` as a replacement for `createExtensionOverrides`, which is now deprecated.

  Deprecated the `BackstagePlugin` and `FrontendFeature` type in favor of `FrontendPlugin` and `FrontendFeature` from `@backstage/frontend-app-api` respectively.

- 52f9c5a: Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead.

  You can migrate some of your extensions that use `createExtensionOverrides` to using `createFrontendModule` instead and providing a `pluginId` there.

  ```ts
  // Before
  createExtensionOverrides({
    extensions: [
      createExtension({
        name: 'my-extension',
        namespace: 'my-namespace',
        kind: 'test',
        ...
      })
    ],
  });

  // After
  createFrontendModule({
    pluginId: 'my-namespace',
    extensions: [
      createExtension({
        name: 'my-extension',
        kind: 'test',
        ...
      })
    ],
  });
  ```

- f3a2b91: Moved several implementations of built-in APIs from being hardcoded in the app to instead be provided as API extensions. This moves all API-related inputs from the `app` extension to the respective API extensions. For example, extensions created with `ThemeBlueprint` are now attached to the `themes` input of `api:app-theme` rather than the `app` extension.
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- 948d431: Removing deprecated `namespace` parameter in favour of `pluginId` instead
- 043d7cd: Internal refactor
- 220f4f7: Remove unnecessary config object on IconBundleBlueprint
- 2a61422: The `factory` option is no longer required when overriding an extension.
- 98850de: Added support for defining `replaces` in `createExtensionInput` which will allow extensions to redirect missing `attachTo` points to an input of the created extension.

  ```ts
  export const AppThemeApi = ApiBlueprint.makeWithOverrides({
    name: 'app-theme',
    inputs: {
      themes: createExtensionInput([ThemeBlueprint.dataRefs.theme], {
        // attachTo: { id: 'app', input: 'themes'} will be redirected to this input instead
        replaces: [{ id: 'app', input: 'themes' }],
      }),
    },
    factory: () {
      ...
    }
  });
  ```

- 4a66456: A new `apis` parameter has been added to `factory` for extensions. This is a way to access utility APIs without being coupled to the React context.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/version-bridge@1.0.9
  - @backstage/types@1.1.1

## 0.8.0-next.2

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- 043d7cd: Internal refactor
- 2a61422: The `factory` option is no longer required when overriding an extension.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/version-bridge@1.0.9-next.0
  - @backstage/types@1.1.1

## 0.8.0-next.1

### Patch Changes

- c816e2d: Added `createFrontendModule` as a replacement for `createExtensionOverrides`, which is now deprecated.

  Deprecated the `BackstagePlugin` and `FrontendFeature` type in favor of `FrontendPlugin` and `FrontendFeature` from `@backstage/frontend-app-api` respectively.

- 52f9c5a: Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead.

  You can migrate some of your extensions that use `createExtensionOverrides` to using `createFrontendModule` instead and providing a `pluginId` there.

  ```ts
  // Before
  createExtensionOverrides({
    extensions: [
      createExtension({
        name: 'my-extension',
        namespace: 'my-namespace',
        kind: 'test',
        ...
      })
    ],
  });

  // After
  createFrontendModule({
    pluginId: 'my-namespace',
    extensions: [
      createExtension({
        name: 'my-extension',
        kind: 'test',
        ...
      })
    ],
  });
  ```

- 948d431: Removing deprecated `namespace` parameter in favour of `pluginId` instead
- Updated dependencies
  - @backstage/core-components@0.14.11-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.8.0-next.0

### Minor Changes

- 5446061: **BREAKING**: Removed support for "v1" extensions. This means that it is no longer possible to declare inputs and outputs as objects when using `createExtension`. In addition, all extension creators except for `createComponentExtension` have been removed, use the equivalent blueprint instead. See the [1.30 migration documentation](https://backstage.io/docs/frontend-system/architecture/migrations/#130) for more information on this change.
- fec8b57: **BREAKING**: Updated the type parameters for `ExtensionDefinition` and `ExtensionBlueprint` to only have a single object parameter. The base type parameter is exported as `ExtensionDefinitionParameters` and `ExtensionBlueprintParameters` respectively. This is shipped as an immediate breaking change as we expect usage of these types to be rare, and it does not affect the runtime behavior of the API.

  This is a breaking change as it changes the type parameters. Existing usage can generally be updated as follows:

  - `ExtensionDefinition<any>` -> `ExtensionDefinition`
  - `ExtensionDefinition<any, any>` -> `ExtensionDefinition`
  - `ExtensionDefinition<TConfig>` -> `ExtensionDefinition<{ config: TConfig }>`
  - `ExtensionDefinition<TConfig, TConfigInput>` -> `ExtensionDefinition<{ config: TConfig, configInput: TConfigInput }>`

  If you need to infer the parameter you can use `ExtensionDefinitionParameters`, for example:

  ```ts
  import {
    ExtensionDefinition,
    ExtensionDefinitionParameters,
  } from '@backstage/frontend-plugin-api';

  function myUtility<T extends ExtensionDefinitionParameters>(
    ext: ExtensionDefinition<T>,
  ): T['config'] {
    // ...
  }
  ```

  The same patterns apply to `ExtensionBlueprint`.

  This change is made to improve the readability of API references and ability to evolve the type parameters in the future.

### Patch Changes

- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.
- f3a2b91: Moved several implementations of built-in APIs from being hardcoded in the app to instead be provided as API extensions. This moves all API-related inputs from the `app` extension to the respective API extensions. For example, extensions created with `ThemeBlueprint` are now attached to the `themes` input of `api:app-theme` rather than the `app` extension.
- 98850de: Added support for defining `replaces` in `createExtensionInput` which will allow extensions to redirect missing `attachTo` points to an input of the created extension.

  ```ts
  export const AppThemeApi = ApiBlueprint.makeWithOverrides({
    name: 'app-theme',
    inputs: {
      themes: createExtensionInput([ThemeBlueprint.dataRefs.theme], {
        // attachTo: { id: 'app', input: 'themes'} will be redirected to this input instead
        replaces: [{ id: 'app', input: 'themes' }],
      }),
    },
    factory: () {
      ...
    }
  });
  ```

- 4a66456: A new `apis` parameter has been added to `factory` for extensions. This is a way to access utility APIs without being coupled to the React context.
- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.7.0

### Minor Changes

- 72754db: **BREAKING**: All types of route refs are always considered optional by `useRouteRef`, which means the caller must always handle a potential `undefined` return value. Related to this change, the `optional` option from `createExternalRouteRef` has been removed, since it is no longer necessary.

  This is released as an immediate breaking change as we expect the usage of the new route refs to be extremely low or zero, since plugins that support the new system will still use route refs and `useRouteRef` from `@backstage/core-plugin-api` in combination with `convertLegacyRouteRef` from `@backstage/core-compat-api`.

### Patch Changes

- 6f72c2b: Fixing issue with extension blueprints `inputs` merging.
- 210d066: Added support for using the `params` in other properties of the `createExtensionBlueprint` options by providing a callback.
- 9b356dc: Renamed `createPlugin` to `createFrontendPlugin`. The old symbol is still exported but deprecated.
- a376559: Correct the `TConfig` type of data references to only contain config
- 4e53ad6: Introduce a new way to encapsulate extension kinds that replaces the extension creator pattern with `createExtensionBlueprint`

  This allows the creation of extension instances with the following pattern:

  ```tsx
  // create the extension blueprint which is used to create instances
  const EntityCardBlueprint = createExtensionBlueprint({
    kind: 'entity-card',
    attachTo: { id: 'test', input: 'default' },
    output: [coreExtensionData.reactElement],
    factory(params: { text: string }) {
      return [coreExtensionData.reactElement(<h1>{params.text}</h1>)];
    },
  });

  // create an instance of the extension blueprint with params
  const testExtension = EntityCardBlueprint.make({
    name: 'foo',
    params: {
      text: 'Hello World',
    },
  });
  ```

- 9b89b82: The `ExtensionBoundary` now by default infers whether it's routable from whether it outputs a route path.
- e493020: Deprecated `inputs` and `configSchema` options for `createComponentExtenion`, these will be removed in a future release
- 7777b5f: Added a new `IconBundleBlueprint` that lets you create icon bundle extensions that can be installed in an App in order to override or add new app icons.

  ```tsx
  import { IconBundleBlueprint } from '@backstage/frontend-plugin-api';

  const exampleIconBundle = IconBundleBlueprint.make({
    name: 'example-bundle',
    params: {
      icons: {
        user: MyOwnUserIcon,
      },
    },
  });
  ```

- 99abb6b: Support overriding of plugin extensions using the new `plugin.withOverrides` method.

  ```tsx
  import homePlugin from '@backstage/plugin-home';

  export default homePlugin.withOverrides({
    extensions: [
      homePage.getExtension('page:home').override({
        *factory(originalFactory) {
          yield* originalFactory();
          yield coreExtensionData.reactElement(<h1>My custom home page</h1>);
        },
      }),
    ],
  });
  ```

- 813cac4: Add an `ExtensionBoundary.lazy` function to create properly wrapped lazy-loading enabled elements, suitable for use with `coreExtensionData.reactElement`. The page blueprint now automatically leverages this.
- a65cfc8: Add support for accessing extensions definitions provided by a plugin via `plugin.getExtension(...)`. For this to work the extensions must be defined using the v2 format, typically using an extension blueprint.
- 3be9aeb: Extensions have been changed to be declared with an array of inputs and outputs, rather than a map of named data refs. This change was made to reduce confusion around the role of the input and output names, as well as enable more powerful APIs for overriding extensions.

  An extension that was previously declared like this:

  ```tsx
  const exampleExtension = createExtension({
    name: 'example',
    inputs: {
      items: createExtensionInput({
        element: coreExtensionData.reactElement,
      }),
    },
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ inputs }) {
      return {
        element: (
          <div>
            Example
            {inputs.items.map(item => {
              return <div>{item.output.element}</div>;
            })}
          </div>
        ),
      };
    },
  });
  ```

  Should be migrated to the following:

  ```tsx
  const exampleExtension = createExtension({
    name: 'example',
    inputs: {
      items: createExtensionInput([coreExtensionData.reactElement]),
    },
    output: [coreExtensionData.reactElement],
    factory({ inputs }) {
      return [
        coreExtensionData.reactElement(
          <div>
            Example
            {inputs.items.map(item => {
              return <div>{item.get(coreExtensionData.reactElement)}</div>;
            })}
          </div>,
        ),
      ];
    },
  });
  ```

- 34f1b2a: Support merging of `inputs` in extension blueprints, but stop merging `output`. In addition, the original factory in extension blueprints now returns a data container that both provides access to the returned data, but can also be forwarded as output.
- 3fb421d: Added support to be able to define `zod` config schema in Blueprints, with built in schema merging from the Blueprint and the extension instances.
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

- 31bfc44: Extension data references can now be defined in a way that encapsulates the ID string in the type, in addition to the data type itself. The old way of creating extension data references is deprecated and will be removed in a future release.

  For example, the following code:

  ```ts
  export const myExtension =
    createExtensionDataRef<MyType>('my-plugin.my-data');
  ```

  Should be updated to the following:

  ```ts
  export const myExtension = createExtensionDataRef<MyType>().with({
    id: 'my-plugin.my-data',
  });
  ```

- 6349099: Added config input type to the extensions
- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.7.0-next.3

### Patch Changes

- 6f72c2b: Fixing issue with extension blueprints `inputs` merging.
- 99abb6b: Support overriding of plugin extensions using the new `plugin.withOverrides` method.

  ```tsx
  import homePlugin from '@backstage/plugin-home';

  export default homePlugin.withOverrides({
    extensions: [
      homePage.getExtension('page:home').override({
        *factory(originalFactory) {
          yield* originalFactory();
          yield coreExtensionData.reactElement(<h1>My custom home page</h1>);
        },
      }),
    ],
  });
  ```

- a65cfc8: Add support for accessing extensions definitions provided by a plugin via `plugin.getExtension(...)`. For this to work the extensions must be defined using the v2 format, typically using an extension blueprint.
- 34f1b2a: Support merging of `inputs` in extension blueprints, but stop merging `output`. In addition, the original factory in extension blueprints now returns a data container that both provides access to the returned data, but can also be forwarded as output.
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

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.7.0-next.2

### Minor Changes

- 72754db: **BREAKING**: All types of route refs are always considered optional by `useRouteRef`, which means the caller must always handle a potential `undefined` return value. Related to this change, the `optional` option from `createExternalRouteRef` has been removed, since it is no longer necessary.

  This is released as an immediate breaking change as we expect the usage of the new route refs to be extremely low or zero, since plugins that support the new system will still use route refs and `useRouteRef` from `@backstage/core-plugin-api` in combination with `convertLegacyRouteRef` from `@backstage/core-compat-api`.

### Patch Changes

- 210d066: Added support for using the `params` in other properties of the `createExtensionBlueprint` options by providing a callback.
- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.8-next.1

### Patch Changes

- 3be9aeb: Extensions have been changed to be declared with an array of inputs and outputs, rather than a map of named data refs. This change was made to reduce confusion around the role of the input and output names, as well as enable more powerful APIs for overriding extensions.

  An extension that was previously declared like this:

  ```tsx
  const exampleExtension = createExtension({
    name: 'example',
    inputs: {
      items: createExtensionInput({
        element: coreExtensionData.reactElement,
      }),
    },
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ inputs }) {
      return {
        element: (
          <div>
            Example
            {inputs.items.map(item => {
              return <div>{item.output.element}</div>;
            })}
          </div>
        ),
      };
    },
  });
  ```

  Should be migrated to the following:

  ```tsx
  const exampleExtension = createExtension({
    name: 'example',
    inputs: {
      items: createExtensionInput([coreExtensionData.reactElement]),
    },
    output: [coreExtensionData.reactElement],
    factory({ inputs }) {
      return [
        coreExtensionData.reactElement(
          <div>
            Example
            {inputs.items.map(item => {
              return <div>{item.get(coreExtensionData.reactElement)}</div>;
            })}
          </div>,
        ),
      ];
    },
  });
  ```

- 3fb421d: Added support to be able to define `zod` config schema in Blueprints, with built in schema merging from the Blueprint and the extension instances.
- 6349099: Added config input type to the extensions
- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.8-next.0

### Patch Changes

- 4e53ad6: Introduce a new way to encapsulate extension kinds that replaces the extension creator pattern with `createExtensionBlueprint`

  This allows the creation of extension instances with the following pattern:

  ```tsx
  // create the extension blueprint which is used to create instances
  const EntityCardBlueprint = createExtensionBlueprint({
    kind: 'entity-card',
    attachTo: { id: 'test', input: 'default' },
    output: {
      element: coreExtensionData.reactElement,
    },
    factory(params: { text: string }) {
      return {
        element: <h1>{params.text}</h1>,
      };
    },
  });

  // create an instance of the extension blueprint with params
  const testExtension = EntityCardBlueprint.make({
    name: 'foo',
    params: {
      text: 'Hello World',
    },
  });
  ```

- 9b89b82: The `ExtensionBoundary` now by default infers whether it's routable from whether it outputs a route path.
- 7777b5f: Added a new `IconBundleBlueprint` that lets you create icon bundle extensions that can be installed in an App in order to override or add new app icons.

  ```tsx
  import { IconBundleBlueprint } from '@backstage/frontend-plugin-api';

  const exampleIconBundle = IconBundleBlueprint.make({
    name: 'example-bundle',
    params: {
      icons: {
        user: MyOwnUserIcon,
      },
    },
  });
  ```

- 31bfc44: Extension data references can now be defined in a way that encapsulates the ID string in the type, in addition to the data type itself. The old way of creating extension data references is deprecated and will be removed in a future release.

  For example, the following code:

  ```ts
  export const myExtension =
    createExtensionDataRef<MyType>('my-plugin.my-data');
  ```

  Should be updated to the following:

  ```ts
  export const myExtension = createExtensionDataRef<MyType>().with({
    id: 'my-plugin.my-data',
  });
  ```

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.1

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.7

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.5-next.0
  - @backstage/core-plugin-api@1.9.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 0.6.4

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- 35452b3: Fixed the type for `useRouteRef`, which wasn't handling optional external route refs correctly.
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2
  - @backstage/version-bridge@1.0.8
  - @backstage/types@1.1.1

## 0.6.4-next.1

### Patch Changes

- 35452b3: Fixed the type for `useRouteRef`, which wasn't handling optional external route refs correctly.
- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.0

### Minor Changes

- e586f79: **BREAKING**: Replace default plugin extension and plugin ids to be `app` instead of `root`.

### Patch Changes

- 7eae3e0: Added initial `IconsApi` definition.
- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- bc621aa: Added `RouteResolutionsApi` as a replacement for the routing context.
- 1e61ad3: App component extensions are no longer wrapped in an `ExtensionBoundary`, allowing them to inherit the outer context instead.
- 46b63de: Allow external route refs in the new system to have a `defaultTarget` pointing to a route that it'll resolve to by default if no explicit bindings were made by the adopter.
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/core-plugin-api@1.9.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.0-next.2
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.0-next.2

### Patch Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.6.0-next.1

### Minor Changes

- e586f79: **BREAKING**: Replace default plugin extension and plugin ids to be `app` instead of `root`.

### Patch Changes

- bc621aa: Added `RouteResolutionsApi` as a replacement for the routing context.
- 1e61ad3: App component extensions are no longer wrapped in an `ExtensionBoundary`, allowing them to inherit the outer context instead.
- 46b63de: Allow external route refs in the new system to have a `defaultTarget` pointing to a route that it'll resolve to by default if no explicit bindings were made by the adopter.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.5.1-next.0

### Patch Changes

- 7eae3e0: Added initial `IconsApi` definition.
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.5.0

### Minor Changes

- d4149bf: **BREAKING**: Renamed the `app/router` extension to `app/root`.

### Patch Changes

- b2d370e: Exposed `createComponentRef`, and ensured that produced refs and feature bits have a `toString` for easier debugging
- 7d63b32: Accepts sub route refs on the new `createPlugin` routes map.
- 516fd3e: Updated README to reflect release status
- 4016f21: Remove some unused dependencies
- c97fa1c: Added `elements`, `wrappers`, and `router` inputs to `app/root`, that let you add things to the root of the React tree above the layout. You can use the `createAppRootElementExtension`, `createAppRootWrapperExtension`, and `createRouterExtension` extension creator, respectively, to conveniently create such extensions. These are all optional, and if you do not supply a router a default one will be used (`BrowserRouter` in regular runs, `MemoryRouter` in tests/CI).
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.1-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.1-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/core-plugin-api@1.8.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.0

### Minor Changes

- af7bc3e: Switched all core extensions to instead use the namespace `'app'`.
- 5cdf2b3: Changed `Extension` and `ExtensionDefinition` to use opaque types.
- 8f5d6c1: Extension inputs are now wrapped into an additional object when passed to the extension factory, with the previous values being available at the `output` property. The `ExtensionInputValues` type has also been replaced by `ResolvedExtensionInputs`.
- 8837a96: **BREAKING**: This version changes how extensions are created and how their IDs are determined. The `createExtension` function now accepts `kind`, `namespace` and `name` instead of `id`. All of the new options are optional, and are used to construct the final extension ID. By convention extension creators should set the `kind` to match their own name, for example `createNavItemExtension` sets the kind `nav-item`.

  The `createExtension` function as well as all extension creators now also return an `ExtensionDefinition` rather than an `Extension`, which in turn needs to be passed to `createPlugin` or `createExtensionOverrides` to be used.

- f9ef632: Moved several extension data references from `coreExtensionData` to their respective extension creators.
- a5a0473: The extension `factory` function now longer receives `id` or `source`, but instead now provides the extension's `AppNode` as `node`. The `ExtensionBoundary` component has also been updated to receive a `node` prop rather than `id` and `source`.

### Patch Changes

- a379243: Add the `FrontendFeature` type, which is the union of `BackstagePlugin` and `ExtensionOverrides`
- b7adf24: Update alpha component ref type to be more specific than any, delete boot page component and use new plugin type for error boundary component extensions.
- 5eb6b8a: Added the nav logo extension for customization of sidebar logo
- 1f12fb7: Create factories for overriding default core components extensions.
- 5970928: Add feature flags to plugins and extension overrides.
- e539735: Added `createSignInPageExtension`.
- 73246ec: Added translation APIs as well as `createTranslationExtension`.
- cb4197a: Forward ` node`` instead of  `extensionId` to resolved extension inputs.
- f27ee7d: Migrate analytics api and context files.
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- f1183b7: Renamed the `component` option of `createComponentExtension` to `loader`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/core-components@0.13.9
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/config@1.1.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.0-next.2

### Minor Changes

- 8f5d6c1: Extension inputs are now wrapped into an additional object when passed to the extension factory, with the previous values being available at the `output` property. The `ExtensionInputValues` type has also been replaced by `ResolvedExtensionInputs`.
- 8837a96: **BREAKING**: This version changes how extensions are created and how their IDs are determined. The `createExtension` function now accepts `kind`, `namespace` and `name` instead of `id`. All of the new options are optional, and are used to construct the final extension ID. By convention extension creators should set the `kind` to match their own name, for example `createNavItemExtension` sets the kind `nav-item`.

  The `createExtension` function as well as all extension creators now also return an `ExtensionDefinition` rather than an `Extension`, which in turn needs to be passed to `createPlugin` or `createExtensionOverrides` to be used.

### Patch Changes

- b7adf24: Update alpha component ref type to be more specific than any, delete boot page component and use new plugin type for error boundary component extensions.
- 73246ec: Added translation APIs as well as `createTranslationExtension`.
- cb4197a: Forward ` node`` instead of  `extensionId` to resolved extension inputs.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.4.0-next.1

### Minor Changes

- a5a04739e1: The extension `factory` function now longer receives `id` or `source`, but instead now provides the extension's `AppNode` as `node`. The `ExtensionBoundary` component has also been updated to receive a `node` prop rather than `id` and `source`.

### Patch Changes

- 5eb6b8a7bc: Added the nav logo extension for customization of sidebar logo
- 1f12fb762c: Create factories for overriding default core components extensions.
- 59709286b3: Add feature flags to plugins and extension overrides.
- e539735435: Added `createSignInPageExtension`.
- f27ee7d937: Migrate analytics api and context files.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 0.3.0

### Minor Changes

- 68fc9dc60e: Added `RouteRef`, `SubRouteRef`, `ExternalRouteRef`, and related types. All exports from this package that previously relied on the types with the same name from `@backstage/core-plugin-api` now use the new types instead. To convert and existing legacy route ref to be compatible with the APIs from this package, use the `convertLegacyRouteRef` utility from `@backstage/core-plugin-api/alpha`.
- 77f009b35d: Extensions now return their output from the factory function rather than calling `bind(...)`.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 733bd95746: Add new `AppTreeApi`.
- 6af88a05ff: Improve the extension boundary component and create a default extension suspense component.
- Updated dependencies
  - @backstage/core-components@0.13.8
  - @backstage/core-plugin-api@1.8.0
  - @backstage/version-bridge@1.0.7
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- [#20888](https://github.com/backstage/backstage/pull/20888) [`733bd95746`](https://github.com/backstage/backstage/commit/733bd95746b99ad8cdb4a7b87e8dc3e16d3b764a) Thanks [@Rugvip](https://github.com/Rugvip)! - Add new `AppTreeApi`.

- Updated dependencies
  - @backstage/core-components@0.13.8-next.2

## 0.3.0-next.1

### Minor Changes

- 77f009b35d: Extensions now return their output from the factory function rather than calling `bind(...)`.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.1
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7-next.0

## 0.3.0-next.0

### Minor Changes

- 68fc9dc60e: Added `RouteRef`, `SubRouteRef`, `ExternalRouteRef`, and related types. All exports from this package that previously relied on the types with the same name from `@backstage/core-plugin-api` now use the new types instead. To convert and existing legacy route ref to be compatible with the APIs from this package, use the `convertLegacyRouteRef` utility from `@backstage/core-plugin-api/alpha`.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 6af88a05ff: Improve the extension boundary component and create a default extension suspense component.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/version-bridge@1.0.7-next.0
  - @backstage/types@1.1.1

## 0.2.0

### Minor Changes

- 06432f900c: Extension attachment point is now configured via `attachTo: { id, input }` instead of `at: 'id/input'`.
- 4461d87d5a: Removed support for the new `useRouteRef`.

### Patch Changes

- d3a37f55c0: Add support for `SidebarGroup` on the sidebar item extension.
- 2ecd33618a: Plugins can now be assigned `routes` and `externalRoutes` when created.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- c1e9ca6500: Added `createExtensionOverrides` which can be used to install a collection of extensions in an app that will replace any existing ones.
- 52366db5b3: Added `createThemeExtension` and `coreExtensionData.theme`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/types@1.1.1

## 0.2.0-next.2

### Minor Changes

- 06432f900c: Extension attachment point is now configured via `attachTo: { id, input }` instead of `at: 'id/input'`.
- 4461d87d5a: Removed support for the new `useRouteRef`.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/types@1.1.1

## 0.1.1-next.1

### Patch Changes

- d3a37f55c0: Add support for `SidebarGroup` on the sidebar item extension.
- 52366db5b3: Added `createThemeExtension` and `coreExtensionData.theme`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/types@1.1.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/types@1.1.1

## 0.1.0

### Minor Changes

- 628ca7e458e4: Initial release

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 628ca7e458e4: Initial release

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/types@1.1.1-next.0

## 0.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/types@1.1.0
