---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

The Gitlab configuration supports an additional optional boolean key `catalog.providers.gitlab.<your-org>.restrictUsersToGroup`. Setting this to `true` will make Backstage only import users from the group defined in in the `group` key, instead of all users in the organisation (self-hosted) or of the root group (SaaS). It will default to false, keeping the original implementation intact, when not explicitly set.
