---
id: v1.12.0
title: v1.12.0
description: Backstage Release v1.12.0
---

These are the release notes for the v1.12.0 release of [Backstage](https://backstage.io/).

A huge thanks to the whole team of maintainers and contributors as well as the amazing Backstage Community for the hard work in getting this release developed and done.

## Highlights

This release mostly contains a bunch of smaller additions and bug fixes, but on top of that, there’s also some quality of life improvements and features as listed below. Enjoy!

### Using `zod` for action definitions

As a convenience, it is now possible to define your action inputs and outputs as `zod` schemas. This tends to be more convenient than writing JSON schema by hand, and gives you instant type feedback in your editor.

Added by [@zcason](https://github.com/zcason) in [#15561](https://github.com/backstage/backstage/pull/15561)

### Reading paginated data from the catalog

The catalog has a new backend endpoint and corresponding client method, for fetching entities with proper cursor based pagination and server side filtering and ordering. This will be used to target performance hot-spots in the frontend and elsewhere.

Added by [@vinzscam](https://github.com/vinzscam) in [#12246](https://github.com/backstage/backstage/pull/12246)

### Renamed backend system related plugin exports

As we settle the new backend system bit by bit, we have renamed a number of exports from individual plugins, to match the new [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns). If you are already leveraging the new backend system, you may find that you need to update some imports. For example, `githubEntityProviderCatalogModule` was renamed to `catalogModuleGithubEntityProvider`. These were considered non-breaking since they are still in alpha. More details can be found in [#16760](https://github.com/backstage/backstage/pull/16760) and [#16764](https://github.com/backstage/backstage/pull/16764).

### New plugin: `catalog-backend` `puppetdb` module

Added a `catalogModulePuppetDbEntityProvider` alpha export for the new backend system. Contributed by [@tdabasinskas](https://github.com/tdabasinskas) in [#16184](https://github.com/backstage/backstage/pull/16184)

### New plugin: Octopus deploy

[Octopus](https://octopus.com) deployment plugin. Contributed by [@jmezach](https://github.com/jmezach) in [#16353](https://github.com/backstage/backstage/pull/16353)

### New plugin: StackStorm

Integration with [StackStorm](https://stackstorm.com). Contributed by [@pamelin](https://github.com/pamelin) in [#16152](https://github.com/backstage/backstage/pull/16152)

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
- [Changelog](https://github.com/backstage/backstage/tree/master/docs/releases/v1.12.0-changelog.md)
- Backstage [Demos](https://backstage.io/demos), [Blog](https://backstage.io/blog), [Roadmap](https://backstage.io/docs/overview/roadmap) and [Plugins](https://backstage.io/plugins)

Sign up for our [newsletter](https://spoti.fi/backstagenewsletter) if you want to be informed about what is happening in the world of Backstage.
