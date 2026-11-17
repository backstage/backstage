---
'@backstage/core-plugin-api': patch
---

Preserved the legacy `useApi` hook's direct-value behavior when the frontend
system's hook unwraps promise-valued APIs. The legacy hook continues returning
promises unchanged.
