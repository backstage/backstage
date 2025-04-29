---
'@backstage/core-plugin-api': patch
---

The `TranslationApi` now supports interpolation of JSX elements by passing them directly as values to the translation function. If any of the provided interpolation values are JSX elements, the translation function will return a JSX element instead of a string.
