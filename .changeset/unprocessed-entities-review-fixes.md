---
'@backstage/plugin-catalog-unprocessed-entities': patch
---

The delete buttons in the failed entities table now name the entity they act on in their accessible label, so screen reader users can tell the buttons apart.

Timestamps in the failed and pending entity tables are now displayed using a 24-hour clock. Previously they were rendered as 12-hour values without an AM/PM indicator, which made afternoon times ambiguous.

The failed entities table now refreshes automatically after an entity is deleted, instead of keeping the deleted row visible until the page is reloaded.

Notifications shown after deleting an entity now fall back to the entity's internal identifier when it has no entity reference, instead of displaying `undefined`.
