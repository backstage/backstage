---
'@backstage/backend-common': patch
---

Adds config option `backend.database.role` to set ownership for newly created schemas and tables in Postgres

The example config below connects to the database as user `v-backstage-123` but sets the ownership of
the create schemas and tables to `backstage`

```yaml
backend:
  database:
    client: pg
    pluginDivisionMode: schema
    role: backstage
    connection:
      user: v-backstage-123
      ...
```
