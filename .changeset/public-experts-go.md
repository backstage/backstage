---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

The LDAP org entity provider and `LdapOrgReaderProcessor` now read users and groups in parallel by default, and request only the attributes used by configured mappings. Set `disableParallelReads: true` to use one connection and read sequentially. LDAP connections are closed after each refresh.

Parallel reads open two binds and two connections per refresh. Directories with per-client connection limits may notice the extra load after upgrading.

**BREAKING**: Searches no longer request `['*', '+']` by default. This applies to both the org entity provider and `LdapOrgReaderProcessor`. Attributes listed in `map` (including custom `map.*` overrides and membership) are still requested automatically. Set `map.members` or `map.memberOf` to `null` to skip that side of the relation tree and not request those LDAP attributes. A custom transformer that reads any other field from `entry` now gets `undefined` instead of an error.

If your transformers rely on additional LDAP attributes, include them in `options.attributes` or use `['*', '+']` to request all attributes:

```diff
 catalog:
   providers:
     ldapOrg:
       default:
         users:
           options:
+            attributes: ['*', '+']
         groups:
           options:
+            attributes: ['*', '+']
```
