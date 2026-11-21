---
'@backstage/plugin-catalog-backend-module-ldap': patch
---

The scheduled refresh of the LDAP entity provider now stops when the scheduler aborts the task, for example when it times out or the backend shuts down, and an aborted refresh no longer applies a partial result to the catalog. The `read` method of `LdapOrgEntityProvider` accepts an optional `signal` option for the same purpose.
