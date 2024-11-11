---
'@backstage/plugin-catalog-backend': minor
---

Drop redundant indices from the database.

The following redundant indices are removed in this version:

- `final_entities_entity_id_idx` - overlaps with `final_entities_pkey`
- `refresh_state_entity_id_idx` - overlaps with `refresh_state_pkey`
- `refresh_state_entity_ref_idx` - overlaps with `refresh_state_entity_ref_uniq`
- `search_key_idx` and `search_value_idx` - these were replaced by the composite index `search_key_value_idx` in #22594

No negative end user impact is expected, but rather that performance should increase due to less index churn.
