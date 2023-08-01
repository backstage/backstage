---
'@backstage/plugin-linguist-backend': patch
---

Fixed bug in LinguistBackendClient.ts file where if the linguistJsOptions is specified and sent over to the linguist-js package it would get changed (another attribute would be added) causing future entities of the batch to fail with an error
