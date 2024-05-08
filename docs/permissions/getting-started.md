---
id: getting-started
title: Getting Started
description: How to get started with the permission framework as an integrator
---

Backstage integrators control permissions by writing a policy. In general terms, a policy is simply an async function which receives a request to authorize a specific action for a user and (optional) resource, and returns a decision on whether to authorize that permission. Integrators can implement their own policies from scratch, or adopt reusable policies written by others.

## Prerequisites

The permissions framework depends on a few other Backstage systems, which must be set up before we can dive into writing a policy.

### Upgrade to the latest version of Backstage

To ensure your version of Backstage has all the latest permission-related functionality, it’s important to upgrade to the latest version. The [Backstage upgrade helper](https://backstage.github.io/upgrade-helper/) is a great tool to help ensure that you’ve made all the necessary changes during the upgrade!

### Supply an identity resolver to populate group membership on sign in

**Note**: If you are working off of an existing Backstage instance, you likely already have some form of an identity resolver set up.

Like many other parts of Backstage, the permissions framework relies on information about group membership. This simplifies authoring policies through the use of groups, rather than requiring each user to be listed in the configuration. Group membership is also often useful for conditional permissions, for example allowing permissions to act on an entity to be granted when a user is a member of a group that owns that entity.

[The IdentityResolver docs](../auth/identity-resolver.md) describe the process for resolving group membership on sign in.

## Enable and test the permissions system

All you need to do now is enable the permissions system in your Backstage instance!

1. Set the property `permission.enabled` to `true` in `app-config.yaml`.

```yaml title="app-config.yaml"
permission:
  enabled: true
```

Congratulations! Now that the framework is configured, you can craft a permission policy that works best for your organization by utilizing a provided authorization method or by [writing your own policy](./writing-a-policy.md)!
