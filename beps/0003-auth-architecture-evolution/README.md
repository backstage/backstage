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
- Basic improvements to the service-to-service auth service interfaces such that we are confident that we do not need to break them in the near future.
  - If possible we will keep using the existing symmetrical keys that are used today, but it is likely that we will need to break compatibility of existing tokens.
  - Encapsulation of user credentials in upstream service requests, avoiding the pattern where backend plugins re-use the user token directly for their outgoing requests.

### Non-Goals

- No advanced rate limiting or other protection against DDoS attacks. If this is a concern then adopters should still use other external technologies to protect access to their Backstage instance.
- As part of the immediate work we will only add as much support for service-to-service auth as is needed for a stable API, and not necessarily make it very capable from the start.

## Proposal

Two new backend service interfaces are introduced to support these new features. The new `AuthService` is a low-level service that encapsulates authentication and creation of bearer tokens for all types of Backstage identities, including user, service, and services making requests on behalf of users. The new `HttpAuthService` is a higher level service that lets your create [express middleware](https://expressjs.com/en/guide/using-middleware.html) to protect endpoints, as well as access the credentials and identity of incoming requests. These new services replace the existing `IdentityService` and `TokenManagerService`

The proposed design leaves the decision for how different endpoints are protected to the implementation of the plugin backends themselves. This includes whether particular routes should allow anonymous access, access from users authenticated via a cookie, or perhaps only allow access from other plugin backends and external services. This means that integrators do not need to - and do not have the ability to - configure access controls of individual endpoints, except for what the permission system already provides, and what is made available through static configuration or extension points.

In order to allow for cookie-based authentication of incoming user requests, the `auth` plugin backend is extended to be able to issue user tokens with reduced scope, which in turn integrate with the new `AuthService` and `HttpAuthService`. The ability to use cookie auth for requests is an opt-in per route and is only be permitted for read methods (`GET`, `HEAD`, `OPTIONS`). The actual implementation of cookie-based flows will be up to each plugin, but with significant help from the new auth service interfaces.

For service-to-service communication we will move away from reusing user tokens in upstream requests. We will instead implement an "On-Behalf-Of" flow where incoming user credentials are encapsulated in a service token for the upstream request. In line with this the new auth service interfaces will aim to make it difficult to directly forward credentials from incoming requests, and instead encourage that plugin backends issue new service credentials for upstream requests.

## Design Details

### `AuthService` (WIP)

The new `AuthService` interface is defined as follows:

```ts
export type BackstageCredentials = {
  token: string;

  user?: {
    userEntityRef: string;
    ownershipEntityRefs: string[];
  };

  service?: {
    id: string;
  };
};

export interface AuthService {
  authenticate(token: string): Promise<BackstageCredentials>;

  issueToken(credentials: BackstageCredentials): Promise<{ token: string }>;
}
```

#### Usage Patterns

TODO

### `HttpAuthService` (WIP)

The new `HttpAuthService` interface is defined as follows:

```ts
type AuthTypes = 'user' | 'user-cookie' | 'service' | 'unauthorized';

export interface HttpAuthServiceMiddlewareOptions {
  allow: AuthTypes[];
}

export interface HttpAuthService {
  createHttpPluginRouterMiddleware(): Handler;

  middleware(options?: HttpAuthServiceMiddlewareOptions): Handler;

  credentials(
    req: Request,
    options?: HttpAuthServiceMiddlewareOptions,
  ): BackstageCredentials;

  requestHeaders(
    credentials: BackstageCredentials,
  ): Promise<Record<string, string>>;

  issueUserCookie(res: Response): Promise<void>;
}
```

#### Usage Patterns

All of these usages patterns are from the perspective of a plugin backend.

**Authenticate incoming request that requires user authentication**

```ts
// Adding the middleware separately like this makes it apply to ALL
// routes added below it. You can also add it between the path and the
// handler below, to make it apply only for that particular path.
router.use(httpAuth.middleware({ allow: ['user'] }));

router.get('/read-data', (req, res) => {
  // TODO: user can currently be undefined, figure out best pattern to avoid that
  const { user } = httpAuth.credentials(req);
  console.log(
    `User ref=${user.userEntityRef} ownership=${user.ownershipEntityRefs}`,
  );
  // ...
});
```

**Forward the user credentials from an incoming requests to upstream plugin backend**

```ts
router.get(
  '/read-data',
  // Here, the middleware applies to the current path only
  httpAuth.middleware({ allow: ['user'] }),
  (req, res) => {
    const entity = await catalogClient.getEntityByRef(req.params.entityRef, {
      credentials: httpAuth.credentials(req),
    });
    // ...
  },
);
```

**Allow both user and service request**

```ts
router.get(
  '/read-data',
  httpAuth.middleware({ allow: ['user', 'service'] }),
  (req, res) => {
    const credentials = httpAuth.credentials(req);
    if (credentials.user) {
      res.json(
        // Silly example just to highlight separate code paths for user and
        // service requests
        todoStore.listOwnedTodos({ owner: credentials.user.userEntityRef }),
      );
    } else {
      res.json(todoStore.listTodos());
    }
  },
);
```

**Issuing a cookie and allowing user cookie auth on a separate endpoint**

```ts
router.get('/cookie', httpAuth.middleware({ allow: ['user'] }), (req, res) => {
  await httpAuth.issueUserCookie(res);
  res.json({ ok: true });
});

// Separate endpoint that serves static content, allowing user cookie auth as
// well as regular user auth
router.use(
  '/static',
  httpAuth.middleware({ allow: ['user', 'user-cookie'] }),
  express.static(staticContentDir),
);
```

**Passing along user identity from a cookie in an upstream request**

```ts
router.get(
  '/read-data',
  httpAuth.middleware({ allow: ['user-cookie'] }),
  (req, res) => {
    const { cookieUser } = httpAuth.credentials(req);
    console.log(
      `User ref=${cookieUser.userEntityRef} ownership=${cookieUser.ownershipEntityRefs}`,
    );
    // ...
  },
);
```

## Release Plan

The existing `IdentityService` and `TokenManagerService` will be deprecated and instead implemented in terms of the new `AuthService`.

The release plan for the `HttpAuthService` is TBD, but is likely to be shipped as a no-op for plugins using the old backend system.

## Dependencies

No significant dependencies have been identified for this work, although any future security audits of Backstage are considered dependent on this work.

## Alternatives

An alternative to built-in protection from external access would be to keep relying on external mechanisms to protect access to Backstage. We feel that this is a suboptimal solution since it adds complexity to the adoption of Backstage, and increases the risk of misconfiguration and security breaches. Regardless of whether we add built-in protection or not the ability to protect API endpoints needs to be addressed in some way, since it is a requirement for the permission system to work. This means that the extra steps to ensure protection out of the box are fairly minimal when looking at just the delta for protecting API access.
