---
id: v1.45.0
title: v1.45.0
description: Backstage Release v1.45.0
---

These are the release notes for the v1.45.0 release of [Backstage](https://backstage.io/).

A huge thanks to the whole team of maintainers and contributors as well as the amazing Backstage Community for the hard work in getting this release developed and done.

## Highlights

### Backstage UI: Breaking Changes + New Components

Multiple components migrated from Base UI to React Aria Components including `Avatar`, `Checkbox`, and removal of the `Collapsible` component in favour of `Accordion`.

Check the [CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/ui/CHANGELOG.md) for more migration guides on any breaking changes that come with these latest updates.

### BREAKING: `ldapjs` -> `ldapts`

Moved from deprecated `ldapjs` dependency to `ldapts`, with breaking changes to custom transformer types and search options.

Contributed by [@ganives](https://github.com/ganievs) in [#30594](https://github.com/backstage/backstage/pull/30594)

Check the [CHANGELOG.md](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-ldap/CHANGELOG.md) for more migration guides on any breaking changes that come with these latest updates.

### NFS: Plugin-Relative Extension Attachments

Added support for plugin-relative `attachTo` declarations for extension definitions, allowing extensions to attach to other extensions of a particular kind in the same plugin rather than requiring exact extension IDs.

### NFS: Forwards Compatibility for Route Refs

It is now possible to use route references from the old frontend system directly in the new one. That means there's no longer a need to use `convertLegacyRouteRef` or `convertLegacyRouteRefs` to re-use route refs in implementations for the new system. This both simplifies migration, and reduces risk for cross system issues while partially migrated.

This requires no immediate action on your part. As long as a plugin intends to support the old system, it can still keep defining its route refs using the old system without issues. And calling `convertLegacyRouteRef` or `convertLegacyRouteRefs` does not cause problems.

### Configurable Dynamic Client Registration Token Expiration

Allow configuring dynamic client registration token expiration with config `auth.experimentalDynamicClientRegistration.tokenExpiration`. Maximum expiration for the DCR token is 24 hours. Default expiration is 1 hour. Contributed by [@drodil](https://github.com/drodil) in [#31278](https://github.com/backstage/backstage/pull/31278)

### Support for Bitbucket Cloud API tokens

Since Bitbucket Cloud is phasing out support for the `appPassword` tokens, you can now instead specify the more modern API tokens using the `token` field of your Bitbucket config.

### Support for PostgreSQL 18

The default setup for `TestDatabases` will start running tests against PG14 and PG18 where available, instead of PG13 and PG17 as previously. If you pass in explicit database IDs to your test database instance, those will still be respected.

### `coreServices.rootInstanceMetadata` is stable

The backend service `coreServices.rootInstanceMetadata` is now available as stable. It currently has one method - that lets you list all of the installed backend plugins and their modules on the current instance.

## Security Fixes

This release does not contain any security fixes.

## Upgrade path

We recommend that you keep your Backstage project up to date with this latest release. For more guidance on how to upgrade, check out the documentation for [keeping Backstage updated](https://backstage.io/docs/getting-started/keeping-backstage-updated).

## Links and References

Below you can find a list of links and references to help you learn about and start using this new release.

- [Backstage official website](https://backstage.io/), [documentation](https://backstage.io/docs/), and [getting started guide](https://backstage.io/docs/getting-started/)
- [GitHub repository](https://github.com/backstage/backstage)
- Backstage's [versioning and support policy](https://backstage.io/docs/overview/versioning-policy)
- [Community Discord](https://discord.gg/backstage-687207715902193673) for discussions and support
- [Changelog](https://github.com/backstage/backstage/tree/master/docs/releases/v1.45.0-changelog.md)
- Backstage [Demos](https://backstage.io/demos), [Blog](https://backstage.io/blog), [Roadmap](https://backstage.io/docs/overview/roadmap) and [Plugins](https://backstage.io/plugins)

Sign up for our [newsletter](https://spoti.fi/backstagenewsletter) if you want to be informed about what is happening in the world of Backstage.
