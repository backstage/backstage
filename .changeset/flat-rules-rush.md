---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

fix: use publicEmail in GitLab client

client was using commitEmail that is visible only for self-managed GitLab admins. publicEmail is visible, but only if the user explicitly enable the corresponding setting on GitLab.
