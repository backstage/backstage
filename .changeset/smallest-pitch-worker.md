---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added a new `gitlab:repo:exists` scaffolder action that checks if a GitLab repository exists. The action outputs an `exists` boolean which can then be used to branch off in later template actions, for example guarding against missing repositories.
