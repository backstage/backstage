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

[**Discussion Issue**](https://github.com/backstage/backstage/issues/24349)

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

This proposal builds upon the foundation laid out in the [Auth Architecture Evolution BEP](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution), by improving the authentication mechanisms used by external callers seeking to access the REST APIs exposed by Backstage plugins.

Specifically, the inclusion of shared-key based authentication is proposed, along with a framework for integrating different authentication types in the future. Compatibility with the legacy shared-secret token signature mechanism is retained.

By implementing this proposed solution, security should not be compromised beyond the existing state when exposing the API to the internet. Nonetheless, it is advisable to maintain a level of protection by shielding your deployments from the internet access unless you explicitly need public access.

## Motivation

This proposal represents a progression from [the old service to service auth tutorial](https://backstage.io/docs/auth/service-to-service-auth--old/#usage-in-external-callers) in the context of the new `coreServices.auth` and `coreServices.httpAuth` authentication services.

It offers expanded configuration possibilities and will include ready-to-use examples as part of the implementation to streamline the process of invoking REST services exposed by Backstage backend plugins for external services.

The previous tutorial lacked clarity on how to effectively structure the call, resulting in a cumbersome experience.

Examples of potential use-cases include:

- An external asynchronous service requiring the ability to send notifications to users
- Integrations for external services interacting with the catalog
- Temporary `curl` friendly tokens in local development

To facilitate this process, no code change but configuration only is needed on the Backstage side.

### Goals

- The primary objective is to facilitate access for external heterogeneous services to the Backstage REST API without involving unnecessary complexity.
- Moving to the proposed new auth scheme is entirely optional. The old shared key signature tokens remain usable.
- Configuration options will allow specification of which API endpoints can be accessed by an external entity.
- Limiting API context and granting distinct external access independently helps mitigate security risks. A compromised external service can only access a restricted portion of the API.
- Enhanced clarity and updated examples make it easy to comprehend and utilize.

### Non-Goals

It is not a goal

- To replace the current Backstage service-to-service authentication or tokens,
- To offer a bypass option for Backstage plugins to circumvent existing service-to-service authentication. Even if feasible, such a bypass would be considered as an anti-pattern.

## Proposal

The `backend.auth.keys` section of your app config remains supported for the time being, but is considered legacy. It is read by the new auth handler code solely for backward compatibility reasons. Using this format will lead to a logged warning urging a migration to the new format described below.

This BEP adds a `backend.auth.externalAccess` section to your app config. This section is the new recommended way of declaring all methods of external service access that you want to support. Like the legacy section above, it is an array, but each element has a `type` field to allow for extensibility. Using an array also means that the configuration system will not make any config merging of access methods across different config files - which avoids unintended mistakes that might otherwise have impacted security.

The two types of external access covered by this BEP are `legacy` and `static`. More on that below.

## Design Details

### Configuration

The following is an example of what an app config section with a single access method could look like:

```yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${SERVICE_API_TOKEN}
        scope:
          plugins: catalog
```

Each entry has a `type`, which is any string. The framework handles a number of these types - initially a fixed set, but in the future we might make it extensible.

The `options` is a general object, and is specific to each type, configuring it as needed. This particular type only had a `token`, which was configured to be taken from an environment variable.

Each entry may also optionally have a `scope` section that controls what operations that this entry can be used for. Attempting to use this access method for any other scope will lead to 403 error rejections. Scopes can contain plugin IDs and/or permissions.

Introducing a new external caller with its exclusive secret key entails updating the app-config.yaml file and restarting the backend. This mechanism is designed to support integration with selected services, and therefore dynamic addition of callers is not necessary at this point.

### Scopes

Scopes are optional. If you do not specify any scopes, the access method in question has unlimited scope and can perform all types of action.

In the examples below, either a string or a list of strings can be given.

If _any_ scope rule matches, the action is permitted. I.e., if you specify a plugin rule, then also adding permission rules for that plugin will have no effect since the plugin rule will have already matched.

You can limit by the target plugin ID being accessed with the token:

```yaml
scope:
  plugin: catalog
```

You can limit by the type of permission being requested:

```yaml
scope:
  permission: catalog.entity.read
```

Or by permissions attribute:

```yaml
scope:
  permissionAttributes: { action: read }
```

### The Legacy Access Type

Configuration example:

```yaml
backend:
  auth:
    externalAccess:
      - type: legacy
        options:
          secret: ${EXTERNAL_ACCESS_SIGNATURE_SECRET}
        # scope: ...
```

This corresponds exactly to the old shared secret signature method, and any secrets entered here will be merged with those specified under `backend.auth.keys` if any.

### The Static Access Type

Configuration example:

```yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${SERVICE_API_TOKEN}
        # scope: ...
```

This allows you to specify any static token string as an API key, which callers send verbatim as the header `Authorization: Bearer <token>`.

### Implementation

The token verification of the two access methods will live entirely with the `coreServices.auth` service implementation, and will be returning regular credentials with a service principal. The implementation will only need to alter the `authenticate` method and no additions to the API will be necessary.

The service principal type will need to be amended with an optional scope field, carried over from the configuration. This will let the `ServerPermissionClient` compare against the set of allowlisted actions. In addition, the auth service can early-reject based on plugin ID if such rules are given.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

The initial pilot implementation of the `legacy` and `static` types has already been merged, along with the corresponding config additions.

Validating this implementation, and adding scope restrictions, is still on todo but could be added incrementally at any time without breaking changes - as long as the default scope is "all".

We have left it out of the scope of this BEP to allow for addition of more access types. Making that a possibility will likely require the addition of service extension points at a framework level, which is not yet made a priority.

Potential _future_ access types (not part of this BEP, but rather only for illustration) could for example be:

```yaml
backend:
  auth:
    externalAccess:
      - type: jwks
        options:
          url: https://other-service.acme.org/.well-known/jwks.json
      - type: certificate
        options:
          publicCert:
            $file: ./service-cert.pem
```

## Dependencies

- [BEP-0003: Auth Architecture Evolution](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution)

## Alternatives

### Dynamic Persistence of Shared-Secrets in a Database

This approach involves storing shared secrets dynamically in a database. Adding or removing a shared secret would not require changes to the `app-config.yaml`, and managing secrets would not require restarting the application. This solution offers clear benefits, but may encounter objections due to its complexity and the potential lack of need for such flexibility.

### Maintain the Status Quo

Alternatively, we could maintain the current state by allowing callers to independently compose JWT tokens suitable for the existing implementation. However, this approach may prove challenging given the diverse types and environmental setups of external callers.

### Access Control on a Per-Plugin Basis

Another alternative is to retain access control on a per-plugin basis, as demonstrated in https://github.com/backstage/backstage/pull/23441. Given the repetitive nature of this use-case, establishing a common mechanism may present a more favorable option.

### Shared Token Requester

Implementing a shared token requester, as showcased in https://github.com/backstage/backstage/pull/23465, offers another potential solution. This approach may streamline token management and enhance accessibility, but requires thorough consideration of its implications and integration into the existing system.
