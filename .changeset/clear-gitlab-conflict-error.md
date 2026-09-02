---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Throw a `ConflictError` with a clear message when `publish:gitlab` is called and the target repository already exists, instead of letting the GitLab API return a `GitbeakerRequestError` with a raw JSON body such as `{"name":["has already been taken"]}`.
