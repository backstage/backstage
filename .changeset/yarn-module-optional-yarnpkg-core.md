---
'@backstage/cli-module-package-manager-yarn': patch
---

Made `@yarnpkg/cli`, `@yarnpkg/core`, and `@yarnpkg/plugin-patch` optional peer dependencies. `@yarnpkg/core@4.9.2` was published with a dependency on a patch file that only exists in the Yarn repository, which made installation fail for all projects depending on this module. The `pm verify-patches` command is temporarily unavailable unless these packages are installed, and will be restored once a fixed version of `@yarnpkg/core` is published.
