---
'@backstage/cli-node': patch
---

The `Lockfile` class is now called `YarnLockfile`, since it only reads `yarn.lock` files. `Lockfile` is still exported as a deprecated alias, so existing imports keep working.
