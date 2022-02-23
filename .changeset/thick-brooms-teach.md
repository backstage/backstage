---
'@backstage/cli': patch
---

Fix building of backends with `repo build --all`, where it would previously only work if the build was executed within the backend package.
