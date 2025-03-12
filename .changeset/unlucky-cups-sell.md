---
'@backstage/plugin-catalog-backend-module-ldap': patch
---

Fix `config.d.ts` for `ldapOrg` being incorrect. The documentation says a single
object or an array are accepted, but the definition only allows an object.
