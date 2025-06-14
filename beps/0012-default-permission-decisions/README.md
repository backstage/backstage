---
title: Default Permission Decisions
status: implementable
authors:
  - '@Rugvip'
owners:
  - '@Rugvip'
project-areas:
  - permissions
creation-date: 2025-04-10
---

# BEP: Default Permission Decisions

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Default Decisions with Permissions Disabled](#default-decisions-with-permissions-disabled)
  - [Default Decisions with Permissions Enabled](#default-decisions-with-permissions-enabled)
  - [API Changes](#api-changes)
- [Release Plan](#release-plan)
- [Alternatives](#alternatives)
  - [Return Default Decisions from Permission Backend](#return-default-decisions-from-the-permission-backend)
  - [Communicate Default Decisions Over Separate Channel](#communicate-default-decisions-over-separate-channel)

## Summary

The Backstage Permission System currently requires explicit policy handlers to be defined for all permissions. This BEP proposes adding support for default permission decisions that can be defined when creating a permission. These default decisions can be either definitive or conditional, leveraging existing evaluation mechanisms. This enhancement enables plugins to define built-in behavior through the permission system while maintaining the flexibility for adopters to override this behavior with custom policies.

## Motivation

The current permission system requires explicit policy handlers for all permissions, unless the permission system is disabled in which case all permissions are allowed. There have been discussions in the past about supporting partial or default permission policies provided by plugins, see [#13891](https://github.com/backstage/backstage/issues/13891) and [#18064](https://github.com/backstage/backstage/pull/18064). Being able to provide default policies is useful in many cases, for example, a plugin might want to only allow access to owners of a resource, but allow a policy author to override this for specific permissions. The inverse case is also important, where a plugin wants to expose sensitive functionality that should only be available to a restricted set of users, but be unavailable by default. The lack of this capability essentially prevents implementation of these kind of features in a clean way, forcing plugin authors to resort to custom mechanisms.

### Goals

- Enable plugin authors to define default policies for their permissions
  - Support both basic and resource permissions
  - Support for conditional decisions based on user information
  - Have these policies remain in effect even if the permission system is disabled
- Maintain backward compatibility with existing permission system
- Improve security by enabling secure-by-default patterns
- Allow permission policy authors to defer to the default decision

### Non-Goals

- Configuration of default decisions
- Complex business logic in default decisions

## Proposal

A new "default" authorize result is added to the permission system that can be returned by a policy handler to indicate that the permission should be evaluated using the default decision. The permission system supports two variants of default decisions: "default or allow" and "default or deny". These indicate that the permission should be evaluated using the default decision, and if no default decision is defined, it will fall back to "allow" or "deny" respectively.

The new default behavior of the permission system **when it is disabled** is "default or allow", as opposed to the previous behavior of allowing all permissions.

When designing a permission you can now define a default decision that will be used in place of any default result. These default decisions can be both definitive decisions as well as conditional decisions based on user information.

## Design Details

The proposal introduces default decision support in the permission creation APIs for both basic permissions and resource permissions, including support for conditional decisions that delegate evaluation to resource owners. Default decisions behave differently depending on whether permissions are enabled or not.

### Default decisions with permissions disabled

When permissions are disabled, the frontend will be able to use default definitive decisions, but it will not be able to evaluate default conditional permissions and will always assume `AuthorizeResult.ALLOW`. Backend plugins will still be able to evaluate default conditional permissions however, as they can be returned directly without a request to the permission plugin backend. This means that a user attempting an action on a resource where the default decision is conditional will always be able to attempt the action, but may be denied access once the backend evaluates the permission. In order to improve the user experience, the permission system would need to be enabled.

### Default decisions with permissions enabled

When permissions are enabled, the frontend will be able to evaluate all default decisions, both conditional and definitive. The evaluation of conditional decisions will happen as usual through the permission integration routes. Likewise, the backend will translate default decisions into the appropriate definitive or conditional decision for the permission system to evaluate. If the caller requires a definitive decision for a single resource and the default decision is conditional, it will also be responsible for evaluating the conditional decision.

Permissions are serialized and included in evaluation requests to the permission backend, and so are their default decisions. When either the frontend or backend makes a request to evaluate a permission, the default decisions known by the caller are included in the request. In order to support conditional decisions, the client uses placeholders for fields like `userEntityRef` and `ownershipEntityRefs`, which are then substituted by the backend before evaluation.

### API changes

The permission system will be extended to support default decisions through the following additions:

New constants to represent default results are added, `AuthorizeResult.DEFAULT_OR_ALLOW` and `AuthorizeResult.DEFAULT_OR_DENY`, as well as `DefaultPolicyDecision` to represent the full decision result object:

```ts
type DefaultPolicyDecision = {
  result: AuthorizeResult.DEFAULT_OR_ALLOW | AuthorizeResult.DEFAULT_OR_DENY;
};
```

The `PolicyDecision` type is extended to include the new `DefaultPolicyDecision` type:

```ts
type PolicyDecision =
  | DefinitivePolicyDecision
  | ConditionalPolicyDecision
  | DefaultPolicyDecision;
```

The other types that are currently aliases for `PolicyDecision` still use `DefinitivePolicyDecision | ConditionalPolicyDecision` however. Permission service or API callers will never receive a `DefaultPolicyDecision`, as default decisions will always be converted into a definitive or conditional decision first.

A new `defaultDecision` option added to all variants of `createPermission`:

```ts
{
  defaultDecision?: DefinitivePolicyDecision | (
    (placeholders?: {
      userEntityRef: string,
      ownershipEntityRefs: string[],
    }) => ConditionalPolicyDecision
  );
}
```

The placeholder TypeScript types match the types of their respective fields, in order for type checking to work when building the conditional decision. The underlying value does however not match the type of the field, and is instead an object with a `$placeholder` key where the value identifies the placeholder.

The new `defaultDecision` option is used as follows:

```ts
// Simple default decision for a basic permission
const readPermission = createPermission({
  name: 'catalog.entity.read',
  attributes: { action: 'read' },
  defaultDecision: { result: AuthorizeResult.DENY },
});
```

```ts
// Simple default decision for a resource permission
const catalogEntityReadPermission = createPermission({
  name: 'catalog.entity.read',
  attributes: { action: 'read' },
  resourceType: 'catalog-entity',
  defaultDecision: { result: AuthorizeResult.DENY },
});
```

```ts
// Conditional default decision for a resource permission
const catalogEntityUpdatePermission = createPermission({
  name: 'catalog.entity.update',
  attributes: { action: 'update' },
  resourceType: 'catalog-entity',
  defaultDecision: placeholders => ({
    result: AuthorizeResult.CONDITIONAL,
    conditions: catalogConditions.isEntityOwner({
      claims: placeholders?.ownershipEntityRefs ?? [],
    }),
  }),
});
```

The last example with a default conditional decision is serialized as follows:

```json
{
  "name": "catalog.entity.update",
  "attributes": { "action": "update" },
  "resourceType": "catalog-entity",
  "defaultDecision": {
    "result": "CONDITIONAL",
    "conditions": [
      {
        "rule": "IS_ENTITY_OWNER",
        "resourceType": "catalog-entity",
        "params": [
          {
            "claims": { "$placeholder": "ownershipEntityRefs" }
          }
        ]
      }
    ]
  }
}
```

If the permission backend receives a request with the above example and the policy decides to use the default decision, it will translate the placeholder into the ownership entity references of the user and return the conditional decision.

## Release Plan

When rolling out this feature we need to take into account that both the permission backend and calling plugins may be on different versions and may or may not support the new feature. For the case where the permission system is disabled it's fairly straightforward, each plugin will individually support default decisions or not based on the version of the plugin.

For the case where the permission system is enabled, there are two important cases to consider. The first is where the caller supports default decisions and the permission backend does not. This is fairly straight-forward because the permission backend doesn't know about default decisions and the policy can therefore never return them.

The more tricky case is where the caller does not support default decisions, but the permission backend does. In this case the permission policy may return a result to use the default decision. This case is one of the reasons why we choose to include the default decisions in the evaluation requests, as it also lets the caller signal whether they support default decisions or not. The permission backend will check the incoming requests for default decisions, and if they're not present will fall back to either allow or deny depending on whether `DEFAULT_OR_ALLOW` or `DEFAULT_OR_DENY` is used.

## Alternatives

### Return default decisions from the permission backend

The permission backend could be extended to return default decisions, and the caller would be responsible for evaluating them. This would be a breaking change for any plugin that has not implemented default decisions yet. A benefit of this approach is that there's less information that needs to be sent over the wire when evaluating permissions for other backends. When using the integration router this approach has a big disadvantage however, as the permission backend won't know what the default decision is it will always need to make a request to resource owners to evaluate the permission. In practice it might be that a combination of the two approaches is more practical. In order to be able to switch to this setup in the future we could consider introducing support for handling default decisions in the permission client, even if they backend won't return them yet.

### Communicate default decisions over a separate channel

We might for example use the permissions integration route to communicate default decisions, rather than including them in the evaluation requests. This would reduce the amount of information that needs to be sent over the wire when evaluating permissions, but increases the complexity of the system a fair bit. In particular the default decisions may change over time as new versions are installed, and we'd need to ensure that the backend is able to detect these changes. In practice it's likely both simpler and more efficient to work towards implementing support for [returning default decisions from the backend](#return-default-decisions-from-the-permission-backend).
