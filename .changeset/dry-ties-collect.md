---
'@backstage/plugin-catalog-backend': patch
---

Added an `/entity-facets` endpoint, which lets you query the distribution of
possible values for fields of entities.

This can be useful for example when populating a dropdown in the user interface,
such as listing all tag values that are actually being used right now in your
catalog instance, along with putting the most common ones at the top.
