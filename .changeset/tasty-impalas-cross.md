---
'@backstage/cli': patch
---

The `repo test`, `repo lint`, and `repo build` commands will now analyze `yarn.lock` for dependency changes when searching for changed packages. This allows you to use the `--since <ref>` flag even if you have `yarn.lock` changes.
