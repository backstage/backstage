---
id: consuming
title: Consuming Utility APIs
sidebar_label: Consuming APIs
description: Consuming utility APIs
---

All of the utility API extensions that were passed into your app through installed plugins, get instantiated and configured in the right order by the framework, and are then made available for consumption. You can interact with these instances in the following ways.

## Core Utility APIs

Use `coreApis` from `@backstage/frontend-plugin-api` to reference the Utility
APIs provided by the frontend system. For example, use `coreApis.config` to read
configuration, `coreApis.identity` to access the signed-in user's identity, and
`coreApis.toast` to display notifications.

Framework infrastructure APIs are grouped under `coreApis.internal`:
`appLifecycle`, `oauthRequest`, `pluginHeaderActions`, `pluginWrapper`, and
`swappableComponents`. These support app initialization, authentication
coordination, and rendering infrastructure. Plugins normally use higher-level
abstractions such as `PluginWrapperBlueprint`, `PluginHeaderActionBlueprint`,
and `createSwappableComponent`. The nested object is public;
`coreApis.internal` identifies the intended audience rather than a different
stability level.

The individual core refs exported by `@backstage/frontend-plugin-api`, such as
`configApiRef`, are deprecated. Replace them with the matching `coreApis` or
`coreApis.internal` member. Both forms refer to the same API ref, so existing
factories and implementations continue to work together during migration.
Imports from the old frontend system's `@backstage/core-plugin-api` package
are unaffected.

Provider-specific authentication refs, such as `githubAuthApiRef`, remain
separate exports and are not deprecated. The provider-independent OAuth request
coordinator is available as `coreApis.internal.oauthRequest`. The deprecated
Alert API is not included; use `coreApis.toast` for
notifications.

## Via React hooks

The most common consumption pattern for utility APIs is to call the `useApi` hook inside React components to get an implementation via its API ref. This applies whether it was originally provided from the core framework or from a plugin.

```tsx
import { useApi, coreApis } from '@backstage/frontend-plugin-api';

const MyComponent = () => {
  const configApi = useApi(coreApis.config);
  const title = configApi.getString('app.title');
  // ...
};
```

The `useApi` hook always returns a value, or throws an exception if the API ref could not be resolved to a registered implementation. For advanced use cases, where you explicitly want to optionally request a utility API that may or may not have been provided at runtime, you can use the underlying `useApiHolder` hook instead.

```tsx
import { useApiHolder, coreApis } from '@backstage/frontend-plugin-api';

const MyComponent = () => {
  const apis = useApiHolder();
  const configApi = apis.get(coreApis.config); // may return undefined
  if (configApi) {
    const title = configApi.getString('app.title');
    // ...
  }
};
```

### Async-capable APIs

Async utility APIs are supported only in plugins that exclusively support the
new frontend system. The host app must use that system, but it may still include
other converted legacy plugins. Legacy conversion helpers preserve synchronous
API registrations.

For refs declared with `loading: 'async'`, `useApi` still returns the API instance.
It suspends while the implementation is loading and throws if initialization
fails. Extension boundaries, including those used by `PageBlueprint`, provide
Suspense and error handling. Components rendered outside those boundaries need
their own React `Suspense` and error boundaries.

Outside rendering, await the result of `apis.get()`:

```ts
const workApi = await apis.get(workApiRef);
if (workApi) {
  await workApi.doWork();
}
```

Present async-capable APIs always return a promise from `get()`, even when their
implementation is synchronous or already loaded. Missing APIs return `undefined`
immediately. Initialization failures reject the promise and are cached for
subsequent lookups. Synchronous refs continue returning instances or
`undefined` directly.

`get()` infers its result from the ref's type, so generic helpers can preserve
the loading mode without branching:

```ts
import type { ApiRef, ApiHolder } from '@backstage/frontend-plugin-api';

function lookup<TApiRef extends ApiRef<unknown, string, 'sync' | 'async'>>(
  apis: ApiHolder,
  ref: TApiRef,
) {
  return apis.get(ref);
}
```

Refs without a `loading` member in their type are treated as synchronous.
`ApiRef<T>` also describes a synchronous ref. `ApiRef<T, string, 'sync' | 'async'>`
accepts either loading mode, so lookup results for that type include both direct
values and promises. Awaiting the result handles either mode. The deprecated
`AnyApiRef<T>` alias also continues to accept both modes.

Custom API holders must preserve promise identity across repeated lookups of an
async-capable ref. `useApiHolder` returns the context holder directly; async API
resolution is provided by the new frontend system.

### Updating refs that become async

A plugin must exclusively support the new frontend system before changing its
API refs to async loading. Changing a ref from synchronous to asynchronous
loading changes its contract.
For refs shared through a library or another public surface, this requires a
breaking release. Plugin-internal refs follow the breaking-producers exception.
See [changing loading mode](./02-creating.md#changing-loading-mode) for the exact
export boundaries and release requirements.

Update every consumer and factory, including overrides and dependency refs, to
use the new async-capable ref. Direct lookups must await `apis.get(ref)`.
Components can keep using `useApi(ref)` with the updated ref, but may now suspend
and need a Suspense boundary. A synchronous factory that depends on the API must
also become async-capable before it can use the updated dependency ref.

A synchronous implementation can still be used by an async-capable factory, as
long as that factory registers the updated ref. A ref and registered factory
with conflicting loading modes cause an error that identifies the API and asks
you to use matching versions of the ref. Dependency errors also include the path
to the conflicting ref. This applies to `useApi` as well as direct lookups;
older synchronous refs are not automatically upgraded.

## Via dependencies

Your utility APIs can depend on other utility APIs in their factories. You do this by declaring `deps` on your `createApiFactory`, and reading the outcome in your `factory`.

```tsx
import { coreApis, ApiBlueprint } from '@backstage/frontend-plugin-api';
import { MyApiImpl } from './MyApiImpl';

const myApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: myApiRef,
      deps: {
        configApi: coreApis.config,
        discoveryApi: coreApis.discovery,
      },
      factory: ({ configApi, discoveryApi }) => {
        return new MyApiImpl({ configApi, discoveryApi });
      },
    }),
});
```

Note how the `deps` section essentially assigns free-form names that you choose, to API refs. Here we for example map `coreApis.config` to the name `configApi`, but that's just a convention. The framework will ensure that all of those deps get instantiated and passed into your `factory` function with the same set of names as your `deps`. At that point, `configApi` refers to an actual functioning instance of that API ref.
