---
'@backstage/frontend-app-api': patch
---

Create the default app history only when it is first requested, avoiding unused browser listeners during app preparation. Supplied and reused histories retain their existing ownership and disposal behavior.
