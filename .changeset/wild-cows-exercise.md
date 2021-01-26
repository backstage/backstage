---
'@backstage/plugin-catalog': minor
'@backstage/create-app': minor
---

`@backstage/plugin-catalog` stopped exporting hooks and helpers for other
plugins. They are migrated to `@backstage/plugin-catalog-common-react`.
Change both your dependencies and imports to the new package.
