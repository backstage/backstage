---
'@backstage/cli-module-build': patch
'@backstage/frontend-app-api': patch
---

Added an experimental `app.experimental.deferredPackages` option. When it is enabled together with `app.packages`, plugins that support it are loaded on demand instead of being included in the initial app bundle. Set it to `true`, or to an object with an `exclude` list of package names that are always loaded with the app.

Whether a plugin can be deferred is decided by analyzing its source code without running it. Plugins in the workspace of the app are analyzed when the app is built or started, and the results are cached and updated when the source changes. For published plugins, `backstage-cli package build` now writes this analysis to `dist/frontend-manifest.json`, and `backstage-cli package prepack` refers to it from the `backstage.frontendManifest` field of the published package.json. Published plugins without such a manifest are loaded with the app.

A plugin can be deferred if it only has pages and sub-pages made with `PageBlueprint.make` and `SubPageBlueprint.make` with literal params, pages made with `PageBlueprint.makeWithOverrides` whose factory only returns the original factory called with literal params, and utility APIs made with `ApiBlueprint.make`. Plugins with utility APIs must also have a `./sync` entry point, which is loaded with the app and holds the extensions that are needed before the plugin is first used. A `./sync` entry point whose extensions or route refs are not the same declarations as in the main entry point fails the package build. The CLI prints which plugins are deferred and why the others are not, including the source location of the code that prevents it.
