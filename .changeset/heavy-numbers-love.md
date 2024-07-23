---
'@backstage/cli': patch
---

Updated default backend plugin to use `RootConfigService` instead of `Config`. This also removes the dependency on `@backstage/config` as it's no longer used.
