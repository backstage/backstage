---
'@backstage/create-app': patch
---

Added `classic-dedupe` script that uses `yarn-deduplicate` to deduplicate the `yarn.lock` file. Run it using `yarn classic-dedupe`

Note: for those using Yarn 3+ this is not needed, please use the built in `yarn dedupe`
