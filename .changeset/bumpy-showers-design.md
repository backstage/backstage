---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

If the commit action is not `create` log a more appropriate error message to the end user advising that the files they're trying to modify might not exist
