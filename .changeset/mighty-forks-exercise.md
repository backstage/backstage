---
'@backstage/plugin-catalog-backend': patch
---

Added migration `20241003170511_alter_target_in_locations.js` to change the target column in the `locations` table to TEXT type.
Added a hash for the key column in the `refresh_keys` table.
