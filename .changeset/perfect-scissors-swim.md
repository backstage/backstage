---
'@backstage/cli': patch
---

Fixed an issue where the `backend:dev` command would get stuck executing the backend process multiple times, causing port conflict issues.
