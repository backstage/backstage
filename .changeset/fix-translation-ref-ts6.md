---
'@backstage/frontend-plugin-api': patch
---

Fixed `FlattenedMessages` type to avoid excessive type instantiation depth in TypeScript 6 when using `createTranslationRef` with the `translations` option.
