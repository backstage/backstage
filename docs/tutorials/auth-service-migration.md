---
id: auth-service-migration
title: Migrating to New Auth Services
description: A guide for how to migrate Backstage backend plugins and modules to use the new auth services
---

The auth services for the Backstage backend system have been reworked in the 1.24 release. Among other improvements, this brings protection by default for Backstage backends, replacing the [authenticate-api-requests.md](https://github.com/backstage/backstage/blob/9aac2b0d36bdb8095ea747fe5e5490cfea1c9f16/contrib/docs/tutorials/authenticate-api-requests.md) guide in contrib. This guide will help you migrate your existing backend setup as well as backend _plugins and modules_ to use the new auth services.

The change with the most impact that accompanies the new auth services is the default behavior of all plugins running in the new backend system to block all requests that are not authenticated as a user or service, also known as the _default auth policy_. This is the only breaking production change introduced as part of this update, and may require action to be taken on both backend installations and plugins. More on that in the individual sections below.

## Backend migration

In order to use these new services your backend needs to be using the [new backend system](../backend-system/building-backends/01-index.md). If your backend is running the old system, you will need to [migrate it to the new system first](../backend-system/building-backends/08-migrating.md).

If you have [authenticate-api-requests.md](https://github.com/backstage/backstage/blob/9aac2b0d36bdb8095ea747fe5e5490cfea1c9f16/contrib/docs/tutorials/authenticate-api-requests.md) installed in your backend, you should generally remove it and rely on the new auth services instead. If you do not wish to make that change yet but still want to upgrade to the latest release of Backstage, you can also leave it in place and instead disable the default auth policy as described in the next section.

### Disabling the default auth policy

If you do not want to enforce authentication of requests by default, you can disable the default auth policy. This is done using the following configuration:

```yaml
backend:
  auth:
    dangerouslyDisableDefaultAuthPolicy: true
```

Please note that this functionality will be removed in a future release, and you should migrate to using the new auth services as soon as possible or you would have to support your own service for issuing tokens.

In short, this will allow requests through to plugins in your backend, even if they do not include any credentials. The requests will still be treated as unauthenticated however, which not all plugin endpoints may accept. For more information on the impact of this configuration, see the [auth service documentation](../backend-system/core-services/auth.md).

### Migrating the backend

If you do want to keep the default auth policy in effect, there is some minor action needed to migrate the backend itself. Be sure to upgrade all plugins to their latest versions to pick up any updates that may be needed for the new auth services. If you have any internal plugins or modules, refer to the plugin migration section below.

With the default auth policy in effect you will now need to ensure that the requests to your backend are authenticated, also during local development. If you already have a setup where you use an auth provider for local development, you can keep using that. But, if you rely on the `'guest'` access for local development we recommend that you install the new guest provider module in your auth backend:

```sh
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-guest-provider
```

Add it to your backend:

```ts title="packages/backend/src/index.ts"
// highlight-add-next-line
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
```

Lastly, add the following to your development configuration:

```yaml
auth:
  providers:
    guest: {}
```

Make sure that you only enable the guest provider for local development, and not in production. It will refuse to be enabled in production by default, but it is still best to avoid it entirely. If you do not have a separate development configuration, add the following to your production configuration:

```yaml
auth:
  providers:
    guest: null
```

If you still want to enable guest login in non-development environments, you can use this config snippet:

```yaml
auth:
  providers:
    guest:
      dangerouslyAllowOutsideDevelopment: true
```

That's all you need for guest authentication! The default `SignInPage` from `@backstage/core-components` will detect and use the guest provider if it's enabled.

Since the default auth policy is in effect for all plugins running in the new backend system, you do not need to worry about whether individual plugins are protected or not. The impact of plugins not yet being migrated is that they may have endpoints that should allow unauthenticated requests, but are now blocked by the default auth policy. If you want to temporarily work around this for individual plugins, you can install a module for the plugin that adds the required policy via the [http router service](../backend-system/core-services/http-router.md).

If you have a custom [identity](../backend-system/core-services/identity.md) or [token manager](../backend-system/core-services/token-manager.md) service implementations you can use the `createLegacyAuthAdapters` helper from `@backstage/backend-common` to adapt them for the new auth services.

## Plugin & Module migration

This part of the guide will help you migrate your backend plugin or module to using the new auth APIs. It is split into two main sections: the first is to add any required auth policies to your plugin for the new backend system, and the second is to migrate to use the new auth services. This first step more urgent and may be required for your plugin to keep functioning in the new backend system, while the second step is less urgent and won't be required until support for the old auth services is removed.

### Adding auth policies

If your plugin supports the [new backend system](../backend-system/index.md) you may need to add exceptions to the default auth policy. If your plugins is supposed to accept unauthenticated requests or requests authenticated with a user cookie, then you need to add a policy for that. This is done using the `httpRouter` service. For example, the following allows unauthenticated requests to the `/health` endpoint:

```ts
export default createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({ config, logger, httpRouter, auth, httpAuth }) {
        httpRouter.use(await createRouter({ config, logger, auth, httpAuth }));

        // highlight-add-start
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        // highlight-add-end
      },
    });
  },
});
```

### Using the new auth services

The goal in this section is to completely remove usages of the existing [identity](../backend-system/core-services/identity.md) and [token manager](../backend-system/core-services/token-manager.md) services from inside your plugin, and instead use the new [auth](../backend-system/core-services/auth.md) and [http auth](../backend-system/core-services/http-auth.md) services. You plugin may still accept the `identity` and `tokenManager` services as optional dependencies from the plugin environment though, in order to avoid breaking the setup for existing users.

If your plugin does not currently rely on the `identity` or `tokenManager` services or uses the `DefaultIdentityClient` internally, then this step is not required and no further action is needed.

This guide assumes that your plugin uses the `createRouter` pattern as its external API for the old backend system. If you have different and/or other external API surfaces they should be treated in the same way, but you may need to adapt these examples to fit your implementation.

#### Updating dependencies in the new backend system

If your plugin supports the new backend system, the first step of the migration is to make sure that we use the new auth services. For now we will add both `AuthService` and `HttpAuthService`, but it may be that you only need one of them in the end, in which case you can remove the other.

```ts
export default createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
        // highlight-remove-start
        identity: coreServices.identity,
        tokenManager: coreServices.tokenManager,
        // highlight-remove-end
        // highlight-add-start
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        // highlight-add-end
      },
      async init({
        config,
        logger,
        discovery,
        httpRouter,
        // highlight-remove-start
        identity,
        tokenManager,
        // highlight-remove-end
        // highlight-add-start
        auth,
        httpAuth,
        // highlight-add-end
      }) {
        const router = await createRouter({
          config,
          logger,
          discovery,
          // highlight-remove-start
          identity,
          tokenManager,
          // highlight-remove-end
          // highlight-add-start
          auth,
          httpAuth,
          // highlight-add-end
        });
        httpRouter.use();
      },
    });
  },
});
```

Don't worry if your plugin doesn't currently depend on the `identity` or `tokenManager` service, that can be ignored. However, if your plugin doesn't already depend on the `discovery` service you will need to add that as a required dependence, as it is needed for the compatibility layer that we will introduce.

#### Making the new auth services available in `createRouter`

In order to make the new auth services available to the plugin implementation in a backwards compatible way, we use the `createLegacyAuthAdapters` helper from `@backstage/backend-common`. This helper accepts both the old and new auth services, and returns implementations for the new ones. If provided with implementations for the new services it will pass them through directly, which is what we want for the new backend system. If the new services are not provide it will instead create fallback implementations using the old services, falling back to default implementations of the old services if they are not available either.

In practice, this is what it might look like to apply this change to the `createRouter` function:

```ts
export interface RouterOptions {
  config: RootConfigService;
  logger: LoggerService;
  discovery: DiscoveryService;
  identity?: IdentityService;
  // highlight-add-start
  auth?: AuthService;
  httpAuth?: HttpAuthService;
  // highlight-add-end
}

export function createRouter(options: RouterOptions) {
  // highlight-add-next-line
  const { auth, httpAuth } = createLegacyAuthAdapters(options);

  // ... the rest of the implementation
}
```

Note that if your `createRouter` function doesn't already accept the `identity` or `tokenManager` services, you should **not** add them. Likewise, if there is any default implementation used by your plugin for either of those services, then that implementation **must** be passed on to `createLegacyAuthAdapters`. Both of these constraints ensure that your plugin will continue to behave in the same way as before.

As mentioned earlier, you may end up not needing both `auth` and `httpAuth` in the implementation. If that is the case you should remove the unused one from the router options.

#### Replacing old auth service calls

Once the `auth` and `httpAuth` services are available in the plugin implementation, what's left is to replace existing usage of the `identity` and `tokenManager` services. In this section we'll walk through and explain the most common usages of the existing services, and how to migrate those to use the new services instead.

##### Example 1: Making a standalone service-to-service request

To generate a new service token for a service-to-service request that is not in a request path or needs elevated privileges, you would previously use the following:

```ts
const { token } = await tokenManager.getToken();
```

The equivalent using the new auth services is the following:

```ts
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: await auth.getOwnServiceCredentials(),
  targetPluginId: '<plugin-id>', // e.g. 'catalog'
});
```

The `onBehalfOf` option provides the credentials we want to use for the request. Here we use the plugin's own credentials, but in other places you'll see how it is also used to forward the credentials from incoming requests.

The `targetPluginId` is a new requirement that allows for a more fine-grained control of service-to-service auth. When generating a new token for a service-to-service request, you must now specify the ID of the plugin that you want to make the request towards.

##### Example 2: Forwarding credentials from an incoming request

Reading the credentials from an incoming request typically looked like this:

```ts
router.get('/example/:entityRef', async (req, _res) => {
  const token = getBearerTokenFromAuthorizationHeader(
    req.header('authorization'),
  );

  // Some followup call using the token, for example using the catalog client
  const entity = await catalogClient.getEntityByRef(req.params.entityRef, {
    token,
  });

  // Or forwarding the token to evaluate permissions
  await permissions.authorize(
    [{ permission: examplePermission, resourceRef: entityRef }],
    { token },
  );
});
```

The new auth services intentionally add an additional step to this process, in order to avoid direct forwarding of both user and service tokens in upstream requests. You now instead first extract the credentials from the incoming requests, and then use those credentials to generate new tokens for upstream requests.

With the new auth services, the above example now looks like this:

```ts
router.get('/example/:entityRef', async (req, _res) => {
  const credentials = await httpAuth.credentials(req);

  // The catalog client only accepts tokens right now, it will be updated
  // to accept credentials directly in the future.
  // For now we will need to issue a new token to pass to the catalog client.
  const { token } = await auth.getPluginRequestToken({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });
  const entity = await catalogClient.getEntityByRef(req.params.entityRef, {
    token,
  });

  // The permissions service accepts credentials directly
  await permissions.authorize(
    [{ permission: examplePermission, resourceRef: entityRef }],
    { credentials },
  );
});
```

Note that for the above `permissions` call to work you will need to update your plugin to depend on the `PermissionsService` from `@backstage/backend-plugin-api`, rather than `PermissionEvaluator`.

As a general pattern you will want to refactor your plugin so that it forwards the `BackstageCredentials` objects as far as possible, only generating tokens immediately before they are used.

##### Example 3: Getting the user identity from a request

To get the user identity from an incoming request you would previously use the `identity` service:

```ts
router.get('/example/by-user', async (req, _res) => {
  const user = await identity.getIdentity({ request: req });

  if (!user) {
    throw new AuthenticationError();
  }

  console.log(`User ${user.identity.userEntityRef} is making a request`);
});
```

The equivalent using the new auth services is the following:

```ts
router.get('/example/by-user', async (req, _res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });

  console.log(
    `User ${credentials.principal.userEntityRef} is making a request`,
  );
});
```

In the above code the `allow` option of the `credentials` call is used to narrow down the accepted user credentials. If the incoming requests is not authenticated as a user, the `credentials` call will throw an error.

If your existing code do not require an authenticated user but only uses it if available, you can instead pass `allow: ['user', 'service', 'none']` to the `credentials` call and then check the `credentials.principal.type`.
