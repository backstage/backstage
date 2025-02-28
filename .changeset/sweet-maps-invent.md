---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Fixed the `convertTimeToLocalTimezone` function in the FailedEntities component to correctly parse ISO 8601 date strings and set the timezone to the current local timezone.
