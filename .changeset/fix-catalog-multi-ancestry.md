---
'@backstage/plugin-catalog-backend': patch
---

Fixed a bug where multiple locations pointing to the same entity file would result in only the last processed location being recorded as the entity's ancestor. When multiple parents with null location keys reference the same child entity, all of them are now correctly preserved as ancestors. A parent only takes exclusive ownership (removing other references) when it explicitly claims an entity by transitioning its location key from null to a specific key.
