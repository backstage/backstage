# Backstage UI Workspace

> **Work in progress** — this workspace is not yet in use and should not be considered stable or production-ready.

This is a standalone [Yarn workspace](https://yarnpkg.com/features/workspaces) that will house the Backstage UI library packages. It is being set up as a fully isolated workspace within the Backstage monorepo, with its own dependency tree, lockfile, and tooling configuration, independent of the root workspace.

The goal is to allow the UI packages to be developed, tested, and released independently from the rest of the monorepo.
