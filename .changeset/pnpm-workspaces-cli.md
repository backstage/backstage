---
'@backstage/cli': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-info': patch
'@backstage/cli-module-lint': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
'@backstage/cli-module-test-jest': patch
---

Added experimental support for pnpm workspaces. Commands detect pnpm from the `packageManager` or `devEngines.packageManager` field of the root `package.json`, from `pnpm-lock.yaml`, or from `pnpm-workspace.yaml`, and then run pnpm and read `pnpm-lock.yaml` where they would run Yarn and read `yarn.lock`. pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later, is required by the commands that run pnpm. Commands that only read the project files, such as `repo test`, also work where pnpm is not installed, for example in the sandbox of a build system. Yarn projects are detected and handled as before.
