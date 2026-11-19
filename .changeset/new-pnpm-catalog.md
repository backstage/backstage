---
'@backstage/cli-module-new': patch
---

In pnpm workspaces, `backstage-cli new` now writes `catalog:` for the dependencies of a new package that have an entry in the default catalog of `pnpm-workspace.yaml`, so that new packages work in repositories that require catalogs, for example through the `pnpm/json-enforce-catalog` lint rule. The peer dependencies of new plugins keep the ranges of the templates, so that they keep accepting every supported React version.
