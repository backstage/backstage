---
id: using-backstage-proxy-within-plugin
title: Using the Backstage Proxy from Within a Plugin
# prettier-ignore
description: Guide on how to create a set of API bindings that interface with a backend via the backstage proxy
---

This guide walks you through setting up a simple proxy to an existing API that
is deployed externally to backstage and sending requests to that API from within
a backstage frontend plugin. For a more detailed description of the APIs used
here, check out the [Utility APIs section](../api/utility-apis.md).

If your plugin requires access to an API, backstage offers
[3 options](../plugins/call-existing-api.md):

1. you can
   [access the API directly](../plugins/call-existing-api.md#issuing-requests-directly),
1. you can create a [backend plugin](../plugins/backend-plugin.md) if you are
   implementing the API alongside your frontend plugin
1. you can configure backstage to proxy to an already existing API. The third
   approach tends to be the most popular, since you likely already have an
   existing API, and it allows you to develop/deploy your API in any way you
   want.

**Table of Contents**

- [Setting up the backstage proxy](#setting-up-the-backstage-proxy)
- [Calling an API using the backstage proxy](#calling-an-api-using-the-backstage-proxy)
  - [Defining the API client interface](#defining-the-api-client-interface)
  - [Creating the API client](#creating-the-api-client)
  - [Bundling your ApiRef with your plugin](#bundling-your-apiref-with-your-plugin)
  - [Using your plugin in your components](#using-your-plugin-in-your-components)

# Setting up the backstage proxy

Let's say your plugin's API is hosted at _https://api.myawesomeservice.com/v1_,
and you want to be able to access it within backstage at
`/api/proxy/<your-proxy-uri>`, and add a default header called
`X-Custom-Source`. You will need to add the following to `app-config.yaml`:

```yaml
proxy:
  '/<your-proxy-uri>':
    target: https://api.myawesomeservice.com/v1
    changeOrigin: true # Use this to avoid cors related issues
    headers:
      X-Custom-Source: backstage
```

You can find more details about the proxy config options in the
[proxying section](../plugins/proxying.md).

# Calling an API using the backstage proxy

If you followed the previous steps, you should now be able to access your API by
calling `${backend-url}/api/proxy/<your-proxy-uri>`. The reason why
`backend-url` is referenced is because the backstage backend creates and runs
the proxy. Backstage is structured in such a way that you could run the
backstage frontend independently of the backend. So when calling your API you
need to prepend the backend url to your http call. The supported way of doing
this, is to use [`createApiRef`](../reference/core-plugin-api.createapiref.md)
to create a new [`ApiRef`](../reference/core-plugin-api.apiref.md) and register
an [`ApiFactory`](../reference/core-plugin-api.apifactory.md), which will wrap
your API implementation, with your plugin using
[`createApiFactory`](../reference/core-plugin-api.createapifactory.md). Then,
you can use your API in your components by calling
[`useApi`](../reference/core-plugin-api.useapi.md)

## Defining the API client interface

Continuing from the previous example, let's assume that
_https://api.myawesomeservice.com/v1_ has the following endpoints:

| Method                   | Description             |
| :----------------------- | :---------------------- |
| `GET /users`             | Returns a list of users |
| `GET /users/{userId}`    | Returns a single user   |
| `DELETE /users/{userId}` | Deletes a user          |

Here is an example definition for this API following backstage's `apiRef` style:

```ts
/* src/api.ts */
import { createApiRef } from '@backstage/core-plugin-api';

export interface User {
  name: string;
  email: string;
}

export interface MyAwesomeApi {
  url: string;
  listUsers: () => Promise<List<User>>;
  getUser: (userId: string) => Promise<User>;
  deleteUser: (userId: string) => Promise<boolean>;
}

export const myAwesomeApiRef = createApiRef<MyAwesomeApi>({
  id: 'plugin.my-awesome-api.service',
  description: 'Example API definition',
});
```

## Creating the API client

The `myAwesomeApiRef` is what you will use within backstage to reference the API
client in your plugin. The API ref itself is a global singleton object that
allows you to reference your instantiated API. The actual implementation would
look something like this:

```ts
/* src/api.ts */

/* ... */

import { Config } from '@backstage/config';

export class MyAwesomeApiClient implements MyAwesomeApi {
  static fromConfig(config: Config) {
    return new MyAwesomeApiClient(config.getString('backend.baseUrl'));
  }

  constructor(public url: string) {}

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    // As configured previously for the backend proxy
    const proxyUri = '/api/proxy/<your-proxy-uri>'

    const resp = await fetch(`${this.url}${proxyUri}${input}`, init);
    if (!resp.ok) throw new Error(resp);
    return await resp.json();
  }

  async listUsers(): Promise<List<User>> {
    return await this.fetch<List<User>>('/users');
  }

  async getUser(userId: string): Promise<User> {
    return await this.fetch<User>(`/users/${userId}`);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.fetch<boolean>(
      `/users/${userId}`,
      { method: 'DELETE' }
    );
  }
```

> If you want to understand how the Config object works at a deeper level, check
> this [doc](../conf/reading.md)

## Bundling your ApiRef with your plugin

The final piece in the puzzle is bundling the `myAwesomeApiRef` with a factory
for `MyAwesomeApiClient` objects. This is usually done in the `plugin.ts` file
inside the plugin's `src` directory. This is an example of what it'd look like,
assuming you added the previous code in a file called `api.ts`:

```ts
/* src/plugin.ts */
import { myAwesomeApiRef, MyAwesomeApiClient } from './api';
import { rootRouteRef } from './routes';
import {
  createPlugin,
  createRouteRef,
  createApiFactory,
  configApiRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

//...

export const myCustomPlugin = createPlugin({
  id: '<your-plugin-name>',
  routes: {
    root: rootRouteRef,
  },

  // Configure a factory for myAwesomeApiRef
  apis: [
    createApiFactory({
      api: myAwesomeApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => MyAwesomeApiClient.fromConfig(configApi),
    }),
  ],
});
```

## Using your plugin in your components

Now you should be able to access your API using the backstage hook
[`useApi`](../reference/core-plugin-api.useapi.md) from within your plugin code.

```ts
/* plugins/my-awesome-plugin/src/components/AwesomeUsersTable.tsx */
import { useApi } from '@backstage/core-plugin-api';
import { myAwesomeApiRef } from '../../api';

export const AwesomeUsersTable = () => {
  const apiClient = useApi(myAwesomeApiRef);

  apiClient.listUsers()
    .then(
      ...
    )
}
```
