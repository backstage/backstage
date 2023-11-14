---
'@backstage/core-components': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog': patch
---

Register component overrides in the global `OverrideComponentNameToClassKeys` provided by `@backstage/theme`. This will in turn will provide component style override types for `createUnifiedTheme`.
