---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Fixed the `convertTimeToLocalTimezone` function in the FailedEntities compoent to correctly parse ISO 8601 date strings and format them as `M/d/yyyy, h:mm:ss a`.
