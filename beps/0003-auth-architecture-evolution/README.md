---
title: Auth Architecture Evolution
status: provisional
authors:
  - '@Rugvip'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: 2024-01-28
---

# BEP: Auth Architecture Evolution

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

This proposal outlines a new architecture for authenticating users and services in Backstage. It adds built-in access restriction to Backstage instances that protects them from outside access, and enables more granular access control for inter-plugin communication and access from external services.

It proposes a new `AuthService` interface that handles all user and service authentication and token management available to plugins, as well as a new `HttpAuthService` interface that is a higher level service used to protect endpoints of plugin routers. The `auth-backend` will also be extended to support issuing of user tokens with a reduced scope for cookie-based authentication of requests.

The changes to the service-to-service auth are aimed to be the minimum needed to get the necessary interfaces in place, and will rely on the existing symmetrical keys for now.

## Motivation

This proposal aims to address several of the points in the [Auth Meta issue](https://github.com/backstage/backstage/issues/15999), with the overarching goal being to replace the existing [API request authentication](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md) tutorial in `contrib/` with a more robust and secure built-in solution. The tutorial exists for two purposes: to add authentication of API requests as part of using the permission system in Backstage, and to protect a Backstage instance from external access. It does a fairly good job of the former, although we want to avoid placing user tokens in cookies, but it does a quite poor job of the latter, which we want to fix.

A secondary goal is to do this work before stabilizing the APIs in the new Backend system, as it will have some impact on how plugin backends are built. This will inevitably also lead to the need to improve the way that service-to-service auth is handled in Backstage, although that is not the primary goal of this work.

By providing protection of Backstage instances out of the box we drastically reduce both the barrier of entry as well as security risks for Backstage adopters. It will no longer be a requirement to either set up protection of your Backstage instance or not do so and risk exposing your instance to malicious actors. It also drastically reduces the complexity of enabling the permission system of Backstage, since access restrictions are already built-in.

### Goals

The following goals are the primary focus of this BEP:

- Built-in protection of Backstage instances such that it is safe to deploy Backstage directly towards the internet.
  - Protection of the frontend app bundle from being accessed by unauthenticated users.
  - Basic rate limiting of non-authenticated requests.
  - Cookie-based authentication of requests for static assets that protects against CSRF attacks and does not unnecessarily expose user tokens.
  - A solution where plugin builders need to opt-out of endpoint protection, for example allowing cookie or unauthenticated access.
- Basic improvements to the service-to-service auth service interfaces such that we are confident that we do not need to break them in the near future.
  - If possible we will keep using the existing symmetrical keys that are used today, but it is likely that we will need to break compatibility of existing tokens.
  - Encapsulation of user credentials in upstream service requests, avoiding the pattern where backend plugins re-use the user token directly for their outgoing requests.
- Separate out the ownership information out of the Backstage user tokens, since user tokens have been growing large enough to have an impact on performance and reliability.

### Non-Goals

- No advanced rate limiting or other protection against DDoS attacks. If this is a concern then adopters should still use other external technologies to protect access to their Backstage instance.
- As part of the immediate work we will only add as much support for service-to-service auth as is needed for a stable API, and not necessarily make it very capable from the start.

## Proposal

Two new backend service interfaces are introduced to support these new features. The new `AuthService` is a low-level service that encapsulates authentication and creation of bearer tokens for all types of Backstage identities, including user, service, and services making requests on behalf of users. The new `HttpAuthService` is a higher level service that lets you access the credentials and identity of incoming requests, and issue credentials for outgoing requests. These new services replace the existing `IdentityService` and `TokenManagerService`

The proposed design leaves the decision for how different endpoints are protected to the implementation of the plugin backends themselves. This includes whether particular routes should allow anonymous access, access from users authenticated via a cookie, or perhaps only allow access from other plugin backends and external services. This means that integrators do not need to - and do not have the ability to - configure access controls of individual endpoints, except for what the permission system already provides, and what is made available through static configuration or extension points.

In order to allow for cookie-based authentication of incoming user requests, the `auth` plugin backend is extended to be able to issue user tokens with reduced scope, which in turn integrate with the new `AuthService` and `HttpAuthService`. The ability to use cookie auth for requests is an opt-in per route and is only be permitted for read methods (`GET`, `HEAD`, `OPTIONS`). The actual implementation of cookie-based flows will be up to each plugin, but with significant help from the new auth service interfaces.

In order to allow either unauthenticated access or cookie-based access, a plugin must explicitly opt-in the specific path prefixes that these should be available at. This is done through a new method that is added to the `HttpRouterService` interface.

For service-to-service communication we will move away from reusing user tokens in upstream requests. We will instead implement an "On-Behalf-Of" flow where incoming user credentials are encapsulated in a service token for the upstream request. In line with this the new auth service interfaces will aim to make it difficult to directly forward credentials from incoming requests, and instead encourage that plugin backends issue new service credentials for upstream requests.

An issue that has been identified in the current auth implementation is that the user information embedded in the Backstage user tokens can grow fairly large. In order to avoid that this becomes a widespread problem, especially as we implement cookie auth with a 4kb size limit, we will remove the ownership entity refs (`ent` claim) from the user tokens. There were already very few consumers of this information in practice - only the `permission-backend` and `signal-backend` plugin packages currently rely on this information. The ownership data will instead be available via a new `UserInfoService`, owned by the `auth-backend`. The implementation of this new service will keep relying on the `ent` claim of the user token initially, but we will also implement a new `/v1/userinfo` endpoint in the `auth-backend` that will migrate to transparently in the future.

## Design Details

### `AuthService` Interface

The new `AuthService` interface is defined as follows:

```ts
// These credential types are opaque and will also store some internal information, for example bearer tokens

export type BackstageUserCredentials = {
  $$type: '@backstage/BackstageCredentials';

  type: 'user';

  userEntityRef: string;
};

export type BackstageServiceCredentials = {
  $$type: '@backstage/BackstageCredentials';

  type: 'service';

  // Exact format TBD, possibly 'plugin:<pluginId>' or 'external:<externalServiceId>'
  subject: string;

  // Not implemented in the first iteration, but this is how we might extend this in the future
  permissions?: string[];
};

type BackstageCredentials =
  | BackstageUserCredentials
  | BackstageServiceCredentials;

export interface AuthService {
  authenticate(token: string): Promise<BackstageCredentials>;

  // TODO: should the caller provide the target plugin ID?
  // TODO: how can we make it very difficult to forget to forward credentials
  issueToken(credentials: BackstageCredentials): Promise<{ token: string }>;
}
```

### `UserInfoService` Interface

The new `UserInfoService` interface is defined as follows:

```ts
export interface UserInfoService {
  getUserInfo(
    credentials: BackstageUserCredentials,
  ): Promise<{ ownershipEntityRefs: string[] /* profile info too? */ }>;
}
```

The `UserInfoService` is exported by `@backstage/auth-node`, and the initial implementation will simply read the ownership refs from the `ent` claim of the underlying token of the user credentials. The next iteration will instead call the `/v1/userinfo` endpoint of the `auth-backend`, once that has been implemented.

### `HttpRouterService` Interface

> Open question: Should this instead be added to the `HttpAuthService`? It may fit a bit better there, but on the other hand it might make sense to add additional policies unrelated to authentication too, such as rate limiting.

The `HttpRouterService` interface will be extended with the ability to opt-out of the default protection of endpoints, enabling either cookie auth or unauthenticated access.

```ts
export interface HttpRouterService {
  // All routes only allow authenticated users and services by default.
  use(handler: Handler): void;

  // Exact option structure is TBD, just highlighting the general idea for now
  configure(options: {
    allowCookieAuthOnPaths?: string[];
    allowUnauthenticatedAccessPaths?: string[];
  }): void;
}
```

### `HttpRouterService` Usage Patterns

All of these usages patterns are from the perspective of a plugin backend.

#### Standard plugin that only allows access from authenticated users and services

```ts
export default createBackendPlugin({
  pluginId: 'todo',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
      },
      async init({ http }) {
        http.use(await createRouter(/* ... */));
      },
    });
  },
});
```

This is expected to be the pattern for the vast majority of plugins.

#### A plugin with an endpoint that only allows cookie auth

```ts
export default createBackendPlugin({
  pluginId: 'techdocs',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
      },
      async init({ http }) {
        // The order of these two calls does not matter
        http.use(await createRouter(/* ... */));
        http.configure({
          allowCookieAuthOnPaths: ['/static'],
        });
      },
    });
  },
});
```

#### A plugin that allows both public access and cookie auth

```ts
export default createBackendPlugin({
  pluginId: 'app',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
      },
      async init({ http }) {
        http.use(await createRouter(/* ... */));
        http.configure({
          allowCookieAuthOnPaths: ['/'],
          // Unauthenticated access takes precedence, the /public endpoint does not require cookie auth
          allowUnauthenticatedAccessPaths: ['/public'],
        });
      },
    });
  },
});
```

### `HttpAuthService` Interface

The new `HttpAuthService` interface is defined as follows:

```ts
export type BackstageUnauthorizedCredentials = {
  $$type: '@backstage/BackstageCredentials';

  type: 'unauthorized';
};

type BackstageCredentialTypes = {
  user: BackstageUserCredentials;
  service: BackstageServiceCredentials;
  unauthorized: BackstageUnauthorizedCredentials;
};

export interface HttpAuthService {
  createHttpPluginRouterMiddleware(options: OptionsTBD): Handler;

  credentials<TAllowed extends keyof BackstageCredentialTypes>(
    req: Request,
    options?: HttpAuthServiceMiddlewareOptions<TAllowed>,
  ): Promise<BackstageCredentialTypes[TAllowed]>;

  // TODO: Keep an eye on this, might not be needed
  requestHeaders(
    credentials: BackstageCredentials,
  ): Promise<Record<string, string>>;

  issueUserCookie(res: Response): Promise<void>;
}
```

### `AuthService`, `HttpAuthService` and `UserInfoService` Usage Patterns

All of these usages patterns are from the perspective of a plugin backend.

#### Authenticate incoming request that requires user authentication

```ts
// All routes only allow authenticated users and services by default.
router.get('/read-data', (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] }); // throws if not: user (or obo), user-cookie
  const { ownershipEntityRefs } = await userInfo.getUserInfo(credentials);
  console.log(
    `User ref=${credentials.userEntityRef} ownership=${ownershipEntityRefs} claims=${credentials.extraClaims}`,
  );
  // ...
});
```

#### Forward the user credentials from an incoming requests to upstream plugin backend

```ts
class CatalogIntegration {
  async getEntity(
    res: string,
    options: {
      credentials: BackstageUserCredentials | BackstageServiceCredentials;
    },
  ) {
    return catalogClient.getEntityByRef(req.params.entityRef, {
      token: await auth.issueToken({
        forward: options.credentials,
      }),
    });
  }
}

// Earlier in the router setup
const catalogIntegration = new CatalogIntegration();

router.get('/read-data', (req, res) => {
  // The catalogClient will have a reference to the (plugin scoped) HttpAuthService,
  // which it uses to create the credential headers for the upstream request.
  const entity = await catalogClient.getEntityByRef(req.params.entityRef, {
    credentials: httpAuth.forwardCredentials(req, {
      dangerouslyAllowUnauthenticated: true,
    }),
  });

  // TODO: try this out in more places in plugins
  const entity = await catalogIntegration.getEntity(req.params.entityRef, {
    credentials: await httpAuth.credentials(req),
  });
  // ...
});
```

#### Allow both user and service request

```ts
router.get('/read-data', (req, res) => {
  const credentials = await httpAuth.credentials(req, {
    allow: ['user', 'service'],
  });
  if (credentials.type === 'user') {
    res.json(todoStore.listOwnedTodos({ owner: credentials.userEntityRef }));
  } else {
    res.json(
      todoStore.listTodos({
        serviceId: credentials.subject,
      }),
    );
  }
});
```

#### Issuing a cookie and allowing user cookie auth on a separate endpoint

```ts
router.get('/cookie', async (req, res) => {
  await httpAuth.issueUserCookie(res); // If this is a service call it'll throw
  res.json({ ok: true });
});

// Allowing cookie auth is a separate step where you call the configure method
// of the httpRouter API in your plugin setup code.
httpRouter.configure({
  // In practice we can make this configuration a lot more capable, this is just a minimal example
  allowCookieAuthOnPaths: ['/static'], // router.use('/static', cookieAuthMiddleware()) under the hood
});

// Separate endpoint that serves static content, allowing user cookie auth as
// well as the default user and service auth methods
router.use('/static', express.static(staticContentDir));
```

#### Passing along user identity from a cookie in an upstream request

```ts
router.get(
  '/read-data',
  httpAuth.middleware({ allow: ['user-cookie'] }),
  (req, res) => {
    // These credentials don't actually contain an underlying user token for cookie-authed requests
    // If you try to pass them to the AuthService, it'll throw.
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const { ownershipEntityRefs } = await userInfo.getUserInfo(credentials);
    console.log(
      `User ref=${credentials.userEntityRef} ownership=${ownershipEntityRefs}`,
    );
    // ...
  },
);
```

## Release Plan

The existing `IdentityService` and `TokenManagerService` will be deprecated and instead implemented in terms of the new `AuthService`.

The release plan for the `HttpAuthService` is TBD, but is likely to be shipped as a no-op for plugins using the old backend system. The goal is for all plugins using the new backend system to have endpoint security be opt-out, which will be a breaking change.

### Implementation Tasks

- [ ] Implement `AuthService`
- [ ] Implement `HttpAuthService` - leave cookie auth as unimplemented for now
- [ ] Add `configure()` for `HttpRouterService`, using `HttpAuthService`
- [ ] Implement a compatibility wrapper in `backend-common` that accepts `AuthService`, `HttpAuthService`, `IdentityService`, and `TokenManagerService` (all optional), and returns implementations for `AuthService` and `HttpAuthService`, such hat existing plugins can use a single `createRouter` implementation for both the old and new backend systems.
- [ ] Implement `UserInfoService` in `@backstage/auth-node` - for now it will just extract the ownership entity refs from the token stored in the credentials
- [ ] Implement cookie auth in `HttpAuthService` - just put the user token in the cookie for now
- [ ] Migrate plugins:
  - [ ] Permission backend
  - [ ] TechDocs backend
  - [ ] App backend

## Dependencies

No significant dependencies have been identified for this work, although any future security audits of Backstage are considered dependent on this work.

## Alternatives

An alternative to built-in protection from external access would be to keep relying on external mechanisms to protect access to Backstage. We feel that this is a suboptimal solution since it adds complexity to the adoption of Backstage, and increases the risk of misconfiguration and security breaches. Regardless of whether we add built-in protection or not the ability to protect API endpoints needs to be addressed in some way, since it is a requirement for the permission system to work. This means that the extra steps to ensure protection out of the box are fairly minimal when looking at just the delta for protecting API access.

### Access Control Patterns

These are the different patterns that we've considered for how plugins should control access to their endpoints.

#### Separate methods / configuration for `use`

This approach extends the `HttpRouterService` with separate methods or options for specifying the access control for different handlers.

Pros:

- We can make strict access control the default, making relaxed controls an opt-in
- The routing setup is quite explicit in what handlers allow for what access levels

Cons:

- Forces separation of the router, splitting it into separate handlers for different levels of access.
- Can be extremely confusing because the top-level middleware for more lax access will also apply to the more strict access levels. For example

  ```ts
  const cookieRouter = Router();
  cookieRouter.use(rateLimit());
  http.useWithCookieAuthentication(cookieRouter);

  const mainRouter = Router();
  // rateLimit() will apply here too
  http.use(mainRouter);
  ```

This applied to any similar way of structuring this API, such as a single `.use()` method with additional options:

```ts
http.use(cookieRouter, { allow: ['user-cookie'] });
```

#### Separate configuration on different paths for `use`

Similar to the previous approach, but also require that a path is provided. This removes much of the confusion around what middleware are applied.

The downside of this approach is that it still has the drawback of forcing a separation of the router, but at the same it provides very little benefit over a top-level path configuration approach like `http.configure()`. The `'/static'` path in the below example essentially has the exact same logic as `.configure({ cookieAuthPaths: ['/static'] })` since it'd be implemented in the same way. The `.configure()` approach has the benefit of allowing plugin authors to decide whether they want to keep the routes separate or not.

This does have the benefit of letting the framework know which exact routes are protected, which can be useful for introspection, although that benefit also applies to the `.configure()` approach.

```ts
// This isn't too bad, but it's extremely similar to the configure() method since
// we're just matching on the path. The benefit of configure is that it allows you
// to keep everything in a singe router if desired.
http.use('/static', cookieRouter, { allow: ['user-cookie'] });
```

#### Complete opt-out

This approach simply enabled plugins to opt-out of the default access control, and instead require that they implement the necessary endpoint protection using `httpAuth.middleware()`.

This approach makes it a bit easier to make mistakes compared to the `.configure()` approach, but at the same time it has the benefit of collection all access control login in a single place (the plugin router). It also doesn't allow the framework to see which endpoints have relaxed protection, which is a downside.

Still, this is a pattern that is currently second in line if we don't go with the `.configure()` approach.

```ts
http.dangerouslyDisableAuthentication();
```

#### Leave access control to the plugin router

Having strict access control be the default with explicit opt-out is an explicit goal of this work, so this is not an option that we are considering.
