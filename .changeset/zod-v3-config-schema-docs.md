---
'@backstage/frontend-plugin-api': patch
---

Updated error messages and deprecation warnings to clarify that the `zod/v4` subpath export from the Zod v3 package is not supported by `configSchema`, since it does not include JSON Schema conversion. The `zod` dependency has been bumped to `^4.0.0`.
