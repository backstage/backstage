---
'@backstage/plugin-scaffolder-backend': patch
---

# Repo visibility for GitLab and BitBucket repos

**NOTE: This changes default repo visibility from `private` to `public` for GitLab and BitBucket** which
is consistent with the GitHub default. If you were counting on `private` visibility, you'll need to update
your scaffolder config to use `private`.

This adds repo visibility feature parity with GitHub for GitLab and BitBucket.

To configure the repo visibility, set scaffolder._type_.visibility as in this example:

```yaml
scaffolder:
  github:
    visibility: private # 'public' or 'internal' or 'private' (default is 'public')
  gitlab:
    visibility: public # 'public' or 'internal' or 'private' (default is 'public')
  bitbucket:
    visibility: public # 'public' or 'private' (default is 'public')
```
