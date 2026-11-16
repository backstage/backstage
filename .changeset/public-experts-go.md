---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

The LDAP org entity provider now reads users and groups in parallel by default. Set `disableParallelReads: true` to use one connection and read sequentially. Parallel reads open two binds and two connections per refresh. Directories with per-client connection limits may notice the extra load after upgrading.

The org entity provider and `LdapOrgReaderProcessor` request only the attributes used by configured mappings. LDAP connections are closed after each refresh.

**BREAKING**: Searches no longer request `['*', '+']` by default. This applies to both the org entity provider and `LdapOrgReaderProcessor`. When options.attributes is not explicitly configured, attributes required by map (including custom map.\* overrides and membership mappings) are requested automatically. When options.attributes is explicitly configured, the provided list is used as-is and must include all attributes required by mappings, vendor configuration, and custom transformers. Custom transformers that access other attributes from LDAP entries may now find those attributes missing.

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
