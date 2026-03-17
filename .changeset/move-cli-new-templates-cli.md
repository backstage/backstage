---
'@backstage/cli': patch
---

The built-in `yarn new` templates have been moved to `@backstage/cli-module-new`. Existing references to `@backstage/cli/templates/*` in your root `package.json` will continue to work through a backwards compatibility rewrite in the `new` command.
