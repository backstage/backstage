---
'@backstage/frontend-app-api': patch
---

Added resolution of route references by installed extension ID, alongside historical page-associated routes. Named module routes follow extension override precedence, and app assembly validates target extensions and parameter contracts. External bindings also support duplicated named refs and preserve explicitly disabled defaults.
