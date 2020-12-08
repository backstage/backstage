---
'@backstage/plugin-catalog-backend': patch
---

Support `profile` of groups including `displayName`, `email`, and `picture` in
`LdapOrgReaderProcessor`. The source fields for them can be configured in the
`ldapOrg` provider.
