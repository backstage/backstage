---
id: v1.43.0
title: v1.43.0
description: Backstage Release v1.43.0
---

These are the release notes for the v1.43.0 release of [Backstage](https://backstage.io/).

A huge thanks to the whole team of maintainers and contributors as well as the amazing Backstage Community for the hard work in getting this release developed and done.

## Highlights

### **BREAKING:** MSgraph catalog module encoding queries

The catalog MSgraph module now properly encodes filter queries before they are sent to the remote system. This fixes some confusion in how to properly write queries–and thus simplifies operations for users. However, it does mean that if you use the `@backstage/plugin-catalog-backend-module-msgraph` module, you will have to update your `filter` parameters to be just plain text without any manual encoding. Example:

```diff
 user:
-  filter: department in('MARKETING', 'R %26 D')
+  filter: department in('MARKETING', 'R & D')
```

Contributed by [@stephenglass](https://github.com/stephenglass) in [#30567](https://github.com/backstage/backstage/pull/30567)

### OpenShift auth

Backstage now supports OpenShift as an auth provider! This was a long standing PR that we are very excited to have merged into the project. Go [check out the docs](https://backstage.io/docs/auth/openshift/provider) for it!

Contributed by [@ioboi](https://github.com/ioboi) in [#29470](https://github.com/backstage/backstage/pull/29470)

### Improved app error display for new frontend system

If the frontend app encounters one or more critical errors during startup they are now displayed on an error page that summarizes the errors and their source. This is in contrast to before this change, where errors would result in a blank page with the first error logged to the console.

Some more errors have also been moved to be warnings, which will be logged in the console regardless of whether the app starts up or not.

### Actions Registry integration with the Scaffolder

Actions which are registered in the Actions Registry are now also available in Scaffolder templates. You will be able to browse the actions and see the schema like the original Scaffolder Templating Actions, as well as being able to use `action: acme:my-action` inside template steps to call these distributed actions.

### _Experimental_: Dynamic Client Registration support for MCP Actions Backend

We’ve shipped experimental support for allowing the `auth-backend` to issue tokens on behalf of users for use in MCP Clients such as Claude and Cursor. This is highly experimental, and tokens are only valid for 1 hour currently. We’re eager to get some feedback on this feature, so if you would like to try it out you can check out the [mcp-actions docs](https://github.com/backstage/backstage/blob/master/plugins/mcp-actions-backend/README.md#experimental-dynamic-client-registration) and leave us some feedback in a [GitHub issue](https://github.com/backstage/backstage/issues/new), or on our [Community Discord](https://discord.gg/backstage-687207715902193673)!

### Introducing `BACKSTAGE_ENV`

The Backstage configuration system now pays attention to the `BACKSTAGE_ENV` environment variable, and uses it to locate config files to load without you having to manually specify `--config` flags at startup. This makes it even smoother to leverage e.g. `app-config.production.yaml` files in your production environment.

Check out [the updated documentation](https://backstage.io/docs/conf/) for more information.

Contributed by [@drodil](https://github.com/drodil) in [#30722](https://github.com/backstage/backstage/pull/30722)

### Backend logger configuration

It is now possible to configure log level, meta, and log level overrides through static configuration. This allows you to raise or lower the log level for individual plugins or services. But it also allows you to match on any log field using either exact matches or regular expressions. Read more about the new configuration options in the [Root Logger Service](https://backstage.io/docs/backend-system/core-services/root-logger/) documentation.

Contributed by [@tcardonne](https://github.com/tcardonne) in [#30727](https://github.com/backstage/backstage/pull/30727)

### Toggling and priorities for catalog features

You are now able to enable/disable individual processors and providers in your catalog, directly through your app config. You can also affect the order in which processors run, by assigning them priorities.

Contributed by [@drodil](https://github.com/drodil) in [#31034](https://github.com/backstage/backstage/pull/31034) and [#30969](https://github.com/backstage/backstage/pull/30969)

### Moved the Explore search module

Just a quick note, that the search collator module for the `explore` plugin was moved to the community repository, where it fits snugly next to the plugin itself. If you are using the yarn plugin, these references should be updated automatically for you. But if you do not, just update your dependencies on `@backstage/plugin-search-backend-module-explore`, to `@backstage-community/plugin-search-backend-module-explore`.

## Security Fixes

This release does not contain any security fixes. However, it is worth calling out that OAuth cookies issued by the auth backend have changed from domain-scoped to host-only.

Contributed by [@JessicaJHee](https://github.com/JessicaJHee) in [#30922](https://github.com/backstage/backstage/pull/30922)

## Upgrade path

We recommend that you keep your Backstage project up to date with this latest release. For more guidance on how to upgrade, check out the documentation for [keeping Backstage updated](https://backstage.io/docs/getting-started/keeping-backstage-updated).

## Links and References

Below you can find a list of links and references to help you learn about and start using this new release.

- [Backstage official website](https://backstage.io/), [documentation](https://backstage.io/docs/), and [getting started guide](https://backstage.io/docs/getting-started/)
- [GitHub repository](https://github.com/backstage/backstage)
- Backstage's [versioning and support policy](https://backstage.io/docs/overview/versioning-policy)
- [Community Discord](https://discord.gg/backstage-687207715902193673) for discussions and support
- [Changelog](https://github.com/backstage/backstage/tree/master/docs/releases/v1.43.0-changelog.md)
- Backstage [Demos](https://backstage.io/demos), [Blog](https://backstage.io/blog), [Roadmap](https://backstage.io/docs/overview/roadmap) and [Plugins](https://backstage.io/plugins)

Sign up for our [newsletter](https://spoti.fi/backstagenewsletter) if you want to be informed about what is happening in the world of Backstage.
