---
'@backstage/core-components': patch
---

The `SignInPage` guest provider will now fall back to legacy guest auth if the backend request fails, allowing guest auth without a running backend.
