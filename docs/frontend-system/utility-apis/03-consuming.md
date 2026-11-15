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

The individual core refs exported by `@backstage/frontend-plugin-api`, such as
`configApiRef`, are deprecated. Replace them with the matching `coreApis` member.
Both forms refer to the same API ref, so existing factories and implementations
continue to work together during migration. Imports from the old frontend
system's `@backstage/core-plugin-api` package are unaffected.

Provider-specific authentication refs, such as `githubAuthApiRef`, remain
separate exports and are not deprecated. The provider-independent OAuth request
coordinator is available as `coreApis.oauthRequest`. The deprecated Alert API is
not included in `coreApis`; use `coreApis.toast` for notifications.

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
