---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

fix: use REST API to get root group memberships for GitLab SaaS users listing

This API is the only one that shows `email` field for enterprise users and
allows to filter out bot users not using a license using the `is_using_seat`
field.

ref:

https://docs.gitlab.com/ee/user/enterprise_user/#get-users-email-addresses-through-the-api
https://docs.gitlab.com/ee/api/members.html#limitations
