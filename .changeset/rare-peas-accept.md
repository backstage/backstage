---
'@backstage/plugin-catalog-backend': patch
---

Batch the writing of statuses after refreshes. This reduced the runtime on sqlite from 16s to 0.2s, and on pg from 60s to 1s on my machine, for the huge LDAP set.
