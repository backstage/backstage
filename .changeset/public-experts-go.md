---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

The LDAP org provider now reads users and groups in parallel and requests only attributes used by configured mappings by default. LDAP connections are closed after each refresh.

If your custom transformers rely on additional LDAP attributes, include them in `options.attributes` or use `['*', '+']` to request all attributes.
