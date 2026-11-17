---
'@backstage/plugin-catalog': patch
---

Fixed an issue where `<EntitySwitch>` with async conditions, such as `hasCatalogProcessingErrors`, could repeatedly call the catalog and leave the page stuck in a loading state. Conditions are now only evaluated again when the entity or the conditions themselves change, not on every re-render of the parent. When the entity is refreshed, the current content stays visible while async conditions are evaluated again, rather than being unmounted.
