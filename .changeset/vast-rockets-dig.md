---
'@backstage/plugin-auth-backend-module-gitlab-provider': minor
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

Added the `{gitlab-integration-host}/user-id` annotation to store GitLab's user ID (immutable) in user entities. Also includes addition of the `userIdMatchingUserEntityAnnotation` sign-in resolver that matches users by the new ID.
