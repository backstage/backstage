---
'@backstage/create-app': patch
---

Updated `app-config.production.yaml` to specify an empty list of catalog locations. This is done to prevent example locations stored in `app-config.yaml` from being loaded as these are examples.
