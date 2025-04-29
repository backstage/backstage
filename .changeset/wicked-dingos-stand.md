---
'@backstage/core-plugin-api': patch
---

Added a new `jsx` interpolation format to `TranslationsApi`. If any of the interpolations in the default translation message uses the `jsx` format, the translation function will always return a `ReactNode`.
