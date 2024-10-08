---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': minor
---

Fixes the event-based updates at `BitbucketCloudEntityProvider`.

Previously, this entity provider had optional event support for legacy backends
that could be enabled by passing `catalogApi`, `events`, and `tokenManager`.

For the new/current backend system, the `catalogModuleBitbucketCloudEntityProvider`
(`catalog.bitbucket-cloud-entity-provider`), event support was enabled by default.

A recent change removed `tokenManager` as a dependency from the module as well as removed it as input.
While this didn't break the instantiation of the module, it broke the event-based updates,
and led to a runtime misbehavior, accompanied by an info log message.

This change will replace the use of `tokenManager` with the use of `auth` (`AuthService`).

Additionally, to simplify, it will make `catalogApi` and `events` required dependencies.
For the current backend system, this change is transparent and doesn't require any action.
For the legacy backend system, this change will require you to pass those dependencies
if you didn't do it already.

BREAKING CHANGES:

_(For legacy backend users only.)_

Previously optional `catalogApi`, and `events` are required now.
A new required dependency `auth` was added.
