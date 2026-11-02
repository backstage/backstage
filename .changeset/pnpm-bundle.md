---
'@backstage/cli-module-build': patch
---

`package bundle` now supports pnpm projects. The bundle gets its own `pnpm-workspace.yaml` with `nodeLinker: hoisted`, the `overrides` of the project, and the settings that decide where pnpm caches packages and what the lockfile resolves to, including patch files and pnpmfiles. A missing patch file fails the command. The registry settings of the root `.npmrc` file are copied as well, and credentials in registry URLs are left out, also in `pnpm-workspace.yaml`. Auth settings are not copied. The seeded `pnpm-lock.yaml` is pruned and installed offline. When the pnpm cache lacks a package, the command fails and names the package and the settings that decide where pnpm looks for it.
