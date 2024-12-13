---
'@backstage/plugin-catalog-backend': patch
---

Updated condition in resolveCodeOwner to fix a bug where normalizeCodeOwner could potentially be called with an invalid arg causing an error in CodeOwnersProcessor.
