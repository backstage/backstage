---
'@backstage/create-app': minor
---

Removed `@backstage/plugin-welcome`, no new updates to the packages will be
published in the future.

The welcome plugin was used by early alpha versions of Backstage, but today only
contained a simple page with welcome instructions. It was superseded by
`@backstage/plugin-home` which can be used to build a homepage customized to the
needs of your organization.

If it's still used in your app, remove the dependency from your `package.json`
as well as left over code.
