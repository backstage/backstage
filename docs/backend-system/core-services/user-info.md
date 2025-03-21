---
id: user-info
title: User Info Service
sidebar_label: User Info
description: Documentation for the User Info service
---

This service lets you extract more information about a set of user credentials.
Specifically, it can be used to extract the ownership entity refs for a user
principal.

:::note Note

Please also refer to [`auth`](./auth.md) and [`httpAuth`](./http-auth.md) services for
general credentials handling which is a prerequisite for the below examples.

:::

## Using the Service

In the following code examples, the `userInfo`, `auth`, and `httpAuth` variables are assumed
to be dependency-injected instances of the `coreServices.userInfo` and
`coreServices.httpAuth` service, respectively. For a backend plugin, it might
look like this:

```ts
export default createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        userInfo: coreServices.userInfo,
      },
      async init({ auth, httpAuth, httpRouter, userInfo }) {
        // Your code goes here
      },
    });
  },
});
```

### Getting User Info

This example extracts some user credentials out of a request and fetches
additional information about that principal.

```ts
router.get('/some-request', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const info = await userInfo.getUserInfo(credentials);
});
```

The `userInfo` service only deals with credentials that contain user principals,
it won't accept requests for service principals. In our example code the initial
credentials extraction limits it to user credentials upfront. If you have an
endpoint that allows both user and service credentials, you may want to wrap
your user info extraction in a principal type check:

```ts
router.get('/some-request', async (req, res) => {
  const credentials = await httpAuth.credentials(req);
  if (auth.isPrincipal(credentials, 'user')) {
    const info = await userInfo.getUserInfo(credentials);
    // ...
  }
});
```

The user info contains data that was extracted during sign-in for the given
user.
