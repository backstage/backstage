---
id: http-auth
title: Http Auth Service
sidebar_label: Http Auth
description: Documentation for the Http Auth service
---

The `httpAuth` service deals with submitting and receiving credentials on Express
HTTP request/response objects. This service is frequently used in plugins that
have REST interfaces.

If you want to deal with raw tokens and do low level credentials handling, see
also [the `auth` service](./auth.md). If you want to extract more details about
authenticated users such as their ownership entity refs, use [the `userInfo` service](./user-info.md).

## Using the Service

In the following code examples, the `auth` and `httpAuth` variables are assumed
to be dependency-injected instances of the `coreServices.auth` and
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
      },
      async init({ auth, httpAuth, httpRouter }) {
        // Your code goes here
      },
    });
  },
});
```

### Getting Request Credentials

If you need to extract the validated credentials out of an incoming request, you
can do so like this:

```ts
router.get('/some-request', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  // Do something with the credentials here
});
```

The second argument is optional, but in this example we specified that we only
want to allow user based requests. The credentials returned will then have a
narrowed TypeScript type that reflects that the principal is known to be of the
user type. This second argument can also specify `allowLimitedAccess: true` if
you specifically built a plugin that deals with cookie based access, which is
rare.

The default is to accept both service and user credentials (excluding limited
access), but in the example above, any attempt to call this endpoint with
service credentials will result in an Unauthorized error being thrown.

:::note Note

You don't need to call `httpAuth.credentials` _just_ to ensure that incoming
credentials are valid in the first place; only use this method if you actually
need to act upon the credentials somehow. The Backstage backend framework will have
ensured the actual validity of any incoming token before your backend code is
reached. The policy for these upfront framework level rules is controlled using
[the `httpRouter` service](./http-router.md) when you register your routes.

:::

If you want to further work with the credentials object, [the `auth` service](./auth.md)
has helper methods for that.

### Issuing Cookies

For some rare use cases, plugins may want to issue cookies with _limited access_
user credentials. This is mostly relevant when browsers need to be able to
request static resources, such as in the TechDocs plugin.

Plugins should almost never interact with the cookie functionality of the
`httpAuth` service directly. The framework has builtin handling of cookie
creation/deletion requests on a dedicated well-known endpoint. All you normally
have to do to accept limited user access is to inform [the `httpRouter` service](./http-router.md)
when creating your route that you want to permit
cookie based access for a specific route, and then setting `allowLimitedAccess`
to `true` when extracting credentials.

Due to the above, we do not document the `httpAuth.issueUserCookie` method here.

## Configuring the service

:::note Note

The `httpAuth` service is not suitable for having its implementation replaced
entirely in your private repo. If you desire additional service auth related
features, don't hesitate to [file an issue](https://github.com/backstage/backstage/issues/new/choose)
or [contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) to the open source features.

:::

### Custom token extraction logic

In some cases, you might want to customize how tokens are extracted from incoming requests. It might be that you want to extract tokens from a different location in the request. To support this you supply your own slightly modified httpAuth service. The `DefaultHttpAuthService` class is exported from the `@backstage/backend-defaults` package and it's `create` method can be used to pass in a custom `getTokenFromRequest` extraction function.

```ts
import { DefaultHttpAuthService } from '@backstage/backend-defaults/httpAuth';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

export const customizedAuthServiceFactory = createServiceFactory({
  service: coreServices.httpAuth,
  deps: {
    auth: coreServices.auth,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
  },
  async factory({ auth, discovery, plugin }) {
    return DefaultHttpAuthService.create({
      auth,
      discovery,
      pluginId: plugin.getId(),
      getTokenFromRequest: req => {
        let token: string | undefined;
        const header = req.headers.some_random_header;
        if (typeof header === 'string') {
          const parts = header.split(' ');
          if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
          }
        }
        return { token };
      },
    });
  },
});
```

This service has no configuration options, but it abides by the policies you
have set up using [the `httpRouter` service](./http-router.md) for your routes,
if any.
