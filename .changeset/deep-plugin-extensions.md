---
'@backstage/frontend-plugin-api': patch
---

Fixed a "Type instantiation is excessively deep and possibly infinite" error from `createFrontendPlugin` in plugins with many extensions, in particular with TypeScript 5.9 and later. In rare cases, the extensions in the type of a plugin may be in a different order or include extensions that were missing before.
