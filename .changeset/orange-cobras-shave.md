---
'@backstage/plugin-jenkins-backend': patch
---

Jenkins plugin supports permissions now. We have added a new permission, so you can manage the permission for the users.
A new permission `jenkinsExecutePermission` is provided in `jenkins-common` package. This permission rule will be applied to check rebuild actions
if user is allowed to execute this action.

> We use 'catalog-entity' as a resource type, so you need to integrate a policy to handle catalog-entity resources

> You need to use this permission in your permission policy to check the user role/rights and return
> `AuthorizeResult.ALLOW` to allow rebuild action to logged user. (e.g: you can check if user or related group owns the entity)
