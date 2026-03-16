---
'@backstage/plugin-app': patch
---

Updated the default `PluginWrapperApi` implementation to support the new `useWrapperValue` hook and root wrapper. The root wrapper is now rendered in the app root to manage shared hook state across plugin wrapper instances.
