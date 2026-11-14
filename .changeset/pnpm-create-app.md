---
'@backstage/create-app': patch
---

Added a `--package-manager <yarn|pnpm>` option. With `pnpm`, the created app is a pnpm workspace with a `pnpm-workspace.yaml` in place of the Yarn configuration, and its scripts, Dockerfile, CI workflow, and documentation use pnpm. pnpm is also picked when the command runs through pnpm, as with `pnpm create @backstage/app`, except for a custom template from `--template-path`, which only uses pnpm with the option. pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later, is required. Apps still use Yarn by default.
