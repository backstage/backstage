---
'@backstage/backend-dynamic-feature-service': patch
---

Fixed `resolvePackagePath` resolution for bundled dynamic plugins. When a plugin bundles its own copy of `@backstage/backend-plugin-api` inside `node_modules`, the `CommonJSModuleLoader` fallback now correctly resolves the plugin's `package.json` by name. Previously the fallback only applied when the resolution originated from the host application; it now also applies when originating from a bundled dependency, which is the case for plugins produced by the `backstage-cli package bundle` command.
