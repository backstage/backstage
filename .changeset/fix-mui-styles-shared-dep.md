---
'@backstage/module-federation-common': patch
---

Fixed the `@mui/material/styles` shared dependency key by removing a trailing slash that caused module resolution failures with MUI package exports.
