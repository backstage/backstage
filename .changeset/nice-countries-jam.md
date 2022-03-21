---
'@backstage/plugin-auth-backend': patch
---

Fix migrations to do the right thing on sqlite databases, and reapply the column type fix for those who are _not_ on sqlite databases.
