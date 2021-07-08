---
'@backstage/plugin-catalog-backend': patch
---

The codeowners processor extracts the username of the primary owner and uses this as the owner field.
Given the kind isn't specified this is assumed to be a group and so the link to the owner in the about card
doesn't work. This change specifies the kind where the entity is a user. e.g:

`@iain-b` -> `user:iain-b`
