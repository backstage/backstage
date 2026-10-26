---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

The LDAP org provider now reads users and groups in parallel by default and requests only attributes used by configured mappings. Set `parallelReads: false` to use one connection and read sequentially. LDAP connections are closed after each refresh.

If your custom transformers rely on additional LDAP attributes, include them in `options.attributes` or use `['*', '+']` to request all attributes.
