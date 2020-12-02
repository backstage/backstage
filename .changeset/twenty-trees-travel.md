---
'@backstage/plugin-catalog': patch
---

Use the OWNED_BY relation and compare it to the users MEMBER_OF relation. The user entity is searched by name, based on the userId of the identity.
