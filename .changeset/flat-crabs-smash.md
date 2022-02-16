---
'@backstage/cli': patch
---

The `versions:bump` command now filters out `npm_` environment configuration when running `yarn install`. This has the effect of allowing it to consider local configuration files within the repository, which is the behavior that one would expect.
