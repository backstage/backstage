---
'@backstage/create-app': patch
---

Cleaned out the `peerDependencies` in the published version of the package, making it much quicker to run `npx @backstage/create-app` as it no longer needs to install a long list of unnecessary.
