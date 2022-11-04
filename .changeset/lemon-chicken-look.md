---
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
---

When fetching objects from one cluster fails for a non-HTTP-status-related
reason (like an ENOTFOUND or other system/socket error), Backstage now surfaces
the failure in the frontend, gracefully merged with any successfully-fetched
objects.
