---
'@backstage/backend-app-api': minor
---

Add optional `beginAt` timestamps to `PluginStartupResult` and `ModuleStartupResult` in the `BackendStartupResult` returned by `backend.start()`. The new timestamp marks when a plugin's or module's init function was invoked, i.e. after its dependencies were resolved. Together with the existing `resultAt` this makes it possible to see how long each individual plugin's or module's init function took, separate from time spent waiting for other plugins to initialize. It is undefined when a plugin or module failed before reaching initialization.
