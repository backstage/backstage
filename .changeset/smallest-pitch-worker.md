---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added a new `gitlab:repo:exists` scaffolder action that validates a GitLab repository exists. The action fails the step when the repository cannot be found, allowing templates to guard against missing repositories.
