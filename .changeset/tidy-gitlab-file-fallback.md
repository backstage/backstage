---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `publish:gitlab:merge-request` and `gitlab:repo:push` failing with "A file with this name already exists" when `commitAction` is `auto` and the repository file list cannot be fetched, for example when the request times out on a large repository. The actions now check each file individually in that case, instead of treating every file as new.
