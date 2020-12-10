---
'@backstage/plugin-catalog-backend': patch
---

Add index to foreign key columns. Postgres (and others) do not do this on the "source" side of a foreign key relation, which was what led to the slowness on large datasets. The full LDAP dataset ingestion now takes two minutes, which is not optimal yet but still a huge improvement over before when it basically never finished :)
