---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Fixed an accessibility issue where multiple raw entity definition dialogs on the same page shared a duplicate `id` attribute, which could break screen reader label associations.

Timestamps in the failed and pending entity tables are now displayed using a 24-hour clock. Previously they were rendered as 12-hour values without an AM/PM indicator, which made afternoon times ambiguous.

The failed entities table now refreshes automatically after an entity is deleted, instead of keeping the deleted row visible until the page is reloaded.
