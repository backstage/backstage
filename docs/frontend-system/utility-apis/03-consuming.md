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

### Promise-valued APIs

For a ref declared as `ApiRef<Promise<WorkApi>>`, `useApi` returns `WorkApi`.
It suspends while the promise is pending and throws its rejection reason if
initialization fails. Extension boundaries, including those used by
`PageBlueprint`, provide Suspense and error boundaries. When rendering outside
those boundaries, provide your own:

```tsx
<Suspense fallback={<Loading />}>
  <WorkComponent />
</Suspense>
```

Use an error boundary to handle rejected initialization. The framework caches
the promise returned by an API factory, so a failed initialization is not retried
on each render. A custom holder must likewise retain the same promise between
lookups; creating a fresh promise on every lookup can cause repeated suspension.

When treating an API as optional, catch only `NotImplementedError`, using
`NotImplementedError.is(error)` from `@backstage/errors`. Let all other thrown
values reach React. A catch-all would swallow suspension promises and initialization
failures, causing a present API to appear absent.

Direct holder lookups keep the declared API value:

```ts
const workPromise = apis.get(workApiRef); // Promise<WorkApi> | undefined
if (workPromise === undefined) {
  throw new Error('Work API is not available');
}
const workApi = await workPromise;
```

Factory dependencies also receive the promise unchanged. They must await it
where they need the resolved API. An API with asynchronous methods can still be
a synchronous value; only a promise-valued API causes `useApi` to suspend.

The hook's return type is `Awaited<T>`, so promises and objects with a callable
`then` property are recursively unwrapped. Synchronous API values are returned directly. The legacy `useApi`
hook from `@backstage/core-plugin-api` returns the declared value, including
promises, without unwrapping or suspending.

Changing an existing ref to a promise changes its contract. See
[changing an API to a promise](./02-creating.md#changing-an-api-to-a-promise) for
consumer, factory, and release requirements. In tests, supply promise-valued
mocks as promises and use asynchronous queries to await the rendered content.

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
