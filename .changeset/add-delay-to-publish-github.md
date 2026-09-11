---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Adding delay to publish:github action. In some organizations adding delay can prevent failure of this action. It can happen after repository is created and when collaborators are being added.
