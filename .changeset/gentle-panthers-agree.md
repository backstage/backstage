---
'@backstage/connections': patch
---

Connection types can now declare a whole-connection validation step that runs after the configuration schemas have parsed, enabling rules that span multiple auth entries or combine connection settings with auth entries.
