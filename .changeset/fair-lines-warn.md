---
'@backstage/plugin-auth-backend-module-github-provider': minor
'@backstage/plugin-catalog-backend-module-github': minor
---

Added the `github.com/user-id` annotation to store GitHub's user ID (immutable) in user entities. Also includes addition of the `userIdMatchingUserEntityAnnotation` sign-in resolver that matches users by the new ID.
