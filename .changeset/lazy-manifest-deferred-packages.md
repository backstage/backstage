---
'@backstage/cli-module-build': patch
---

Frontend plugins that are built as module federation remotes, with `package build --module-federation` or `package bundle`, now get a `frontend-manifest.json` file next to `mf-manifest.json`. It describes each exposed plugin and module, and whether the plugin can be deferred, which lets an app load the plugin on demand. Whether a plugin can be deferred is decided by analyzing its source code without running it, and the reason a plugin can't be deferred is recorded in the file together with the source location of the code that prevents it.

A plugin can be deferred if it only has pages and sub-pages made with `PageBlueprint.make` and `SubPageBlueprint.make` with literal params, and pages made with `PageBlueprint.makeWithOverrides` whose factory only returns the original factory called with literal params. Plugins that provide utility APIs are always loaded with the app.
