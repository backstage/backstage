---
'@backstage/plugin-catalog-backend': patch
---

Updates the `DefaultProcessingDatabase` to accept a refresh interval function instead of a fixed refresh interval in seconds which used to default to 100s. The catalog now ships with a default refresh interval function that schedules entities for refresh every 100-150 seconds, this should
help to smooth out bursts that occur when a lot of entities are scheduled for refresh at the same second.

Custom `RefreshIntervalFunction` can be implemented and passed to the CatalogBuilder using `.setInterval(fn)`
