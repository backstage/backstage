---
'@backstage/core-plugin-api': patch
---

The `createTranslationRef` function from the `/alpha` subpath can now also accept a nested object structure of default translation messages, which will be flatted using `.` separators.
