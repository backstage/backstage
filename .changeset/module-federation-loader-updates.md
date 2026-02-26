---
'@backstage/frontend-dynamic-feature-loader': patch
---

Updated module federation integration to use `@module-federation/enhanced/runtime` `createInstance` API and the new `loadModuleFederationHostShared` from `@backstage/module-federation-common` for loading shared dependencies. Also added support for passing a pre-created `ModuleFederation` instance via the `moduleFederation.instance` option.
