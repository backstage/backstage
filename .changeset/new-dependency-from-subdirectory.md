---
'@backstage/cli-module-new': patch
---

The `new` command now adds the dependency on a new plugin to the app or backend also when it runs in a subdirectory of the project. It used to fail there, or write the `package.json` to a path below the current directory.
