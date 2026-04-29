---
'@backstage/plugin-catalog-backend': patch
---

Fixed a performance regression in the `/entity-facets` endpoint when filters or permission conditions are applied, by routing the EXISTS-based filter through `final_entities` instead of correlating against the much larger `search` table.
