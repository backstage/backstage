# @backstage/frontend-plugin-api

## 0.12.1

### Patch Changes

- 8ed53eb: Added `coreExtensionData.title`, especially useful for creating extensible layout with tabbed pages, but available for use for other cases too.
- Updated dependencies
  - @backstage/core-components@0.18.2
  - @backstage/core-plugin-api@1.11.1

## 0.12.1-next.2

### Patch Changes

- 8ed53eb: Added `coreExtensionData.title`, especially useful for creating extensible layout with tabbed pages, but available for use for other cases too.
- Updated dependencies
  - @backstage/core-components@0.18.2-next.3

## 0.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.1
  - @backstage/core-plugin-api@1.11.1-next.0

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.0
  - @backstage/core-plugin-api@1.11.0
  - @backstage/types@1.2.2
  - @backstage/version-bridge@1.0.11

## 0.12.0

### Minor Changes

- 894d514: Make `openshiftApiRef` available to the new frontend system.

### Patch Changes

- 2fb8b04: Improved the types of `createFrontendPlugin` and `createFrontendModule` so that errors due to incompatible options are indicated more clearly.
- Updated dependencies
  - @backstage/core-plugin-api@1.11.0
  - @backstage/core-components@0.18.0
  - @backstage/types@1.2.2

## 0.11.1-next.0

### Patch Changes

- 2fb8b04: Improved the types of `createFrontendPlugin` and `createFrontendModule` so that errors due to incompatible options are indicated more clearly.
- Updated dependencies
  - @backstage/core-components@0.17.6-next.0

## 0.11.0

### Minor Changes

- c5f88b5: **BREAKING**: Remove deprecated `source` property from the `AppNodeSpec` type, use `AppNodeSpec.plugin` instead.
- e4ddf22: **BREAKING**: The `defaultPath` param of `PageBlueprint` has been renamed to `path`. This change does not affect the compatibility of extensions created with older versions of this blueprint.
- fda1bbc: **BREAKING**: The component system has been overhauled to use `SwappableComponent` instead of `ComponentRef`. Several APIs have been removed and replaced:

  - Removed: `createComponentRef`, `createComponentExtension`, `ComponentRef`, `ComponentsApi`, `componentsApiRef`, `useComponentRef`, `coreComponentRefs`
  - Added: `createSwappableComponent`, `SwappableComponentBlueprint`, `SwappableComponentRef`, `SwappableComponentsApi`, `swappableComponentsApiRef`

  **BREAKING**: The default `componentRefs` and exported `Core*Props` have been removed and have replacement `SwappableComponents` and revised type names instead.

  - The `errorBoundaryFallback` component and `CoreErrorBoundaryFallbackProps` type have been replaced with `ErrorDisplay` swappable component and `CoreErrorDisplayProps` respectively.
  - The `progress` component and `CoreProgressProps` type have been replaced with `Progress` swappable component and `ProgressProps` respectively.
  - The `notFoundErrorPage` component and `CoreNotFoundErrorPageProps` type have been replaced with `NotFoundErrorPage` swappable component and `NotFoundErrorPageProps` respectively.

  **Migration for creating swappable components:**

  ```tsx
  // OLD: Using createComponentRef and createComponentExtension
  import {
    createComponentRef,
    createComponentExtension,
  } from '@backstage/frontend-plugin-api';

  const myComponentRef = createComponentRef<{ title: string }>({
    id: 'my-plugin.my-component',
  });

  const myComponentExtension = createComponentExtension({
    ref: myComponentRef,
    loader: {
      lazy: () => import('./MyComponent').then(m => m.MyComponent),
    },
  });

  // NEW: Using createSwappableComponent and SwappableComponentBlueprint
  import {
    createSwappableComponent,
    SwappableComponentBlueprint,
  } from '@backstage/frontend-plugin-api';

  const MySwappableComponent = createSwappableComponent({
    id: 'my-plugin.my-component',
    loader: () => import('./MyComponent').then(m => m.MyComponent),
  });

  const myComponentExtension = SwappableComponentBlueprint.make({
    name: 'my-component',
    params: {
      component: MySwappableComponent,
      loader: () => import('./MyComponent').then(m => m.MyComponent),
    },
  });
  ```

  **Migration for using components:**

  ```tsx
  // OLD: Using ComponentsApi and useComponentRef
  import {
    useComponentRef,
    componentsApiRef,
    useApi,
    coreComponentRefs,
  } from '@backstage/frontend-plugin-api';

  const MyComponent = useComponentRef(myComponentRef);
  const ProgressComponent = useComponentRef(coreComponentRefs.progress);


  // NEW: Direct component usage
  import { Progress } from '@backstage/frontend-plugin-api';

  // Use directly as React Component
  <Progress />
  <MySwappableComponent title="Hello World" />
  ```

  **Migration for core component references:**

  ```tsx
  // OLD: Core component refs
  import { coreComponentRefs } from '@backstage/frontend-plugin-api';

  coreComponentRefs.progress
  coreComponentRefs.notFoundErrorPage
  coreComponentRefs.errorBoundaryFallback

  // NEW: Direct swappable component imports
  import { Progress, NotFoundErrorPage, ErrorDisplay } from '@backstage/frontend-plugin-api';

  // Use directly as React components
  <Progress />
  <NotFoundErrorPage />
  <ErrorDisplay plugin={plugin} error={error} resetError={resetError} />
  ```

- 6a75e00: **BREAKING**: Removed the deprecated `createFrontendPlugin` variant where the plugin ID is passed via an `id` option. To update existing code, switch to using the `pluginId` option instead.
- 12b6db7: **BREAKING**: Added a new `OverridableFrontendPlugin` type that is used as the return value of `createFrontendPlugin`. This type includes the `withOverrides` and `.getExtension` methods that are helpful when creating plugin overrides, while the base `FrontendPlugin` type no longer includes these methods. This is a breaking change for the `AppTreeApi` and some other places where the `FrontendPlugin` type is still used, but also fixes some cases where the extra plugin methods were causing issues.
- 37f2989: **BREAKING**: Removed the `routable` property from `ExtensionBoundary`. This property was never needed in practice and is instead inferred from whether or not the extension outputs a route reference. It can be safely removed.
- 1e6410b: **BREAKING**: The `ResolveInputValueOverrides` type is no longer exported.
- 29786f6: **BREAKING**: The `NavLogoBlueprint` has been removed and replaced by `NavContentBlueprint`, which instead replaces the entire navbar. The default navbar has also been switched to a more minimal implementation.

  To use `NavContentBlueprint` to install new logos, you can use it as follows:

  ```tsx
  NavContentBlueprint.make({
    params: {
      component: ({ items }) => {
        return compatWrapper(
          <Sidebar>
            <SidebarLogo />

            {/* Other sidebar content */}

            <SidebarScrollWrapper>
              {items.map((item, index) => (
                <SidebarItem {...item} key={index} />
              ))}
            </SidebarScrollWrapper>

            {/* Other sidebar content */}
          </Sidebar>,
        );
      },
    },
  });
  ```

- 3243fa6: **BREAKING**: Removed the ability to define a default extension `name` in blueprints. This option had no practical purpose as blueprints already use the `kind` to identity the source of the extension.
- a082429: **BREAKING**: The separate `RouteResolutionApiResolveOptions` type has been removed.
- 5d31d66: **BREAKING**: In an attempt to align some of the API's around providing components to `Blueprints`, we've renamed the parameters for both the `RouterBlueprint` and `AppRootWrapperBlueprint` from `Component` to `component`.

  ```tsx
  // old
  RouterBlueprint.make({
    params: {
      Component: ({ children }) => <div>{children}</div>,
    },
  });

  // new
  RouterBlueprint.make({
    params: {
      component: ({ children }) => <div>{children}</div>,
    },
  });
  ```

  ```tsx
  // old
  AppRootWrapperBlueprint.make({
    params: {
      Component: ({ children }) => <div>{children}</div>,
    },
  });

  // new
  AppRootWrapperBlueprint.make({
    params: {
      component: ({ children }) => <div>{children}</div>,
    },
  });
  ```

  As part of this change, the type for `component` has also changed from `ComponentType<PropsWithChildren<{}>>` to `(props: { children: ReactNode }) => JSX.Element | null` which is not breaking, just a little more reflective of the actual expected component.

- 45ead4a: **BREAKING**: The `AnyRoutes` and `AnyExternalRoutes` types have been removed and their usage has been inlined instead.

  Existing usage can be replaced according to their previous definitions:

  ```ts
  type AnyRoutes = { [name in string]: RouteRef | SubRouteRef };
  type AnyExternalRoutes = { [name in string]: ExternalRouteRef };
  ```

- 805c298: **BREAKING**: The `ApiBlueprint` has been updated to use the new advanced type parameters through the new `defineParams` blueprint option. This is an immediate breaking change that requires all existing usages of `ApiBlueprint` to switch to the new callback format. Existing extensions created with the old format are still compatible with the latest version of the plugin API however, meaning that this does not break existing plugins.

  To update existing usages of `ApiBlueprint`, you remove the outer level of the `params` object and replace `createApiFactory(...)` with `defineParams => defineParams(...)`.

  For example, the following old usage:

  ```ts
  ApiBlueprint.make({
    name: 'error',
    params: {
      factory: createApiFactory({
        api: errorApiRef,
        deps: { alertApi: alertApiRef },
        factory: ({ alertApi }) => {
          return ...;
        },
      })
    },
  })
  ```

  is migrated to the following:

  ```ts
  ApiBlueprint.make({
    name: 'error',
    params: defineParams =>
      defineParams({
        api: errorApiRef,
        deps: { alertApi: alertApiRef },
        factory: ({ alertApi }) => {
          return ...;
        },
      }),
  })
  ```

- 805c298: Added support for advanced parameter types in extension blueprints. The primary purpose of this is to allow extension authors to use type inference in the definition of the blueprint parameters. This often removes the need for extra imports and improves discoverability of blueprint parameters.

  This feature is introduced through the new `defineParams` option of `createExtensionBlueprint`, along with accompanying `createExtensionBlueprintParams` function to help implement the new format.

  The following is an example of how to create an extension blueprint that uses the new option:

  ```ts
  const ExampleBlueprint = createExtensionBlueprint({
    kind: 'example',
    attachTo: { id: 'example', input: 'example' },
    output: [exampleComponentDataRef, exampleFetcherDataRef],
    defineParams<T>(params: {
      component(props: ExampleProps<T>): JSX.Element | null;
      fetcher(options: FetchOptions): Promise<FetchResult<T>>;
    }) {
      // The returned params must be wrapped with `createExtensionBlueprintParams`
      return createExtensionBlueprintParams(params);
    },
    *factory(params) {
      // These params are now inferred
      yield exampleComponentDataRef(params.component);
      yield exampleFetcherDataRef(params.fetcher);
    },
  });
  ```

  Usage of the above example looks as follows:

  ```ts
  const example = ExampleBlueprint.make({
    params: defineParams => defineParams({
      component: ...,
      fetcher: ...,
    }),
  });
  ```

  This `defineParams => defineParams(<params>)` is also known as the "callback syntax" and is required if a blueprint is created with the new `defineParams` option. The callback syntax can also optionally be used for other blueprints too, which means that it is not a breaking change to remove the `defineParams` option, as long as the external parameter types remain compatible.

- 121899a: **BREAKING**: The `element` param for `AppRootElementBlueprint` no longer accepts a component. If you are currently passing a component such as `element: () => <MyComponent />` or `element: MyComponent`, simply switch to `element: <MyComponent />`.
- a321f3b: **BREAKING**: The `CommonAnalyticsContext` has been removed, and inlined into `AnalyticsContextValue` instead.

### Patch Changes

- d9e00e3: Add support for a new `aliasFor` option for `createRouteRef`. This allows for the creation of a new route ref that acts as an alias for an existing route ref that is installed in the app. This is particularly useful when creating modules that override existing plugin pages, without referring to the existing plugin. For example:

  ```tsx
  export default createFrontendModule({
    pluginId: 'catalog',
    extensions: [
      PageBlueprint.make({
        params: {
          defaultPath: '/catalog',
          routeRef: createRouteRef({ aliasFor: 'catalog.catalogIndex' }),
          loader: () =>
            import('./CustomCatalogIndexPage').then(m => (
              <m.CustomCatalogIndexPage />
            )),
        },
      }),
    ],
  });
  ```

- 93b5e38: Plugins should now use the new `AnalyticsImplementationBlueprint` to define and provide concrete analytics implementations. For example:

  ```ts
  import { AnalyticsImplementationBlueprint } from '@backstage/frontend-plugin-api';

  const AcmeAnalytics = AnalyticsImplementationBlueprint.make({
    name: 'acme-analytics',
    params: define =>
      define({
        deps: { config: configApiRef },
        factory: ({ config }) => AcmeAnalyticsImpl.fromConfig(config),
      }),
  });
  ```

- 948de17: Tweaked the return types from `createExtension` and `createExtensionBlueprint` to avoid the forwarding of `ConfigurableExtensionDataRef` into exported types.
- 147482b: Updated the recommended naming of the blueprint param callback from `define` to `defineParams`, making the syntax `defineParams => defineParams(...)`.
- 3c3c882: Added added defaults for all type parameters of `ExtensionDataRef` and deprecated `AnyExtensionDataRef`, as it is now redundant.
- 9831f4e: Adjusted the dialog API types to have more sensible defaults
- 1c2cc37: Improved runtime error message clarity when extension factories don't return an iterable object.
- 24558f0: Added inline documentation for `createExtension`, `createExtensionBlueprint`, `createFrontendPlugin`, and `createFrontendModule`.
- Updated dependencies
  - @backstage/core-components@0.17.5

## 0.11.0-next.2

### Minor Changes

- fda1bbc: **BREAKING**: The component system has been overhauled to use `SwappableComponent` instead of `ComponentRef`. Several APIs have been removed and replaced:

  - Removed: `createComponentRef`, `createComponentExtension`, `ComponentRef`, `ComponentsApi`, `componentsApiRef`, `useComponentRef`, `coreComponentRefs`
  - Added: `createSwappableComponent`, `SwappableComponentBlueprint`, `SwappableComponentRef`, `SwappableComponentsApi`, `swappableComponentsApiRef`

  **BREAKING**: The default `componentRefs` and exported `Core*Props` have been removed and have replacement `SwappableComponents` and revised type names instead.

  - The `errorBoundaryFallback` component and `CoreErrorBoundaryFallbackProps` type have been replaced with `ErrorDisplay` swappable component and `CoreErrorDisplayProps` respectively.
  - The `progress` component and `CoreProgressProps` type have been replaced with `Progress` swappable component and `ProgressProps` respectively.
  - The `notFoundErrorPage` component and `CoreNotFoundErrorPageProps` type have been replaced with `NotFoundErrorPage` swappable component and `NotFoundErrorPageProps` respectively.

  **Migration for creating swappable components:**

  ```tsx
  // OLD: Using createComponentRef and createComponentExtension
  import {
    createComponentRef,
    createComponentExtension,
  } from '@backstage/frontend-plugin-api';

  const myComponentRef = createComponentRef<{ title: string }>({
    id: 'my-plugin.my-component',
  });

  const myComponentExtension = createComponentExtension({
    ref: myComponentRef,
    loader: {
      lazy: () => import('./MyComponent').then(m => m.MyComponent),
    },
  });

  // NEW: Using createSwappableComponent and SwappableComponentBlueprint
  import {
    createSwappableComponent,
    SwappableComponentBlueprint,
  } from '@backstage/frontend-plugin-api';

  const MySwappableComponent = createSwappableComponent({
    id: 'my-plugin.my-component',
    loader: () => import('./MyComponent').then(m => m.MyComponent),
  });

  const myComponentExtension = SwappableComponentBlueprint.make({
    name: 'my-component',
    params: {
      component: MySwappableComponent,
      loader: () => import('./MyComponent').then(m => m.MyComponent),
    },
  });
  ```

  **Migration for using components:**

  ```tsx
  // OLD: Using ComponentsApi and useComponentRef
  import {
    useComponentRef,
    componentsApiRef,
    useApi,
    coreComponentRefs,
  } from '@backstage/frontend-plugin-api';

  const MyComponent = useComponentRef(myComponentRef);
  const ProgressComponent = useComponentRef(coreComponentRefs.progress);


  // NEW: Direct component usage
  import { Progress } from '@backstage/frontend-plugin-api';

  // Use directly as React Component
  <Progress />
  <MySwappableComponent title="Hello World" />
  ```

  **Migration for core component references:**

  ```tsx
  // OLD: Core component refs
  import { coreComponentRefs } from '@backstage/frontend-plugin-api';

  coreComponentRefs.progress
  coreComponentRefs.notFoundErrorPage
  coreComponentRefs.errorBoundaryFallback

  // NEW: Direct swappable component imports
  import { Progress, NotFoundErrorPage, ErrorDisplay } from '@backstage/frontend-plugin-api';

  // Use directly as React components
  <Progress />
  <NotFoundErrorPage />
  <ErrorDisplay plugin={plugin} error={error} resetError={resetError} />
  ```

- 6a75e00: **BREAKING**: Removed the deprecated `createFrontendPlugin` variant where the plugin ID is passed via an `id` option. To update existing code, switch to using the `pluginId` option instead.
- 1e6410b: **BREAKING**: The `ResolveInputValueOverrides` type is no longer exported.

### Patch Changes

- 9831f4e: Adjusted the dialog API types to have more sensible defaults
- 1c2cc37: Improved runtime error message clarity when extension factories don't return an iterable object.
- 24558f0: Added inline documentation for `createExtension`, `createExtensionBlueprint`, `createFrontendPlugin`, and `createFrontendModule`.
- Updated dependencies
  - @backstage/core-components@0.17.5-next.2

## 0.11.0-next.1

### Minor Changes

- c5f88b5: **BREAKING**: Remove deprecated `source` property from the `AppNodeSpec` type, use `AppNodeSpec.plugin` instead.
- e4ddf22: **BREAKING**: The `defaultPath` param of `PageBlueprint` has been renamed to `path`. This change does not affect the compatibility of extensions created with older versions of this blueprint.
- 37f2989: **BREAKING**: Removed the `routable` property from `ExtensionBoundary`. This property was never needed in practice and is instead inferred from whether or not the extension outputs a route reference. It can be safely removed.
- 3243fa6: **BREAKING**: Removed the ability to define a default extension `name` in blueprints. This option had no practical purpose as blueprints already use the `kind` to identity the source of the extension.
- a082429: **BREAKING**: The separate `RouteResolutionApiResolveOptions` type has been removed.
- 5d31d66: **BREAKING**: In an attempt to align some of the API's around providing components to `Blueprints`, we've renamed the parameters for both the `RouterBlueprint` and `AppRootWrapperBlueprint` from `Component` to `component`.

  ```tsx
  // old
  RouterBlueprint.make({
    params: {
      Component: ({ children }) => <div>{children}</div>,
    },
  });

  // new
  RouterBlueprint.make({
    params: {
      component: ({ children }) => <div>{children}</div>,
    },
  });
  ```

  ```tsx
  // old
  AppRootWrapperBlueprint.make({
    params: {
      Component: ({ children }) => <div>{children}</div>,
    },
  });

  // new
  AppRootWrapperBlueprint.make({
    params: {
      component: ({ children }) => <div>{children}</div>,
    },
  });
  ```

  As part of this change, the type for `component` has also changed from `ComponentType<PropsWithChildren<{}>>` to `(props: { children: ReactNode }) => JSX.Element | null` which is not breaking, just a little more reflective of the actual expected component.

- 45ead4a: **BREAKING**: The `AnyRoutes` and `AnyExternalRoutes` types have been removed and their usage has been inlined instead.

  Existing usage can be replaced according to their previous definitions:

  ```ts
  type AnyRoutes = { [name in string]: RouteRef | SubRouteRef };
  type AnyExternalRoutes = { [name in string]: ExternalRouteRef };
  ```

- 121899a: **BREAKING**: The `element` param for `AppRootElementBlueprint` no longer accepts a component. If you are currently passing a component such as `element: () => <MyComponent />` or `element: MyComponent`, simply switch to `element: <MyComponent />`.
- a321f3b: **BREAKING**: The `CommonAnalyticsContext` has been removed, and inlined into `AnalyticsContextValue` instead.

### Patch Changes

- d9e00e3: Add support for a new `aliasFor` option for `createRouteRef`. This allows for the creation of a new route ref that acts as an alias for an existing route ref that is installed in the app. This is particularly useful when creating modules that override existing plugin pages, without referring to the existing plugin. For example:

  ```tsx
  export default createFrontendModule({
    pluginId: 'catalog',
    extensions: [
      PageBlueprint.make({
        params: {
          defaultPath: '/catalog',
          routeRef: createRouteRef({ aliasFor: 'catalog.catalogIndex' }),
          loader: () =>
            import('./CustomCatalogIndexPage').then(m => (
              <m.CustomCatalogIndexPage />
            )),
        },
      }),
    ],
  });
  ```

- 93b5e38: Plugins should now use the new `AnalyticsImplementationBlueprint` to define and provide concrete analytics implementations. For example:

  ```ts
  import { AnalyticsImplementationBlueprint } from '@backstage/frontend-plugin-api';

  const AcmeAnalytics = AnalyticsImplementationBlueprint.make({
    name: 'acme-analytics',
    params: define =>
      define({
        deps: { config: configApiRef },
        factory: ({ config }) => AcmeAnalyticsImpl.fromConfig(config),
      }),
  });
  ```

- 948de17: Tweaked the return types from `createExtension` and `createExtensionBlueprint` to avoid the forwarding of `ConfigurableExtensionDataRef` into exported types.
- 147482b: Updated the recommended naming of the blueprint param callback from `define` to `defineParams`, making the syntax `defineParams => defineParams(...)`.
- 3c3c882: Added added defaults for all type parameters of `ExtensionDataRef` and deprecated `AnyExtensionDataRef`, as it is now redundant.
- Updated dependencies
  - @backstage/core-components@0.17.5-next.1
  - @backstage/core-plugin-api@1.10.9
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.11.0-next.0

### Minor Changes

- 29786f6: **BREAKING**: The `NavLogoBlueprint` has been removed and replaced by `NavContentBlueprint`, which instead replaces the entire navbar. The default navbar has also been switched to a more minimal implementation.

  To use `NavContentBlueprint` to install new logos, you can use it as follows:

  ```tsx
  NavContentBlueprint.make({
    params: {
      component: ({ items }) => {
        return compatWrapper(
          <Sidebar>
            <SidebarLogo />

            {/* Other sidebar content */}

            <SidebarScrollWrapper>
              {items.map((item, index) => (
                <SidebarItem {...item} key={index} />
              ))}
            </SidebarScrollWrapper>

            {/* Other sidebar content */}
          </Sidebar>,
        );
      },
    },
  });
  ```

- 805c298: **BREAKING**: The `ApiBlueprint` has been updated to use the new advanced type parameters through the new `defineParams` blueprint option. This is an immediate breaking change that requires all existing usages of `ApiBlueprint` to switch to the new callback format. Existing extensions created with the old format are still compatible with the latest version of the plugin API however, meaning that this does not break existing plugins.

  To update existing usages of `ApiBlueprint`, you remove the outer level of the `params` object and replace `createApiFactory(...)` with `define => define(...)`.

  For example, the following old usage:

  ```ts
  ApiBlueprint.make({
    name: 'error',
    params: {
      factory: createApiFactory({
        api: errorApiRef,
        deps: { alertApi: alertApiRef },
        factory: ({ alertApi }) => {
          return ...;
        },
      })
    },
  })
  ```

  is migrated to the following:

  ```ts
  ApiBlueprint.make({
    name: 'error',
    params: define =>
      define({
        api: errorApiRef,
        deps: { alertApi: alertApiRef },
        factory: ({ alertApi }) => {
          return ...;
        },
      }),
  })
  ```

- 805c298: Added support for advanced parameter types in extension blueprints. The primary purpose of this is to allow extension authors to use type inference in the definition of the blueprint parameters. This often removes the need for extra imports and improves discoverability of blueprint parameters.

  This feature is introduced through the new `defineParams` option of `createExtensionBlueprint`, along with accompanying `createExtensionBlueprintParams` function to help implement the new format.

  The following is an example of how to create an extension blueprint that uses the new option:

  ```ts
  const ExampleBlueprint = createExtensionBlueprint({
    kind: 'example',
    attachTo: { id: 'example', input: 'example' },
    output: [exampleComponentDataRef, exampleFetcherDataRef],
    defineParams<T>(params: {
      component(props: ExampleProps<T>): JSX.Element | null;
      fetcher(options: FetchOptions): Promise<FetchResult<T>>;
    }) {
      // The returned params must be wrapped with `createExtensionBlueprintParams`
      return createExtensionBlueprintParams(params);
    },
    *factory(params) {
      // These params are now inferred
      yield exampleComponentDataRef(params.component);
      yield exampleFetcherDataRef(params.fetcher);
    },
  });
  ```

  Usage of the above example looks as follows:

  ```ts
  const example = ExampleBlueprint.make({
    params: define => define({
      component: ...,
      fetcher: ...,
    }),
  });
  ```

  This `define => define(<params>)` is also known as the "callback syntax" and is required if a blueprint is created with the new `defineParams` option. The callback syntax can also optionally be used for other blueprints too, which means that it is not a breaking change to remove the `defineParams` option, as long as the external parameter types remain compatible.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5-next.0
  - @backstage/core-plugin-api@1.10.9
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4
  - @backstage/core-plugin-api@1.10.9

## 0.10.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.1
  - @backstage/core-plugin-api@1.10.9-next.0

## 0.10.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.0
  - @backstage/core-plugin-api@1.10.8
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.3

### Patch Changes

- 0169b23: Internal tweak to avoid circular dependencies
- 9e3868f: Added a new optional `info` option to `createFrontendPlugin` that lets you provide a loaders for different sources of metadata information about the plugin.

  There are two available loaders. The first one is `info.packageJson`, which can be used to point to a `package.json` file for the plugin. This is recommended for any plugin that is defined within its own package, especially all plugins that are published to a package registry. Typical usage looks like this:

  ```ts
  export default createFrontendPlugin({
    pluginId: '...',
    info: {
      packageJson: () => import('../package.json'),
    },
  });
  ```

  The second loader is `info.manifest`, which can be used to point to an opaque plugin manifest. This **MUST ONLY** be used by plugins that are intended for use within a single organization. Plugins that are published to an open package registry should **NOT** use this loader. The loader is useful for adding additional internal metadata associated with the plugin, and it is up to the Backstage app to decide how these manifests are parsed and used. The default manifest parser in an app created with `createApp` from `@backstage/frontend-defaults` is able to parse the default `catalog-info.yaml` format and built-in fields such as `spec.owner`.

  Typical usage looks like this:

  ```ts
  export default createFrontendPlugin({
    pluginId: '...',
    info: {
      manifest: () => import('../catalog-info.yaml'),
    },
  });
  ```

- 6f48f71: Added a new `useAppNode` hook, which can be used to get a reference to the `AppNode` from by the closest `ExtensionBoundary`.
- Updated dependencies
  - @backstage/core-components@0.17.3
  - @backstage/core-plugin-api@1.10.8
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.3-next.0
  - @backstage/core-plugin-api@1.10.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.3-next.0

### Patch Changes

- 9e3868f: Added a new optional `info` option to `createFrontendPlugin` that lets you provide a loaders for different sources of metadata information about the plugin.

  There are two available loaders. The first one is `info.packageJson`, which can be used to point to a `package.json` file for the plugin. This is recommended for any plugin that is defined within its own package, especially all plugins that are published to a package registry. Typical usage looks like this:

  ```ts
  export default createFrontendPlugin({
    pluginId: '...',
    info: {
      packageJson: () => import('../package.json'),
    },
  });
  ```

  The second loader is `info.manifest`, which can be used to point to an opaque plugin manifest. This **MUST ONLY** be used by plugins that are intended for use within a single organization. Plugins that are published to an open package registry should **NOT** use this loader. The loader is useful for adding additional internal metadata associated with the plugin, and it is up to the Backstage app to decide how these manifests are parsed and used. The default manifest parser in an app created with `createApp` from `@backstage/frontend-defaults` is able to parse the default `catalog-info.yaml` format and built-in fields such as `spec.owner`.

  Typical usage looks like this:

  ```ts
  export default createFrontendPlugin({
    pluginId: '...',
    info: {
      manifest: () => import('../catalog-info.yaml'),
    },
  });
  ```

- 6f48f71: Added a new `useAppNode` hook, which can be used to get a reference to the `AppNode` from by the closest `ExtensionBoundary`.

## 0.10.2

### Patch Changes

- 173db8f: The `source` property of `AppNodeSpec` has been renamed to `plugin`. The old property has been deprecated and will be removed in a future release.
- fb58f20: The `id` option of `createFrontendPlugin` has been renamed to `pluginId` in order to better align with similar APIs in the frontend and backend systems.

  The old `id` option is deprecated and will be removed in a future release.

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2
  - @backstage/core-plugin-api@1.10.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/core-components@0.17.2-next.1
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.2-next.0

### Patch Changes

- fb58f20: The `id` option of `createFrontendPlugin` has been renamed to `pluginId` in order to better align with similar APIs in the frontend and backend systems.

  The old `id` option is deprecated and will be removed in a future release.

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.1-next.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/core-components@0.17.1-next.1
  - @backstage/core-plugin-api@1.10.6-next.0
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 0.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.1-next.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

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
