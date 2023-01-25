---
'@backstage/backend-plugin-api': patch
---

The `register` methods passed to `createBackendPlugin` and `createBackendModule`
now have dedicated `BackendPluginRegistrationPoints` and
`BackendModuleRegistrationPoints` arguments, respectively. This lets us make it
clear on a type level that it's not possible to pass in extension points as
dependencies to plugins (should only ever be done for modules). This has no
practical effect on code that was already well behaved.
