---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Timestamps in the failed entities table now follow the user's locale. Previously they used a fixed 12-hour format without an AM/PM indicator, which made afternoon times ambiguous.
