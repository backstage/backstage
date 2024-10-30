---
'@backstage/backend-dynamic-feature-service': patch
---

Improve the way alpha packages are supported when loading dynamic backend plugins.
The `ScannedPluginPackage` descriptor of dynamic backend plugins loaded from their alpha `package.json` now contain both the main package manifest and the alpha manifest. Previously it used to contain only the content of the alpha `package.json`, which is nearly empty.
This will make it easier to use or display metadata of loaded dynamic backend plugins, which is contained in the main manifest.
