---
'@backstage/backend-plugin-api': minor
---

Added support for extension point factories. This makes it possible to call `registerExtensionPoint` with a single options argument and provide a factory for the extension point rather than a direct implementation. The factory is passed a context with a `reportModuleStartupFailure` method that makes it possible for plugins to report and attribute startup errors to the module that consumed the extension point.
