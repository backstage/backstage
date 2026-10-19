---
'@backstage/plugin-catalog-backend': patch
---

On PostgreSQL, deleting an entity now leaves an internal tombstone in place of its published row, as groundwork for future catalog change tracking. Deleted entities still disappear from all catalog APIs, but only once the deletion has been processed in the background, usually within seconds, rather than immediately. An entity that is deleted and later created again still gets a new `metadata.uid`. MySQL and SQLite are unaffected.
