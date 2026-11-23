---
'@backstage/cli-module-package-manager-yarn': patch
'@backstage/yarn-plugin': patch
---

Updated `@yarnpkg/core` to `^4.9.3`, which fixes the broken `got` dependency published in `@yarnpkg/core@4.9.2`. The `pm verify-patches` command now works out of the box again, without adding any Yarn packages or resolutions to your project. If you added `@yarnpkg/cli`, `@yarnpkg/core`, `@yarnpkg/plugin-patch` or the `@yarnpkg/core/got` resolution to your root `package.json` for this command, you can remove them.
