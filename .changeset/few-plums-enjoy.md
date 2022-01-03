---
'@backstage/backend-common': patch
---

Updated the Git class with the following:

- Added `depth` and `noCheckout` options to Git clone, using these you can create a bare clone that includes just the git history
- New `log` function which you can use to view the commit history of a git repo
