---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added two optional inputs to the `publish:gitlab` action:

- `settings.name`: set a custom human-readable project title that differs from the repository slug.
- `ownerUsername`: add a specific GitLab user as project owner (access level 50) of the newly created repository. Requires a privileged token in the integration configuration.
