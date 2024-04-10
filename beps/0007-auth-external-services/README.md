---
title: Authentication of External Services
status: provisional
authors:
  - '@mareklibra'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: 2024-03-30
---

# BEP: Authentication of External Services

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

This proposal builds upon the foundation laid out in the 0003-auth-architecture-evolution BEP by introducing an authentication mechanism designed for external callers seeking to access the REST APIs exposed by Backstage or its plugins.

This addition is not intended to supplant or offer an alternative to existing JWT tokens utilized for backend-to-backend or frontend-to-backend communication. JWT tokens remain a viable option for external callers. However, this proposal presents additional options to simplify usage, especially in heterogeneous setups.

Specifically, the inclusion of shared-key based authentication is proposed, along with a framework for integrating different authentication types in the future.

By implementing this proposed solution, security should not be compromised beyond the existing state when exposing the API to the internet. Nonetheless, it is advisable to maintain a level of protection by shielding the API from direct internet access.

## Motivation

This proposal represents a progression from the tutorial in https://backstage.io/docs/auth/service-to-service-auth/#usage-in-external-callers in the context of the new Authentication service.

It offers expanded configuration possibilities and will include ready-to-use examples as part of the implementation to streamline the process of invoking REST services exposed by Backstage backend plugins for external services.

The previous tutorial lacked clarity on how to effectively structure the call, resulting in a cumbersome experience.

Examples of potential use-cases include:

- An external asynchronous service requiring the ability to send notifications to users. To facilitate this process, no code change but configuration only is needed on the Backstage side.

### Goals

- The primary objective is to facilitate access for external heterogeneous services to the Backstage REST API without involving unnecessary complexity.
- This addition is entirely optional. JWT tokens remain mandatory for all internal communication within Backstage.
- Configuration options will allow specification of which API endpoints can be accessed by an external entity.
- Limiting API context and granting distinct external access independently helps mitigate security risks. A compromised external service can only access a restricted portion of the API.
- Enhanced clarity and updated examples make it easy to comprehend and utilize.

### Non-Goals

It is not a goal

- to replace the current Backstage service-to-service authentication or tokens,
- to offer a bypass option for Backstage plugins to circumvent existing service-to-service authentication. Even if feasible, such a bypass would be considered as an anti-pattern.

## Proposal

The `app-config.yaml` `backend.auth.keys` property will become an array containing alternative authentication mechanisms for callers.

JWT tokens remain obligatory for internal Backstage calls and become optional for external callers. Given the complexity associated with composing JWT tokens by external entities, alternative authentication options will be provided for external callers:

```
backend:
  auth:
    keys:
    - type: static
      value: ${SERVICE_API_KEY}
      context: '/'
    - type: jwks
      value: https://other-service.acme.org/.well-known/jwks.json
      context: '/foo'
    - type: certificate
      value:
        $file: ./service-cert.pem
      context: '/foo/bar'
```

The static type is designed for a straightforward shared-key strategy. In this approach, an external service provides a secret string to authenticate itself and access REST resources within a specified context. The shared key is transmitted via a new request header, `authorization_static`.

Ideally, each external service should have its own unique secret key, even when accessing the same context. If a service requires access to different, separate contexts, multiple corresponding entries will be added to the configuration.

While other authentication types are provided as examples for potential future expansions, they will not be implemented in the initial phase. However, additional types, including those not yet defined, can be introduced in subsequent phases.

Introducing a new external caller with its exclusive secret key entails updating the app-config.yaml file and restarting the backend. This mechanism is designed to support integration with selected services, and therefore dynamic addition of callers is not necessary.

New type-specific functions, such as authenticateStatic(), will be integrated into the AuthService, alongside the existing authenticate() function, which will remain dedicated to JWT tokens.

No changes will be made to the existing APIs, as any necessary adjustments can be incorporated within private functions of the existing DefaultHttpAuthService implementation.

Specifically, the DefaultHttpAuthService.extractCredentialsFromRequest function will continue to retrieve a bearer token in JWT format from the authorization header as before. If this header is absent, the service will proceed to read and manage the header corresponding to the next authentication type.

Furthermore, the options parameter of the HttpAuthService.credentials() function will be expanded to include a new context property. This property will be compared to the value of the context configuration property associated with the corresponding authentication key. If the context parameter is not a subset of the configuration property, the request will be denied.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

TBD

- adding different types in the future

## Dependencies

- 0003-auth-architecture-evolution

## Alternatives

### Dynamic Persistence of Shared-Secrets in a Database

This approach involves storing shared secrets dynamically in a database. Adding or removing a shared secret would not require changes to the `app-config.yaml`, and managing secrets would not require restarting the application. This solution offers clear benefits, but may encounter objections due to its complexity and the potential lack of need for such flexibility.

### Maintain the Status Quo

Alternatively, we could maintain the current state by allowing callers to independently compose JWT tokens suitable for the existing implementation. However, this approach may prove challenging given the diverse types and environmental setups of external callers.

### Access Control on a Per-Plugin Basis

Another alternative is to retain access control on a per-plugin basis, as demonstrated in https://github.com/backstage/backstage/pull/23441. Given the repetitive nature of this use-case, establishing a common mechanism may present a more favorable option.

### Shared Token Requester

Implementing a shared token requester, as showcased in https://github.com/backstage/backstage/pull/23465, offers another potential solution. This approach may streamline token management and enhance accessibility, but requires thorough consideration of its implications and integration into the existing system.
