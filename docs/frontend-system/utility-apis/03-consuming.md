---
id: consuming
title: Consuming Utility APIs
sidebar_label: Consuming APIs
# prettier-ignore
description: Consuming utility APIs
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

All of the utility API extensions that were passed into your app through installed plugins, get instantiated and configured in the right order by the framework, and are then made available for consumption. You can interact with these instances in the following ways.

## Via React hooks

The most common consumption pattern for utility APIs is to call the `useApi` hook inside React components to get an implementation via its API ref. This applies whether it was originally provided from the core framework or from a plugin.

```tsx
import { useApi, configApiRef } from '@backstage/frontend-plugin-api';

const MyComponent = () => {
  const configApi = useApi(configApiRef);
  const title = configApi.getString('app.title');
  // ...
};
```

The `useApi` hook always returns a value, or throws an exception if the API ref could not be resolved to a registered implementation. For advanced use cases, where you explicitly want to optionally request a utility API that may or may not have been provided at runtime, you can use the underlying `useApiHolder` hook instead.

```tsx
import { useApiHolder, configApiRef } from '@backstage/frontend-plugin-api';

const MyComponent = () => {
  const apis = useApiHolder();
  const configApi = apis.get(configApiRef); // may return undefined
  if (configApi) {
    const title = configApi.getString('app.title');
    // ...
  }
};
```

## Via dependencies

Your utility APIs can depend on other utility APIs in their factories. You do this by declaring `deps` on your `createApiFactory`, and reading the outcome in your `factory`.

```tsx
import {
  configApiRef,
  ApiBlueprint,
  createApiFactory,
  discoveryApiRef,
} from '@backstage/frontend-plugin-api';
import { MyApiImpl } from './MyApiImpl';

const myApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: myApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
      },
      factory: ({ configApi, discoveryApi }) => {
        return new MyApiImpl({ configApi, discoveryApi });
      },
    }),
  },
});
```

Note how the `deps` section essentially assigns free-form names that you choose, to API refs. Here we for example map `configApiRef` to the name `configApi`, but that's just a convention. The framework will ensure that all of those deps get instantiated and passed into your `factory` function with the same set of names as your `deps`. At that point, `configApi` refers to an actual functioning instance of that API ref.
