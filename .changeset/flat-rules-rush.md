---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

fix: use REST API to get root group memberships for GitLab SaaS users listing

This API is the only one that shows `email` field for enterprise users and
allows to filter out bot users not using a license using the `is_using_seat`
field.

We also added the annotation `gitlab.com/saml-external-uid` taking the value
of `group_saml_identity.extern_uid` of the `groups/:group-id/members` endpoint
response. This is useful in case you want to create a `SignInResolver` that
references the user with the id of your identity provider (e.g. OneLogin).

ref:

https://docs.gitlab.com/ee/user/enterprise_user/#get-users-email-addresses-through-the-api
https://docs.gitlab.com/ee/api/members.html#limitations
