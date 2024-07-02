---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

**BREAKING**: `readLdapOrg` and the `LdapProviderConfig` type now always accept arrays of user and group configs, not just single items.

Added support for single ldap catalog provider to provide list and undefined user and group bindings next to standard single one.
