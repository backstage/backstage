---
'@backstage/backend-app-api': patch
---

Fix auth cookie issuance for split backend deployments by preferring to set it against the request target host instead of origin
