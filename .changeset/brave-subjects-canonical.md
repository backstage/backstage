---
'@backstage/plugin-auth-backend': patch
---

User tokens issued by sign-in resolvers now always have their `sub` claim in canonical entity ref form, for example `user:default/jane.doe` rather than `User:default/Jane.Doe`. Previously, a custom sign-in resolver could issue a valid but non-canonical subject, which then failed to match stored user info and offline sessions on case-sensitive databases.
