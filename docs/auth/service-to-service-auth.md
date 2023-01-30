---
id: service-to-service-auth
title: Service to Service Auth
# prettier-ignore
description: This section describes how to use service to service authentication, both internally within Backstage plugins and towards external services.
---

This article describes the steps needed to introduce _backend-to-backend auth_.
This allows plugin backends to determine whether a given request originates from
a legitimate Backstage plugin (or other external caller), by requiring a special
type of service-to-service token which is signed with a shared secret.

When enabling this protection on your Backstage backend plugins, for example the
catalog, other callers in the ecosystem such as the search indexer and
scaffolder would need to present a valid token to the catalog to be able to
request its contents.

## Setup

In a newly created Backstage app, the backend is setup up to not require any
auth at all. This means that generated service-to-service tokens are empty, and
that incoming requests are not validated. If you want to enable
service-to-service auth, the first step is to switch out the following line in
your backend setup at `packages/backend/src/index.ts`:

```diff
- const tokenManager = ServerTokenManager.noop();
+ const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
```

By switching from the no-op `ServiceTokenManager` to one created from config,
you enable service-to-service auth for any plugin that implements it. The local
development setup will generally not be impacted by this, as temporary keys are
generated under the hood. But for the production setup, this means you must now
provide a shared secret that enables your backend plugins to communicate with
each other.

Backstage service-to-service tokens are currently always signed with a single
secret key. It needs to be shared across all backend plugins and services that
ones wishes to communicate across. The key can be any base64 encoded secret.
The following command can be used to generate such a key in a terminal:

```bash
node -p 'require("crypto").randomBytes(24).toString("base64")'
```

Then place it in the backend configuration, either as a direct value or
injected as an env variable.

```yaml
# commonly in your app-config.production.yaml
backend:
  auth:
    keys:
      - secret: <the string returned by the above crypto command>
    # - secret: ${BACKEND_SECRET} - if you want to use an env variable instead
```

**NOTE**: For ease of development, we auto-generate a key for you if you haven't
configured a secret in dev mode. You _must set your own secret_ in order for
backend-to-backend auth to work in production; the `ServiceTokenManager` will
throw an exception in production if it has no keys to work with, which will lead
to the backend failing to start up.

## Usage in Backend Plugins

There are a few steps if you want to make use of the service-to-service auth in
your own backend plugin. First you need to add the `TokenManager` dependency to
the `createRouter` options. Typically as `tokenManager: TokenManager`. Along
with this you'll need to ask users to start providing this new dependency in
their backend setup code.

Once the `TokenManager` is available, you use the `.getToken()` method to generate
a new token for any outgoing requests towards other Backstage backend plugins.
This method should be called for every request that you make; do not store the
token for later use. The `TokenManager` implementations should already cache
tokens as needed. The returned token should then be added as a `Bearer` token
for the upstream request, for example:

```ts
const { token } = await this.tokenManager.getToken();

const response = await fetch(pluginBackendApiUrl, {
  method: 'GET',
  headers: {
    ...headers,
    Authorization: `Bearer ${token}`,
  },
});
```

To authenticate an incoming request you use the `.authenticate(token)` method.
At the time of writing this method doesn't return anything, it will simply
throw if the token is invalid.

```ts
await tokenManager.authenticate(token); // throws if token is invalid
```

## Usage in External Callers

If you have enabled server-to-server auth, you may be interested in generating
tokens in code that is external to Backstage itself. External callers may even
be written in other languages than Node.js. This section explains how to generate
a valid token yourself.

The token must be a JWT with a `HS256` signature, using the raw base64 decoded
value of the configured key as the secret. It must also have the following payload:

- `sub`: "backstage-server" (only this value supported currently)
- `exp`: one hour from the time it was generated, in epoch seconds

> NOTE: The JWT must encode the `alg` header as a protected header, such as with
> [setProtectedHeader](https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#setprotectedheader).

## Granular Access Control

We plan to build out the service-to-service auth to be much more powerful in the
future, but before that is done there are a few tricks you can use with the
current system to harden your deployments. This section assumes that you have
already split your backend plugins into more than one backend deployment, in
order to scale or isolate them.

The backend auth configuration has support for providing multiple keys, for
example:

```yaml
backend:
  auth:
    keys:
      - secret: my-secret-key-1
      - secret: my-secret-key-2
      - secret: my-secret-key-3
```

The first key will be used for signing requests, while all of the keys will be
used for validation. This means that you can set up an asymmetric configuration
where some backend deployments do not have access to each other.

For example, consider the case where we have split up the catalog, scaffolder,
and search plugin into three separate backend deployments. We can use the
following configurations to allow both the scaffolder and search plugin to speak
to the
catalog, but not the other way around, and to not allow any communication between
the scaffolder and search plugins.

```yaml
# catalog config
backend:
  auth:
    keys:
      - secret: my-secret-key-catalog
      - secret: my-secret-key-scaffolder
      - secret: my-secret-key-search

# scaffolder config
backend:
  auth:
    keys:
      - secret: my-secret-key-scaffolder

# search config
backend:
  auth:
    keys:
      - secret: my-secret-key-search
```
