---
'@backstage/cli': patch
---

The build commands now support the new `backstage.inline` flag in `package.json`, which causes the contents of private packages to be inlined into the consuming package, rather than be treated as an external dependency.
