---
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-search': patch
---

Update for the `qs` library bump: the old array limit setting has changed to be more strict; you can no longer just give a zero to mean unlimited. So we choose an arbitrary high value, to at least go higher than the default 20.
