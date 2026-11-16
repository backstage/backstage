---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the deprecated `IconComponent` export. Use `IconElement` and pass `<MyIcon />` rather than `MyIcon` when working with icons in the new frontend system. Legacy integrations that still need a component type can import `IconComponent` from `@backstage/core-plugin-api`. Auth provider icons continue to accept components with the same optional `fontSize` prop.
