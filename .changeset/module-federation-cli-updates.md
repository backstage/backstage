---
'@backstage/cli': patch
---

Removed the `EXPERIMENTAL_MODULE_FEDERATION` environment variable flag, making module federation host support always available during `package start`. The host shared dependencies are now managed through `@backstage/module-federation-common` and injected as a versioned runtime script at build time.
