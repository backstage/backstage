---
'@backstage/plugin-catalog-backend': patch
---

This patch addresses an issue identified in Backstage when configured with a MySQL database. If an entity of type location
(e..all.yaml) has more than 70 referenced entities, clicking "Refresh" does not update the referenced entities as expected. This occurs because the TEXT type in MySQL has a limit of 65,535 bytes, which is insufficient to store all the referenced entities, causing the refresh operation to fail.
