---
'@backstage/core-compat-api': patch
---

Preserved legacy route-reference conversion when upgrading to extension-targeted frontend routes. Converted legacy refs retain their explicit page or routing-shim association, and structural refs can still be used as explicit legacy mount points.

Converting a new-system reference for use in the legacy system also supplies a best-effort analytics ID based on its description.
