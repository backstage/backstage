---
'@backstage/backend-common': patch
---

Support a `ensureExists` config option to skip ensuring a configured database exists. This allows deployment scenarios where
limited permissions are given for provisioned databases without privileges to create new databases. If set to `false`, the
database connection will not be validated prior to use which means the backend will not attempt to create the database if it
doesn't exist. You can configure this in your app-config.yaml:

```yaml
backend:
  database:
    ensureExists: false
```

This defaults to `true` if unspecified. You can also configure this per plugin connection and will override the base option.
