---
name: frontend-plugin-development
description: Reference for building, wiring, running, and testing Backstage frontend plugins on the new frontend system. Use this skill when writing or changing a plugin built with `createFrontendPlugin`, adding entity page content, setting up a plugin's dev app or tests, wiring a plugin into an app, or debugging why a plugin, page, tab, API, or feature flag does not show up or fails at startup.
---

# Frontend Plugin Development

This skill collects the checks and traps that matter when working on a plugin built with `createFrontendPlugin` from `@backstage/frontend-plugin-api`. Most of these fail silently or only at runtime, so `yarn tsc` and `yarn lint` will not catch them.

It is a reference, not a procedure. Read only the reference that matches the task. The migration skills (`plugin-full-frontend-system-migration`, `plugin-new-frontend-system-support`, `app-frontend-system-migration`) link here from their steps.

## References

| Read                                               | When                                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Plugin packaging](references/plugin-packaging.md) | Creating or changing a plugin's entry point, `package.json`, exports, extension names, or feature flags                                  |
| [App integration](references/app-integration.md)   | Installing a plugin in an app, removing legacy wiring for it, moving redirects, or enabling and disabling its extensions in `app-config` |
| [Entity content](references/entity-content.md)     | Adding or changing a tab on the catalog entity page with `EntityContentBlueprint`                                                        |
| [Dev app](references/dev-app.md)                   | Setting up or fixing `dev/index.tsx` with `@backstage/frontend-dev-utils`, or providing APIs the plugin needs when it runs on its own    |
| [Testing](references/testing.md)                   | Adding a plugin smoke test, or providing APIs to components and hooks in tests                                                           |
| [Troubleshooting](references/troubleshooting.md)   | An error message or symptom at startup or runtime: missing plugin, missing page or tab, duplicate tab, API errors, ignored feature flags |

## Check the dev app after a change

`yarn tsc`, lint, and unit tests do not catch most of the problems in these references. After changing a plugin, start its dev app (`yarn start` from the plugin directory) and check that:

- The page renders the plugin's content, not an error page or an error panel.
- The browser console has no `App startup encountered warnings:` block.

See [Troubleshooting](references/troubleshooting.md) for what each message means.

## Reference

- [Building frontend plugins](https://backstage.io/docs/frontend-system/building-plugins/)
- [Testing frontend plugins](https://backstage.io/docs/frontend-system/building-plugins/testing)
- [Common extension blueprints](https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints)
- [Installing plugins](https://backstage.io/docs/frontend-system/building-apps/installing-plugins)
- Analytics events and their tests: `plugin-analytics-instrumentation` skill
