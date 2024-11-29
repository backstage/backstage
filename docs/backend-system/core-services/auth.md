---
id: auth
title: Auth Service
sidebar_label: Auth
description: Documentation for the Auth service
---

This service deals with the generation and verification of tokens and their
associated representations as credentials objects. You can use it for validating
incoming tokens, and generating tokens for calling other services.

If you want to deal with credentials specifically in the HTTP request/response
flow, see also [the `httpAuth` service](./http-auth.md). If you want to extract
more details about authenticated users such as their ownership entity refs, use
[the `userInfo` service](./user-info.md).

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

### Creating Request Tokens

If you need to create a token that can be used for making a request to another
backend plugin:

```ts
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: await auth.getOwnServiceCredentials(),
  targetPluginId: 'catalog',
});
```

:::note Note

Never store and reuse tokens. Always call `getPluginRequestToken` immediately
before making a request. Otherwise you run the risk of running into permission
problems when expired tokens are being used for requests.

:::

This example is suitable when you need to make the request "as your own plugin",
i.e. when your code is the original initiator of the call. An example of this
could be periodic batch processes that index content in another service.

In situations where you are making a call on-behalf-of someone else, for example
when making upstream requests inside a request handler, please always instead
use the extracted credentials from the request.

```ts
router.get('/makes-calls', async (req, res) => {
  const { token } = await auth.getPluginRequestToken({
    onBehalfOf: await httpAuth.credentials(req),
    targetPluginId: 'catalog',
  });
});
// make a call using the token
```

This ensures that the original caller and their associated permissions are
properly carried along with the request chain. See [the `httpAuth` service docs](./http-auth.md)
for more details.

The [service to service auth docs](../../auth/service-to-service-auth.md)
contain more details about how to properly use tokens in your HTTP request
paths.

### Authorizing Tokens

Most plugins should not deal with incoming request tokens directly at all, but
rather use [`httpAuth.credentials`](./http-auth.md) instead as part of their
request handlers. But in the rare cases where you are holding an incoming token
and want to validate it and turn it into a credentials object, you can do so:

```ts
const credentials = await auth.authenticate(token);
```

There is an optional second parameter that you can set to `{ allowLimitedAccess:
true }` if you specifically built a plugin that deals with cookie based access,
which is rare.

### Inspecting Credentials

The `auth` service also contains facilities for working with credentials
objects. For example checking what type of principal (caller type - e.g. user or
service) they represent. For example:

```ts
if (auth.isPrincipal(credentials, 'user')) {
  // In here, the TypeScript type of the credentials object has been properly
  // narrowed to `BackstageCredentials<BackstageUserPrincipal>` so you can
  // access its specific properties such as `credentials.principal.userEntityRef`.
}
```

## Configuring the service

:::note Note

The `auth` service is not suitable for having its implementation replaced
entirely in your private repo. If you desire additional service auth related
features, don't hesitate to [file an issue](https://github.com/backstage/backstage/issues/new/choose)
or [contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) to the open source features.

:::

For configuring service-to-service access methods, see [the auth docs](../../auth/service-to-service-auth.md).

The default auth policy requires all requests to be authenticated with either
user or service credentials. This can be disabled by setting the
`backend.auth.dangerouslyDisableDefaultAuthPolicy` app-config flag to `true`.
Disabling this check means that the backend will no longer block unauthenticated
requests, but instead allow them to pass through to plugins. Do not do this in
production unless absolutely necessary.

If permissions are enabled, unauthenticated requests will be treated exactly as
such, leaving it to the permission policy to determine what permissions should
be allowed for an unauthenticated identity. Note that this will also apply to
service-to-service calls between plugins unless you configure credentials for
service calls.
