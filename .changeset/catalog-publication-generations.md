---
'@backstage/plugin-catalog-backend': patch
---

Adds internal publication bookkeeping as groundwork for future catalog change tracking. Existing catalog APIs and deletion behavior are unchanged.

The PostgreSQL upgrade builds an index concurrently without rewriting existing entities, but still scans the catalog table. Large installations may need to prepare this index out of band before upgrading; see [Upgrading large installations](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/README.md#upgrading-large-installations).
