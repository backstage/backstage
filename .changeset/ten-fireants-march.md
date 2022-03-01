---
'@backstage/plugin-jenkins': minor
---

Jenkins plugin supports permissions now. We have added a new permission, so you can manage the permission for the users. See relates notes for `jenkins-plugin` for more details.

Rebuild action will be disabled if the user does not have necessary rights to execute rebuild action. A permission policy (defined in backend) must handle and check the identity rights
and return `AuthorizeResult.ALLOW` if user is allowed to execute rebuild action.
