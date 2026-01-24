# Release v1.42.0

Upgrade Helper: [https://backstage.github.io/upgrade-helper/?to=1.42.0](https://backstage.github.io/upgrade-helper/?to=1.42.0)

## @backstage/backend-defaults@0.12.0

### Minor Changes

- 133519b: feat: new cache manager `Infinispan Data Grid`

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- ed74af5: Fixed bug in PackageDiscoveryService where packages with "exports" field caused ERR_PACKAGE_PATH_NOT_EXPORTED error during backend startup.
- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/cli-node@0.2.14
  - @backstage/backend-app-api@1.2.6
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/backend-openapi-utils@0.6.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI

### Patch Changes

- 3760352: Update `express-openapi-validator` to 5.5.8 to fix security vulnerability in transitive dependency `multer`
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/backend-test-utils@1.8.0

### Minor Changes

- dffaf70: Switched out `mockServices.scheduler` to use a mocked implementation instead of the default scheduler implementation. This implementation runs any scheduled tasks immediately on startup, as long as they don't have an initial delay or a manual trigger. After the initial run, the tasks are never run again unless manually triggered.

### Patch Changes

- 279e1f7: Updated the type definition of `mockErrorHandler` to ensure that it is used correctly.

  ```ts
  // This is wrong and will now result in a type error
  app.use(mockErrorHandler);

  // This is the correct usage
  app.use(mockErrorHandler());
  ```

- 3a7dad9: Updated `better-sqlite3` to v12

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/backend-app-api@1.2.6
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/catalog-client@1.11.0

### Minor Changes

- 6b608e7: Added the analyze-location endpoint to the CatalogClient

## @backstage/cli@0.34.0

### Minor Changes

- 38b4243: Added plugin and module templates for the new frontend system. These templates are not included by default, but can be included by adding `@backstage/cli/templates/new-frontend-plugin` and `@backstage/cli/templates/new-frontend-plugin-module` as [custom templates](https://backstage.io/docs/tooling/cli/templates#installing-custom-templates).

- 923ceb2: **BREAKING**: The new app build based on [Rspack](https://rspack.dev/) is now the default, and the `EXPERIMENTAL_RSPACK` flag has been removed. To revert to the old behavior, set the `LEGACY_WEBPACK_BUILD` environment flag and install the following optional dependencies:

  ```json
  {
    "dependencies": {
      "@module-federation/enhanced": "^0.9.0",
      "@pmmmwh/react-refresh-webpack-plugin": "^0.5.7",
      "esbuild-loader": "^4.0.0",
      "eslint-webpack-plugin": "^4.2.0",
      "fork-ts-checker-webpack-plugin": "^9.0.0",
      "mini-css-extract-plugin": "^2.4.2",
      "terser-webpack-plugin": "^5.1.3",
      "webpack": "^5.96.0",
      "webpack-dev-server": "^5.0.0"
    }
  }
  ```

  If you do encounter a blocking issue that forces you to use the old WebPack build, please [open an issue](https://github.com/backstage/backstage/issues) explaining the problem. The WebPack build will be removed in a future release.

- eda80c7: **BREAKING**: Removed support for `.icon.svg` imports, which have been deprecated since the 1.19 release.

### Patch Changes

- 2b8082a: Internal refactor of error handling
- 8b1bf6e: Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.
- ead626f: The Node.js transform in `@backstage/cli/config/nodeTransformHooks.mjs` now supports the built-in type stripping in Node.js, which is enabled by default from v22.18.0.
- a6af768: Allow js files to be processed by the nodeTransform loader
- Updated dependencies
  - @backstage/cli-node@0.2.14

## @backstage/core-compat-api@0.5.0

### Minor Changes

- 62c3628: Rename `createLegacyApp` to `createLegacyAppRoot` as it better refers to the purpose of the function.
- e4ddf22: **BREAKING**: The `defaultPath` override of `convertLegacyPageExtension` has been renamed to `path`, in order to align with the same update that was made to the `PageBlueprint`.

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- fda1bbc: The `compatWrapper` has been switched to use the new `SwappableComponentsApi` instead of the old `ComponentsApi` in its bridging to the old frontend system.
- 5d31d66: Updated the usage of the `RouterBlueprint` and `AppRootWrapperBlueprint` to use the lowercase `component` parameter
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-catalog-react@1.20.0

## @backstage/frontend-app-api@0.12.0

### Minor Changes

- 8e21c4d: Use an app plugin for built-in extension app node specs.
- df7bd3b: **BREAKING**: Removed the deprecated `FrontendFeature` type, import it from `@backstage/frontend-plugin-api` instead.
- 8e21c4d: The `AppNodeSpec.plugin` property is now required.
- 5e12252: **BREAKING**: Restructured some of option fields of `createApp` and `createSpecializedApp`.

  - For `createApp`, all option fields _except_ `features` and `bindRoutes` have been moved into a new `advanced` object field.
  - For `createSpecializedApp`, all option fields _except_ `features`, `config`, and `bindRoutes` have been moved into a new `advanced` object field.

  This helps highlight that some options are meant to rarely be needed or used, and simplifies the usage of those options that are almost always required.

  As an example, if you used to supply a custom config loader, you would update your code as follows:

  ```diff
   createApp({
     features: [...],
  -  configLoader: new MyCustomLoader(),
  +  advanced: {
  +    configLoader: new MyCustomLoader(),
  +  },
   })
  ```

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

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.

- ef54427: Internal cleanup of routing system data.

- 391f0ca: External route references are no longer required to be exported via a plugin instance to function. The default target will still be resolved even if the external route reference is not included in `externalRoutes` of a plugin, but users of the plugin will not be able to configure the target of the route. This is particularly useful when building modules or overrides for existing plugins, allowing you add external routes both within and out from the plugin.

- f3f9d57: Renaming the `getNodesByRoutePath` parameter from `sourcePath` to `routePath`

- 8b1bf6e: Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.

- fda1bbc: Added a default implementation of the `SwappableComponentsApi` and removing the legacy `ComponentsApi` implementation

- 1c2cc37: Improved runtime error message clarity when extension factories don't return an iterable object.

- 3d2499f: Moved `createSpecializedApp` options to a new `CreateSpecializedAppOptions` type.

- Updated dependencies
  - @backstage/frontend-defaults@0.3.0
  - @backstage/frontend-plugin-api@0.11.0

## @backstage/frontend-defaults@0.3.0

### Minor Changes

- 76832a9: **BREAKING**: Removed the deprecated `CreateAppFeatureLoader` and support for it in other APIs. Switch existing usage to use the newer `createFrontendFeatureLoader` from `@backstage/frontend-plugin-api` instead.
- 5e12252: **BREAKING**: Restructured some of option fields of `createApp` and `createSpecializedApp`.

  - For `createApp`, all option fields _except_ `features` and `bindRoutes` have been moved into a new `advanced` object field.
  - For `createSpecializedApp`, all option fields _except_ `features`, `config`, and `bindRoutes` have been moved into a new `advanced` object field.

  This helps highlight that some options are meant to rarely be needed or used, and simplifies the usage of those options that are almost always required.

  As an example, if you used to supply a custom config loader, you would update your code as follows:

  ```diff
   createApp({
     features: [...],
  -  configLoader: new MyCustomLoader(),
  +  advanced: {
  +    configLoader: new MyCustomLoader(),
  +  },
   })
  ```

### Patch Changes

- 22de964: Deprecated `createPublicSignInApp`, which has been replaced by the new `appModulePublicSignIn` from `@backstage/plugin-app/alpha` instead.
- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- 8b1bf6e: Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.
- 7adc846: Added support for passing through `allowUnknownExtensionConfig` as a flag
- e5a0a99: **BREAKING**: The `loadingComponent` option has been renamed to `loadingElement`, which is now found under `advanced.loadingElement`. The default loading element has also been switched to `<Progress />` from `@backstage/core-components`. This is of course an improvement over the previous `"Loading..."` text, but also helps prevent flicker when the app loading is fast.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/frontend-app-api@0.12.0
  - @backstage/plugin-app@0.2.0

## @backstage/frontend-plugin-api@0.11.0

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
  ```

// NEW: Direct component usage
import { Progress } from '@backstage/frontend-plugin-api';

// Use directly as React Component
<Progress />
<MySwappableComponent title="Hello World" />

````

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
````

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

## @backstage/ui@0.7.0

### Minor Changes

- 0615e54: We are moving our DataTable component to React Aria. We removed our DataTable to only use Table as a single and opinionated option for tables. This new structure is made possible by using React Aria under the hood.
- b245c9d: Backstage UI - HeaderPage - We are updating the breadcrumb to be more visible and accessible.
- 800f593: **Breaking change** We are updating the Menu component to use React Aria under the hood. The structure and all props are changing to follow React Aria's guidance.
- b0e47f3: **Breaking** We are upgrading our `Text` component to support all font sizes making the `Heading` component redundant. The new `Text` component introduces 4 sizes for title and 4 sizes for body text. All of these work in multiple colors and font weights. We improved the `as` prop to include all possible values. The `Link` component has also been updated to match the new `Text` component.

### Patch Changes

- de89a3d: Fixes some styles on the Select component in BUI.
- a251b3e: Export CardHeader, CardBody and CardFooter from Card component index
- f761306: Add new TagGroup component to Backstage UI.
- 75fead9: Fixes a couple of small bugs in BUI including setting H1 and H2 correctly on the Header and HeaderPage.
- e7ff178: Update styling of Tooltip element
- 230b410: **Breaking change** Move breadcrumb to fit in the `HeaderPage` instead of the `Header` in Backstage UI.
- 2f9a084: We are motion away from `motion` to use `gsap` instead to make Backstage UI backward compatible with React 17.
- d4e603e: Updated Menu component in Backstage UI to use useId() from React Aria instead of React to support React 17.
- 8bdc491: Remove stylesheet import from Select component.
- 404b426: Add `startCollapsed` prop on the `SearchField` component in BUI.
- e0e886f: Adds onTabSelectionChange to ui header component.

## @backstage/plugin-app@0.2.0

### Minor Changes

- fda1bbc: **BREAKING**: The `componentsApi` implementation has been removed from the plugin and replaced with the new `SwappableComponentsApi` instead.

  If you were overriding the `componentsApi` implementation, you can now use the new `SwappableComponentsApi` instead.

  ```ts
  // old
  appPlugin.getExtension('api:app/components').override(...)

  // new
  appPlugin.getExtension('api:app/swappable-components').override(...)
  ```

- 29786f6: Updated the `app/nav` extension to use the new `NavContentBlueprint`, and removed support for extensions created with the now removed `NavLogoBlueprint`.

- 121899a: **BREAKING**: The `app-root-element` extension now only accepts `JSX.Element` in its `element` param, meaning overrides need to be updated.

### Patch Changes

- 91cbdf4: Log a warning when `SwappableComponent` extensions are installed outside of using the `app` plugin

- fda1bbc: Default implementations of core components are now provided by this package.

  A backwards compatible `componentsApi` implementation is also provided from this package which uses the `SwappableComponentsApi` as the implementation. This backwards compatible wrapper will be removed in the future.

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.

- a08f95f: Added a new module for implementing public sign-in apps, exported as `appModulePublicSignIn` via the `/alpha` sub-path export. This replaces the `createPublicSignInApp` export from `@backstage/frontend-defaults`, which is now deprecated.

- 5d31d66: Updated the usage of the `RouterBlueprint` and `AppRootWrapperBlueprint` to use the lowercase `component` parameter

- 93b5e38: The default implementation of the Analytics API now collects and instantiates analytics implementations exposed via `AnalyticsImplementationBlueprint` extensions. If no such extensions are discovered, the API continues to do nothing with analytics events fired within Backstage. If multiple such extensions are discovered, every discovered implementation automatically receives analytics events.

- 9831f4e: Adjusted the dialog API types to have more sensible defaults

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/theme@0.6.8

## @backstage/plugin-catalog-node@1.18.0

### Minor Changes

- 3f4da39: Added the analyze-location endpoint to the CatalogService

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-react@1.20.0

### Minor Changes

- 3f4da39: Added the `analyzeLocation` method to `catalogApiMock`
- e4ddf22: **BREAKING ALPHA**: The `defaultPath`, `defaultTitle`, and `defaultGroup` params of `PageBlueprint` has been renamed to `path`, `title`, and `group`. The `convertLegacyEntityContentExtension` utility has also received the same change. This change does not affect the compatibility of extensions created with older versions of this blueprint.

### Patch Changes

- 77eebdc: Support `filter` parameter on the `EntityHeaderBlueprint`
- a3a878d: Adding `type` as an override to the `convertLegacyEntityCardExtension`
- defc243: hide pagination `queryparams` if pagination mode is set to none
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/frontend-test-utils@0.3.5
  - @backstage/core-compat-api@0.5.0
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-kubernetes-backend@0.20.0

### Minor Changes

- 759568d: **BREAKING CHANGE**: Removed support for the legacy backend system. This means that the deprecated `createRouter` and `KubernetesBuilder` and related types have been removed. Please refer to the [relevant documentation](https://backstage.io/docs/features/kubernetes/installation/#adding-kubernetes-backend-plugin) to configure the Kubernetes plugin.

  **BREAKING CHANGE**: The deprecated types `AuthenticationStrategy`, `AuthMetadata`, `ClusterDetails`, `CustomResource`, `CustomResourcesByEntity`, `FetchResponseWrapper`, `KubernetesBuilder`, `KubernetesBuilderReturn`, `KubernetesClustersSupplier`, `KubernetesCredential`, `KubernetesEnvironment`, `KubernetesFetcher`, `KubernetesObjectsProvider`, `KubernetesObjectTypes`, `KubernetesServiceLocator`,`ObjectFetchParams`, `ObjectToFetch`,`RouterOptions` and `ServiceLocatorRequestContext` should all now be imported from `@backstage/plugin-kubernetes-node`.

### Patch Changes

- 00ebaeb: Remove usage of the deprecated `loggerToWinstonLogger` from `@backstage/backend-common`.
- 79e342e: Added support for providing a factory to the extension points
- 5f424c6: Added support for Google Service account credentials config to use in GoogleServiceAccountStrategy
- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-kubernetes-node@0.3.3
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-notifications-common@0.1.0

### Minor Changes

- 9152ba8: Add an optional generic object `metadata` field to `NotificationPayload`. Metadata can be used to store additional unstructured data for the notification and are available to use by processors.

## @backstage/plugin-scaffolder@1.34.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI
- b1c0696: Add resizable panels width for the editor and preview panels in the template editor and template form playground layouts. Users can now resize these panels by dragging the divider between the two areas.

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- b0dc9b8: differentiate between entirely and partially composite schemas in schema rendering
- c4b7c50: Export `FormField` type from `/alpha` in `-react` package, and internal refactor.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-scaffolder-react@1.19.0
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-scaffolder-backend@2.2.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI
- 2032660: Fixed fs:readdir action example
- 11dc90f: Implement max length for scaffolder auditor audit logging with default of 256
- 812485c: Add step info to scaffolder action context to access the step id and name.

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- 4ae87f5: add `getResources` method to `permissionIntegrationRouter` for frontend task permission checks
- b817c1d: Stop logging of `SPLAT` twice in logs
- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.4
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-scaffolder-backend-module-github@0.8.2
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.11
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.13
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.12
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.12
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.12

## @backstage/plugin-scaffolder-common@1.7.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI

## @backstage/plugin-scaffolder-node@0.11.0

### Minor Changes

- c08cbc4: Move Scaffolder API to OpenAPI

### Patch Changes

- 812485c: Add step info to scaffolder action context to access the step id and name.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-react@1.19.0

### Minor Changes

- 4f99e10: **DEPRECATION**: The following types have been deprecated from this package and moved into `@backstage/plugin-scaffolder-common` and should be imported from there instead.

  `Action`, `ListActionsResponse`, `LogEvent`, `ScaffolderApi`, `ScaffolderDryRunOptions`, `ScaffolderDryRunResponse`, `ScaffolderGetIntegrationsListOptions`, `ScaffolderGetIntegrationsListResponse`,
  `ScaffolderOutputLink`, `ScaffolderOutputText`, `ScaffolderScaffoldOptions`, `ScaffolderScaffoldResponse`, `ScaffolderStreamLogsOptions`, `ScaffolderTask`, `ScaffolderTaskOutput`, `ScaffolderTaskStatus`,
  `ScaffolderUsageExample`, `TemplateFilter`, `TemplateGlobalFunction`, `TemplateGlobalValue`, `TemplateParameterSchema`.

- c08cbc4: Move Scaffolder API to OpenAPI

### Patch Changes

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- c4b7c50: Export `FormField` type from `/alpha` in `-react` package, and internal refactor.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-techdocs@1.14.0

### Minor Changes

- cb0541f: Adds `additionalAllowedURIProtocols` to sanitizer config

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- f231c2b: Fixes CSS to adjust based on whether or not the global Backstage sidebar is on the page.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-auth-react@0.1.18
  - @backstage/plugin-techdocs-react@1.3.2

## @backstage/app-defaults@1.6.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/theme@0.6.8

## @backstage/backend-app-api@1.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/backend-dynamic-feature-service@0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/cli-node@0.2.14
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-events-backend@0.5.5
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-app-node@0.1.36
  - @backstage/plugin-events-node@0.4.14

## @backstage/backend-plugin-api@1.4.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3

## @backstage/cli-node@0.2.14

### Patch Changes

- d9a7835: Add `get` and `keys` methods to `Lockfile` class

## @backstage/core-components@0.17.5

### Patch Changes

- 1de1186: Added missing space for alert display component
- 77467bb: Updated dependency `linkifyjs` to `4.3.2`.
- 5563605: Added `FavoriteToggleProps`.
- Updated dependencies
  - @backstage/theme@0.6.8

## @backstage/create-app@0.7.2

### Patch Changes

- d7a3d04: Created a flag for scaffolding apps using the new frontend system.
- 4704160: Bumped create-app version.
- 1e8a013: Bumped create-app version.
- e33fce1: Added Notifications and Signals to be installed by default
- 8b1bf6e: Updated the `app.packages` config setting now that it no longer is experimental
- 2a156e0: Updated the `better-sqlite` dependency from `v9.0.0` to `v13.0.0`. You can apply this change to your instance by applying the following change to your `packages/backend/package.json` and running `yarn install`.

  ```diff
    "dependencies": {
      "app": "link:../app",
  -    "better-sqlite3": "^9.0.0",
  +    "better-sqlite3": "^12.0.0",
      "node-gyp": "^10.0.0",
      "pg": "^8.11.3"
    }
  ```

## @backstage/dev-utils@1.1.13

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/app-defaults@1.6.5

## @backstage/frontend-dynamic-feature-loader@0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0

## @backstage/frontend-test-utils@0.3.5

### Patch Changes

- df7bd3b: Updated import of the `FrontendFeature` type.
- 5d31d66: Updated the usage of the `RouterBlueprint` and `AppRootWrapperBlueprint` to use the lowercase `component` parameter
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/frontend-app-api@0.12.0
  - @backstage/plugin-app@0.2.0
  - @backstage/test-utils@1.7.11

## @backstage/repo-tools@0.15.1

### Patch Changes

- 33060b5: Removed build-in ignore of the `packages/canon` package for knip reports.
- 225d7c2: Added `stringEnums` to `mustache` templates
- Updated dependencies
  - @backstage/cli-node@0.2.14
  - @backstage/backend-plugin-api@1.4.2

## @techdocs/cli@1.9.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-techdocs-node@1.13.6

## @backstage/test-utils@1.7.11

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.8

## @backstage/theme@0.6.8

### Patch Changes

- b731527: We are introducing two new data attributes on the `body` to support Backstage UI (BUI) new theming system.

## @backstage/plugin-api-docs@0.12.10

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- 633327c: Improved styling for dark mode
- 8b1bf6e: Updated README instructions for the new frontend system
- Updated dependencies
  - @backstage/plugin-catalog@1.31.2
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0

## @backstage/plugin-app-backend@0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-app-node@0.1.36

## @backstage/plugin-app-node@0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-app-visualizer@0.1.22

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0

## @backstage/plugin-auth-backend@0.25.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-atlassian-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-auth0-provider@0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.3
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-bitbucket-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-github-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-gitlab-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-google-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-guest-provider@0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-microsoft-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-oauth2-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-oidc-provider@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.3
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-okta-provider@0.2.6

### Patch Changes

- 94476d2: Updated dependency `@davidzemon/passport-okta-oauth` to `^0.0.7`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-onelogin-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-pinniped-provider@0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-node@0.6.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-auth-react@0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5

## @backstage/plugin-catalog@1.31.2

### Patch Changes

- c0ea01b: Fix card scrolling behaviour
- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- f4622e8: Adding a more sensible default order to the default filters
- 77eebdc: Support multiple headers in new frontend system, and don't render a header until the entity has finished loading
- b158801: Fixed bug in EntityLayout that caused wiping existing query parameters when opening the InspectEntityDialog.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-techdocs-react@1.3.2

## @backstage/plugin-catalog-backend@3.0.1

### Patch Changes

- 1752be6: Attempt to circumvent event listener memory leak in compression middleware

- 9658703: Sort built-in relation fields for more stable entity hash in the processing engine

- 9dd213c: Make the processing hash calculation not care about the order of the processors.

  This change does not affect the behavior of the catalog, but it will make the processing
  hash calculation more robust against changes in the order of processors. This should lead to
  more stable processing hashes, which in turn should lead to fewer unnecessary reprocessing
  of entities.

  After deploying this fix, you may see a period of increased processing and stitching, but
  this should stabilize over time as the processing hashes become more consistent.

- fa6fa60: Fixed getLocationByEntity to use `original_value` instead of `value` when querying search table

- 3a7dad9: Updated `better-sqlite3` to v12

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-aws@0.4.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-azure@0.3.8

### Patch Changes

- b3aa80e: `host` should be optional in `config` schema
- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-gcp@0.3.11

### Patch Changes

- cb36a86: Added support for Google Service account credentials config used in GkeEntityProvider.
  Added support for additional metadata `authProvider` and `owner` to be set for the GKE cluster entities.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-gerrit@0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-gitea@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-github@0.10.2

### Patch Changes

- d421b16: This change introduces single user versions of the user group resolution code in the multi org provider that will not page through all membership when updating a single user.
- f6c64d1: Fix GitHub catalog entity provider branch matching on event processing.
- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-github-org@0.3.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-catalog-backend-module-github@0.10.2
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-gitlab@0.7.2

### Patch Changes

- 8dfe76f: Added support for multiple group patterns instead of a single one to increase flexibility when filtering groups from GitLab.
- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-gitlab-org@0.2.12

### Patch Changes

- d8cb60e: feat: Add gitlabOrgEntityProviderTransformsExtensionPoint for overriding user and group transformers
- Updated dependencies
  - @backstage/plugin-catalog-backend-module-gitlab@0.7.2
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-ldap@0.11.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-logs@0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-catalog-backend-module-msgraph@0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-openapi@0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-puppetdb@0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.7.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-backend-module-unprocessed@0.6.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-catalog-graph@0.4.22

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- 8b1bf6e: Updated README instructions for the new frontend system
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-catalog-import@0.13.4

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-catalog-unprocessed-entities@0.2.20

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0

## @backstage/plugin-config-schema@0.1.71

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5

## @backstage/plugin-devtools@0.1.30

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0

## @backstage/plugin-devtools-backend@0.5.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-events-backend@0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-aws-sqs@0.4.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-azure@0.2.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-bitbucket-server@0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-gerrit@0.2.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-github@0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-gitlab@0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-google-pubsub@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-module-kafka@0.1.2

### Patch Changes

- 0d38009: Remove luxon dependency and minor internal improvements
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-backend-test-utils@0.1.47

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-events-node@0.4.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-gateway-backend@1.0.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-home@0.8.11

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f16d380: Add the missing Visits API to the alpha plugin, fixing a crash due to the API not being installed.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- 121899a: **BREAKING ALPHA**: The `app-root-element` extension now only accepts `JSX.Element` in its `element` param, meaning overrides need to be updated.
- 166dfd7: Fixed bug in CustomHomepageGrid where `clearAll` did not respect the `deletable` flag on widgets
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-home-react@0.1.29

## @backstage/plugin-home-react@0.1.29

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0

## @backstage/plugin-kubernetes@0.12.10

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- 3025cf5: Removed the kubernetes content padding to avoid double padding on k8s entity page
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/plugin-kubernetes-react@0.5.10

## @backstage/plugin-kubernetes-cluster@0.0.28

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/plugin-kubernetes-react@0.5.10

## @backstage/plugin-kubernetes-node@0.3.3

### Patch Changes

- 79e342e: Added support for providing a factory to the extension points
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-kubernetes-react@0.5.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5

## @backstage/plugin-mcp-actions-backend@0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-notifications@0.5.8

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.

- 5a70981: Fix duplicate notification origins with multiple channels

- 8a24e0f: Improve customization of the notification snackbar.

  Users can now customize the notification snackbar by providing custom components and icons
  for different severity levels. Additionally, the location of the snackbar notifications
  can be modified, the density of the snackbar can be changed, and the number of snacks can
  be limited.

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/theme@0.6.8
  - @backstage/plugin-notifications-common@0.1.0

## @backstage/plugin-notifications-backend@0.5.9

### Patch Changes

- 9152ba8: Add an optional generic object `metadata` field to `NotificationPayload`. Metadata can be used to store additional unstructured data for the notification and are available to use by processors.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-signals-node@0.1.23

## @backstage/plugin-notifications-backend-module-email@0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-notifications-backend-module-slack@0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-notifications-node@0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-signals-node@0.1.23

## @backstage/plugin-org@0.6.42

### Patch Changes

- 43cbb10: Added OwnershipCard, ComponentsGrid and UserProfileCard components to the `overridableComponents`.
- 8b1bf6e: Updated README instructions for the new frontend system
- 4ee19ed: Added support for scrolling to OwnershipCard component
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0

## @backstage/plugin-org-react@0.1.41

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/catalog-client@1.11.0

## @backstage/plugin-permission-backend@0.7.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-permission-backend-module-allow-all-policy@0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-permission-node@0.10.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-proxy-backend@0.6.5

### Patch Changes

- 0810cd8: correct rewrite rule to avoid extra subpath in proxy path
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-proxy-node@0.1.7

## @backstage/plugin-proxy-node@0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-azure@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.12
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.12

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.3.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-gcp@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-gerrit@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-gitea@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-github@0.8.2

### Patch Changes

- a22cce0: Fixed bug in the `customProperties` type which was preventing it being used to set a list of values against a key (e.g. for multi-select fields)
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-gitlab@0.9.4

### Patch Changes

- 5bb870b: Show additional information about the cause in error messages from GitLab
- df2bfab: The `description` property in `publish:gitlab:merge-request` has been made optional again to comply with the GitLab API.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-notifications@0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-rails@0.5.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-sentry@0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-backend-module-yeoman@0.4.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/plugin-scaffolder-node-test-utils@0.3.2
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-scaffolder-node-test-utils@0.3.2

### Patch Changes

- 812485c: Add step info to scaffolder action context to access the step id and name.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.11.0
  - @backstage/backend-test-utils@1.8.0
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search@1.4.29

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-catalog-react@1.20.0

## @backstage/plugin-search-backend@2.0.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.6.0
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-catalog@0.3.7

### Patch Changes

- d9bda0f: Allow filter to be an array in config schema
- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-elasticsearch@1.7.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-explore@0.3.5

### Patch Changes

- 3b8fac1: Updated dependency `@backstage-community/plugin-explore-common` to `^0.5.0`.
- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-pg@0.5.47

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-backend-module-techdocs@0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-techdocs-node@1.13.6

## @backstage/plugin-search-backend-node@1.3.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-search-react@1.9.3

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/theme@0.6.8

## @backstage/plugin-signals@0.0.22

### Patch Changes

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- 121899a: **BREAKING ALPHA**: The `app-root-element` extension now only accepts `JSX.Element` in its `element` param, meaning overrides need to be updated.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/theme@0.6.8

## @backstage/plugin-signals-backend@0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-signals-node@0.1.23

## @backstage/plugin-signals-node@0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## @backstage/plugin-techdocs-addons-test-utils@1.0.52

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.31.2
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-techdocs@1.14.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/test-utils@1.7.11
  - @backstage/plugin-techdocs-react@1.3.2

## @backstage/plugin-techdocs-backend@2.0.5

### Patch Changes

- 484e500: Updated CachedEntityLoader to use BackstageCredentials instead of raw tokens for cache key generation. It now uses principal-based identification (user entity ref for users, subject for services) instead of token-based keys, providing more consistent caching behavior.
- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-search-backend-module-techdocs@0.4.5
  - @backstage/plugin-techdocs-node@1.13.6

## @backstage/plugin-techdocs-module-addons-contrib@1.1.27

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-techdocs-react@1.3.2

## @backstage/plugin-techdocs-node@1.13.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2

## @backstage/plugin-techdocs-react@1.3.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0

## @backstage/plugin-user-settings@0.8.25

### Patch Changes

- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8

## @backstage/plugin-user-settings-backend@0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-signals-node@0.1.23

## example-app@0.2.112

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.31.2
  - @backstage/plugin-org@0.6.42
  - @backstage/core-components@0.17.5
  - @backstage/plugin-scaffolder-react@1.19.0
  - @backstage/plugin-scaffolder@1.34.0
  - @backstage/frontend-app-api@0.12.0
  - @backstage/ui@0.7.0
  - @backstage/cli@0.34.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.20
  - @backstage/plugin-catalog-import@0.13.4
  - @backstage/plugin-catalog-graph@0.4.22
  - @backstage/plugin-notifications@0.5.8
  - @backstage/plugin-user-settings@0.8.25
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-kubernetes@0.12.10
  - @backstage/plugin-api-docs@0.12.10
  - @backstage/plugin-devtools@0.1.30
  - @backstage/plugin-techdocs@1.14.0
  - @backstage/plugin-search@1.4.29
  - @backstage/plugin-home@0.8.11
  - @backstage/plugin-signals@0.0.22
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/app-defaults@1.6.5
  - @backstage/plugin-auth-react@0.1.18
  - @backstage/plugin-kubernetes-cluster@0.0.28
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.27
  - @backstage/plugin-techdocs-react@1.3.2

## example-app-next@0.0.26

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.31.2
  - @backstage/plugin-org@0.6.42
  - @backstage/core-components@0.17.5
  - @backstage/frontend-defaults@0.3.0
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-scaffolder-react@1.19.0
  - @backstage/plugin-scaffolder@1.34.0
  - @backstage/frontend-app-api@0.12.0
  - @backstage/plugin-app@0.2.0
  - @backstage/ui@0.7.0
  - @backstage/cli@0.34.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.20
  - @backstage/core-compat-api@0.5.0
  - @backstage/plugin-app-visualizer@0.1.22
  - @backstage/plugin-catalog-import@0.13.4
  - @backstage/plugin-catalog-graph@0.4.22
  - @backstage/plugin-notifications@0.5.8
  - @backstage/plugin-user-settings@0.8.25
  - @backstage/plugin-search-react@1.9.3
  - @backstage/plugin-kubernetes@0.12.10
  - @backstage/plugin-api-docs@0.12.10
  - @backstage/plugin-techdocs@1.14.0
  - @backstage/plugin-search@1.4.29
  - @backstage/plugin-home@0.8.11
  - @backstage/plugin-signals@0.0.22
  - @backstage/plugin-catalog-react@1.20.0
  - @backstage/theme@0.6.8
  - @backstage/app-defaults@1.6.5
  - @backstage/plugin-auth-react@0.1.18
  - @backstage/plugin-kubernetes-cluster@0.0.28
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.27
  - @backstage/plugin-techdocs-react@1.3.2

## app-next-example-plugin@0.0.26

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0

## example-backend@0.0.41

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-backend@0.20.0
  - @backstage/plugin-scaffolder-backend@2.2.0
  - @backstage/backend-defaults@0.12.0
  - @backstage/plugin-catalog-backend@3.0.1
  - @backstage/plugin-proxy-backend@0.6.5
  - @backstage/plugin-search-backend-module-explore@0.3.5
  - @backstage/plugin-scaffolder-backend-module-github@0.8.2
  - @backstage/plugin-techdocs-backend@2.0.5
  - @backstage/plugin-search-backend-module-catalog@0.3.7
  - @backstage/plugin-notifications-backend@0.5.9
  - @backstage/plugin-app-backend@0.5.5
  - @backstage/plugin-auth-backend@0.25.3
  - @backstage/plugin-auth-backend-module-github-provider@0.3.6
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-devtools-backend@0.5.8
  - @backstage/plugin-events-backend@0.5.5
  - @backstage/plugin-events-backend-module-google-pubsub@0.1.3
  - @backstage/plugin-mcp-actions-backend@0.1.2
  - @backstage/plugin-permission-backend@0.7.3
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/plugin-search-backend@2.0.5
  - @backstage/plugin-search-backend-node@1.3.14
  - @backstage/plugin-signals-backend@0.3.7
  - @backstage/plugin-scaffolder-backend-module-notifications@0.1.13
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-auth-backend-module-guest-provider@0.2.11
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.5
  - @backstage/plugin-catalog-backend-module-openapi@0.2.13
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.11
  - @backstage/plugin-catalog-backend-module-unprocessed@0.6.3
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.2.11
  - @backstage/plugin-search-backend-module-techdocs@0.4.5

## e2e-test@0.2.31

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.7.2

## @internal/frontend@0.0.12

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0

## @internal/scaffolder@0.0.12

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/plugin-scaffolder-react@1.19.0

## techdocs-cli-embedded-app@0.2.111

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.31.2
  - @backstage/core-components@0.17.5
  - @backstage/cli@0.34.0
  - @backstage/plugin-techdocs@1.14.0
  - @backstage/theme@0.6.8
  - @backstage/app-defaults@1.6.5
  - @backstage/test-utils@1.7.11
  - @backstage/plugin-techdocs-react@1.3.2

## @internal/plugin-todo-list@1.0.42

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5

## @internal/plugin-todo-list-backend@1.0.42

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.2
