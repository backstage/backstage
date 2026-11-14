---
id: migrations
title: Frontend System Changelog
sidebar_label: Changelog
description: Changelog documentation for different versions of the frontend system core APIs.
---

## Introduction

This section provides migration guides for different versions of the frontend system core APIs. Each guide will provide a summary of the changes that have been made for a particular Backstage release, and how to update your usage of the core APIs.

This guide is intended for app and plugin authors who have already migrated their code to the new frontend system, and are looking to keep it up to date with the latest changes. These guides do not cover trivial migrations that can be explained in a deprecation message, such as a renamed export.

## 1.57

This release changes how the frontend system handles routing and requires React 18 in most frontend packages. The app now owns the browser history and exposes it as `AppHistoryApi`, and each page picks its own routing library instead of sharing a single app-wide React Router. Plugins navigate through framework APIs that work the same way on every page, while pages that need a routing library's own APIs render a page-scoped adapter. For the design background, see [RFC #33603](https://github.com/backstage/backstage/issues/33603).

If your app uses the default routing setup, the only required routing action is to remove any router overrides, as described below. The remaining routing changes affect apps that customize navigation, apps that use Backstage UI outside a Backstage app, and plugin authors that use router-specific APIs.

### Removed `RouterBlueprint` and the `app/root` router input

The `RouterBlueprint` from `@backstage/plugin-app-react` and the `router` input of the `app/root` extension have been removed. `convertLegacyAppOptions` from `@backstage/core-compat-api` also throws if you pass it a `components.Router` option. The app creates and owns the browser history itself, so a root component that installs its own router would create a second history that the app cannot observe.

What to do with an existing router override depends on what it did:

- If it only rendered `BrowserRouter`, delete it. The app provides history now.
- If it wrapped the router in global providers, move those providers to `AppRootWrapperBlueprint` from `@backstage/plugin-app-react`.
- If it installed a different router library, render that library's page router inside the lazily loaded component of each page that needs it. See [page routers](../building-plugins/10-page-routers.md).

For example, an app that previously overrode the router to add a query client:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { RouterBlueprint } from '@backstage/plugin-app-react';

export default RouterBlueprint.make({
  params: {
    component: ({ children }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    ),
  },
});
```

Now moves the provider to an app root wrapper, installed like any other extension:

```tsx
import { AppRootWrapperBlueprint } from '@backstage/plugin-app-react';

export const queryClientWrapper = AppRootWrapperBlueprint.make({
  name: 'query-client',
  params: {
    component: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  },
});
```

Apps that remain on the old frontend system are unaffected.

### The app owns the browser history

The app creates a browser history and exposes it through `AppHistoryApi`, available as `appHistoryApiRef` and `coreApis.appHistory` from `@backstage/frontend-plugin-api`. Page adapters, navigation hooks, and navigation analytics all observe this single history, so browser Back and Forward stay in sync with route matching.

Destinations passed to framework navigation must be app-absolute: they start with `/` and exclude the deployment basename. `/catalog` always means that path from the app root, even inside another plugin's adapter. Empty, query-only, and hash-only targets keep the current pathname. Path-relative targets such as `details`, `.`, and `../edit` are rejected by framework navigation; a page router adapter supplies its library's relative semantics instead. External URLs use browser navigation, honoring the `replace` option. Both `navigate` and `createHref` replace executable URL schemes such as `javascript:` with `about:blank` and log a warning.

For hash-based deployments, embedded views, or a host application that owns navigation, register your own `AppHistoryApi` implementation for `appHistoryApiRef` through an `ApiBlueprint` factory:

```tsx
import { ApiBlueprint, appHistoryApiRef } from '@backstage/frontend-plugin-api';

const appHistory = ApiBlueprint.make({
  name: 'app-history',
  params: defineParams =>
    defineParams({
      api: appHistoryApiRef,
      deps: {},
      factory: () => createMyAppHistory(),
    }),
});
```

The factory must be available during app initialization. An `if` predicate on the factory's extension, or on the attachment path leading to it, is rejected with an error, because predicate context is evaluated after the app history is selected. Remove the predicate and decide inside the factory which implementation to return.

In tests, replace a root `MemoryRouter` with `renderInTestApp` or `renderTestApp` from `@backstage/frontend-test-utils`, and navigate through the `appHistory` they return.

### Page-scoped routing with adapters

Pages keep their existing React Router v6 nested routes, relative links, and `useParams` through an implicit compatibility layer, which logs a development warning once per extension. To migrate away from that fallback, render a page router adapter in the lazily loaded page component:

```tsx
import { ReactRouterV6PageRouter } from '@backstage/frontend-adapter-react-router-v6';

export function ToolsPage() {
  return (
    <ReactRouterV6PageRouter>
      {/* Existing page JSX and local routes go here. */}
    </ReactRouterV6PageRouter>
  );
}
```

Adapters are standalone libraries published as `@backstage/frontend-adapter-react-router-v6`, `@backstage/frontend-adapter-react-router-v7`, and `@backstage/frontend-adapter-tanstack-router`. Install the adapter in the package that owns the page, alongside its routing library, which is a peer dependency. A page or sub-page that declares no adapter keeps the implicit compatibility.

Because an adapter is declared by the page content, routers nest: a page written with one library can host a sub-page written with another. Route refs resolve against the page the anchor is written in, and app-absolute destinations work across plugins. See [choose a router for a page](../building-plugins/10-page-routers.md) for the full guide, including TanStack Router and sub-page adapters.

### `useRouteRefParams` returns only declared parameters

`useRouteRefParams` now returns exactly the parameter names declared by the supplied route ref. Parameters that the current location does not bind have the value `undefined`, and the undeclared splat `*` is no longer included. Previously the hook returned all parameters matched for the current location, including the splat.

```tsx
const detailsRouteRef = createRouteRef({
  params: ['kind', 'namespace', 'name'],
});

// At /catalog/component/default/foo:
const params = useRouteRefParams(detailsRouteRef);
// { kind: 'component', namespace: 'default', name: 'foo' }
// Previously also included '*' when the page had a splat sub-route.
```

If your content needs the matched tail, read it from your page router's own parameter APIs. Matched extension parameters also take precedence over parameters inferred from a sub-route path, so navigating deeper within a sub-page retains its bound values.

### Backstage UI navigation

Backstage UI (BUI) components now use explicit routing integration based on React Aria's native link behavior:

- In Backstage apps, BUI navigation is configured automatically. BUI controls accept app-absolute destinations, query and hash targets, and external URLs. Relative targets work inside a page adapter, using that library's semantics at the control's route scope.
- Standalone apps that relied on ambient React Router integration must supply a `useNavigation` hook to `BUIProvider`. React Router is no longer a peer dependency of `@backstage/ui`.
- The `routerOptions` prop is retained, but it now supports only the router-neutral `replace` and `state` fields, so library-specific options are gone. Usage stays the same:

```tsx
<Link
  href={entityHref({ kind, namespace, name })}
  routerOptions={{ replace: true, state: { from: 'search' } }}
>
  Entity name
</Link>
```

- Hrefs using `javascript:`, `data:`, or `vbscript:` schemes become inert `about:blank` links with a console warning. Replace `data:` links with blob URLs or display their content directly, and replace `javascript:` links with `onClick` handlers.
- App chrome follows the app history: page tabs and breadcrumbs use app-absolute paths that include the deployment prefix, and header tab selection is case-insensitive, choosing the most specific matching path. Legacy core-components, including the sidebar, keep using React Router through the app's implicit compatibility.

See [migrate Backstage UI routing](../building-plugins/10-page-routers.md#migrate-backstage-ui-routing) for integration requirements.

### Page errors and missing routes

Uncaught errors thrown while page content renders now use the app's error display, which includes the plugin's details and a retry action. Unmatched routes continue to show the not-found page. If your app wrapped pages in its own error boundaries, you can remove them for page content, since the app now renders this display around every page.

### Testing navigation

`renderInTestApp` from `@backstage/frontend-test-utils` accepts a `router` option for rendering page adapters, and both `renderInTestApp` and `renderTestApp` return an `appHistory` that you use for navigation and location assertions:

```tsx
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';

it('renders the tools page and navigates', async () => {
  const { appHistory } = renderTestApp({
    extensions: [toolsPage],
    initialRouteEntries: ['/tools'],
  });

  expect(await screen.findByText('Tools')).toBeInTheDocument();

  appHistory.navigate('/tools/details');

  expect(await screen.findByText('Tool details')).toBeInTheDocument();
});
```

For tests that need memory history or fixed route-reference paths outside a test app, use `createMockAppHistory`, `createMockRouteResolutionApi`, `mockApis.appHistory()`, and `mockApis.routeResolution()`. Mocks reject path-relative destinations, matching production history, so use app-absolute paths or route-ref destinations. See [navigation and app history](../building-plugins/02-testing.md#navigation-and-app-history) for more examples.

### React 17 support removed

Most Backstage frontend packages now require React 18. Their peer dependency
ranges for `react`, `react-dom`, and `@types/react` have changed from
`^17.0.0 || ^18.0.0` to `^18.0.0` where those dependencies are declared.

The old frontend system core packages `@backstage/core-plugin-api`,
`@backstage/core-app-api`, `@backstage/core-compat-api`, and
`@backstage/core-components` retain React 17 in their own peer dependency
ranges. However, their dependencies include packages that now require React 18,
so apps using the old frontend system also need to plan the upgrade.

Update your app or plugin's `package.json` dependencies and peer dependencies
as appropriate. For example, a plugin's peer dependencies can change from:

```json title="package.json"
{
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "@types/react": "^17.0.0 || ^18.0.0"
  }
}
```

to:

```json title="package.json"
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@types/react": "^18.0.0"
  }
}
```

For the upgrade steps, see [Migrating to React 18](../../tutorials/react18-migration.md).

## 1.50

### New `configSchema` option for extension config

The `config.schema` option for `createExtension` and `createExtensionBlueprint` is now deprecated in favor of a new top-level `configSchema` option. The new option accepts direct schema values from any [Standard Schema](https://github.com/standard-schema/standard-schema) compatible library with JSON Schema support, rather than requiring factory functions. The `createSchemaFromZod` helper has also been removed.

The `configSchema` option requires schemas that implement the Standard Schema interface with JSON Schema support. This means you need to use [zod v4](https://zod.dev/) (`zod@^4.0.0`). Note that the `zod/v4` subpath export from the zod v3 package does **not** work — while it exposes the Zod v4 API surface, the resulting schema objects do not support JSON Schema conversion, which `configSchema` requires. Direct zod v3 schemas are also **not** supported by the new `configSchema` option — they are only supported through the deprecated `config.schema` callback format.

For example, an extension previously declared like this:

```tsx
createExtension({
  // ...
  config: {
    schema: {
      title: z => z.string().default('Hello'),
      count: z => z.number().optional(),
    },
  },
  factory({ config }) {
    // ...
  },
});
```

Should now look like this, using [zod v4](https://zod.dev/) (`zod@^4.0.0`):

```tsx
import { z } from 'zod';

createExtension({
  // ...
  configSchema: {
    title: z.string().default('Hello'),
    count: z.number().optional(),
  },
  factory({ config }) {
    // ...
  },
});
```

The same applies to `createExtensionBlueprint`:

```tsx
import { z } from 'zod';

const MyBlueprint = createExtensionBlueprint({
  // ...
  configSchema: {
    title: z.string().default('Hello'),
  },
  factory(params, { config }) {
    // ...
  },
});
```

And when adding config through `makeWithOverrides`:

```tsx
import { z } from 'zod';

MyBlueprint.makeWithOverrides({
  configSchema: {
    extra: z.string(),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      // ...
    });
  },
});
```

Each field in the `configSchema` record is a standalone schema value rather than a factory function. This decouples the config schema declaration from any specific zod version, and lets you use any schema library that implements the Standard Schema interface with JSON Schema support.

## 1.31

### `namespace` parameter should be removed

The `namespace` parameter to all `createExtension`, `createExtensionBlueprint` or any `.make()` or `.makeWithOverrides()` method can be removed. This will now default to the `id` of the `plugin` which should already be the case.

### `createExtensionOverrides` -> `createFrontendModule`

Extensions will need to be wrapped in a module in order to be installed in the frontend. This means that the `createExtensionOverrides` function should be replaced with `createFrontendModule`, and the `pluginId` parameter should be set with the target `pluginId` that you're overriding.

For example:

```tsx
import {
  PageBlueprint,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';

const customSearchPage = PageBlueprint.make({
  namespace: 'search',
  params: {
    path: '/search',
    loader: () =>
      import('./CustomSearchPage').then(m => <m.CustomSearchPage />),
  },
});

export default createExtensionOverrides({
  extensions: [customSearchPage],
});
```

Should now look like this:

```tsx
import {
  PageBlueprint,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';

const customSearchPage = PageBlueprint.make({
  params: {
    path: '/search',
    loader: () =>
      import('./CustomSearchPage').then(m => <m.CustomSearchPage />),
  },
});

export default createFrontendModule({
  pluginId: 'search',
  extensions: [customSearchPage],
});
```

### Moved `createApp`

The `createApp` function has been moved to the new `@backstage/frontend-defaults` package. The old export from `@backstage/frontend-app-api` is now deprecated and should be replaced with the new one.

### Removed support for "v1" extensions

Extensions created with `@backstage/frontend-plugin-api` from before the 1.30 release are no longer supported by `createApp`. To be able to use extensions in a new app, they need to be created with `@backstage/frontend-plugin-api` version 0.7.0 or later.

### New type parameters for `ExtensionDefinition` and `ExtensionBlueprint`

The type parameters of `ExtensionDefinition` and `ExtensionBlueprint` have been updated to use a single type parameter with an object, in order to make them easier to read and evolve.

Existing usage can generally be updated as follows:

`ExtensionDefinition<any>` -> `ExtensionDefinition`
`ExtensionDefinition<any, any>` -> `ExtensionDefinition`
`ExtensionDefinition<TConfig>` -> `ExtensionDefinition<{ config: TConfig }>`
`ExtensionDefinition<TConfig, TConfigInput>` -> `ExtensionDefinition<{ config: TConfig, configInput: TConfigInput }>`

If you need to infer the parameter you can use `ExtensionDefinitionParameters` and `ExtensionBlueprintParameters`, for example:

```tsx
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

## 1.30

### Reworked extension inputs and outputs

In previous versions of the frontend system you would define extension inputs and outputs as an "data map" where each named property corresponded to a piece of data that could be accessed via the same name in the extension factory. In order to better support extension overrides and blueprints, as well as reduce the risk of confusion, these data maps have been replaced by an array of data references.

For example, an extension previously declared like this:

```tsx
createExtension({
  name: 'example',
  attachTo: { id: 'some-extension', input: 'content' },
  inputs: {
    header: createExtensionInput(
      { element: coreExtensionData.reactElement },
      {
        optional: true,
        singleton: true,
      },
    ),
  },
  output: { element: coreExtensionData.reactElement },
  factory({ inputs }) {
    return {
      element: <ExtensionPage header={inputs.header?.output.element} />,
    };
  },
});
```

Would now look like this:

```tsx
createExtension({
  name: 'example',
  attachTo: { id: 'some-extension', input: 'content' },
  inputs: {
    header: createExtensionInput([coreExtensionData.reactElement], {
      optional: true,
      singleton: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    return [
      coreExtensionData.reactElement(
        <ExtensionPage
          header={inputs.header?.get(coreExtensionData.reactElement)}
        />,
      ),
    ];
  },
});
```

Note the changes to the `inputs` and `output` declarations, as well as how these are used in the factory. Both the `inputs` and `output` now declare their expected data using an array, without names tied to each piece of data. The `get` method on the input object is used to access the input data, and accept a data reference matching the data that was declared for that input.

The biggest change in practice is how the extension factories output their data. Instead of returning an object with the data values, you instead use each extension data reference to encapsulate a value and return a collection of these encapsulated values from the factory.

### Blueprints instead of extension creators

The "extension creator" pattern where `createExtension` was wrapped up in a function for creating specific kind of extensions has been replaced by [extension blueprints](./23-extension-blueprints.md). Extension creators were hard to implement and to maintain, with blueprints providing a much more consistent and powerful API surface for both plugin builders and integrators. For example, `createPageExtension` was the extension creator equivalent of `PageBlueprint`.

Replace all existing usages of extension creators in your plugin or app with the corresponding blueprint. For a given extension creator `create<Kind>Extension`, the blueprint equivalent is `<Kind>Blueprint`. There might be slight differences in the API between the two, but most often you just need to move the kind-specific options of the extension creator to be passed as parameters to the blueprint. Note that if your extension declared any additional inputs or config you'll need to use the [`.makeWithOverrides`](./23-extension-blueprints.md#creating-an-extension-from-a-blueprint-with-overrides) method of the blueprint.

If your plugin exports and extension creators, these should be migrated to blueprints instead.

### Extension tester rework

The `createExtensionTester` from the `@backstage/frontend-test-utils` package has been reworked to better support testing of extensions. The new API allows access to extension output directly using the new `.get(ref)` method, and also provides access to all tested extensions through the new `.query(id/extension)` method.

The `.render()` method that used to render the test subject in a test app has been deprecated. The extension tester no longer constructs a full app tree, but instead only instantiates the tree for the extensions under test. If you want to test the rendering of an extension that outputs in an app, you can instead use the `renderInTestApp` utility in combination with the new `.reactElement()` method of the extension tester: `renderInTestApp(tester.reactElement())`.

### Extension data references update

The way that extension data references are declared has been changed to allow for type inference of the ID. This requires the declaration to be split into two separate function calls, one to supply the type and the other to infer any options. For example, a reference that was previously declared like this:

```ts
export const myExtension = createExtensionDataRef<MyType>('my-plugin.my-data');
```

Should be updated to the following:

```ts
export const myExtension = createExtensionDataRef<MyType>().with({
  id: 'my-plugin.my-data',
});
```
