---
'@backstage/plugin-auth-backend': patch
---

User tokens issued by sign-in resolvers now always have the entity refs in their `sub` and `ent` claims in canonical form, for example `user:default/jane.doe` rather than `User:default/Jane.Doe`, and duplicate `ent` refs are removed. Previously, a custom sign-in resolver could issue valid but non-canonical refs, which then failed to match stored user info and offline sessions on case-sensitive databases.
