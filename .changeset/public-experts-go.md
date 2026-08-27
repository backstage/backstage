---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

The LDAP org provider now parallelizes user and group reads, requests a minimal default LDAP attribute set instead of `['*', '+']` (including common identity and membership fields for OpenLDAP-compatible directories, Active Directory, and FreeIPA), and reduces memory and CPU overhead during relation resolution, hierarchy building, and entity commit. LDAP connections are closed after each refresh.

If your custom transformers rely on LDAP attributes outside the default set, override the default attributes by setting `options.attributes` (or use `['*', '+']` to request everything).
