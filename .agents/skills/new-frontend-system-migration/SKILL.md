---
name: new-frontend-system-migration
description: Migrate a Backstage app, its frontend plugins, or both from the old frontend system to the new one. Use this skill when moving an app to the new `createApp`, adding new frontend system support to a plugin while keeping the old system working, or moving a plugin to the new frontend system entirely.
---

# New Frontend System Migration

This skill migrates a Backstage repository from the old frontend system (`@backstage/core-plugin-api`, `@backstage/app-defaults`) to the new one (`@backstage/frontend-plugin-api`, `@backstage/frontend-defaults`). It works in a repository with only plugins, with only an app, or with both.

Start here, then read only the reference you need:

- `references/app.md`: migrating the app package, in a hybrid phase and then a full migration
- `references/plugin.md`: migrating a plugin package, or part of one, either keeping old-system support or dropping it

## Check the Backstage Version

The steps target Backstage 1.49 or later. Check `backstage.json` at the root of the repository, or the `@backstage/*` versions in `package.json` if there is no `backstage.json`. If the repository is older, upgrade it first, in its own change, with `yarn backstage-cli versions:bump`. Some of the helpers the steps use, such as `convertLegacyAppOptions`, don't exist in older versions, and since 1.46 old-system hooks such as `useApp` and `useRouteRef` work in the new system without `compatWrapper`.

## Find What Needs Migrating

Check the repository before choosing a reference. Don't rely only on the user's description, and don't assume a folder layout: plugins can live in `plugins/`, in `workspaces/*/plugins/`, at the repository root, or elsewhere.

```bash
git grep -lE "createApp\(" -- '*.ts' '*.tsx'
git grep -lE "createPlugin\(" -- '*.ts' '*.tsx'
git grep -l "createFrontendPlugin" -- '*.ts' '*.tsx'
```

- **App:** Look at where the file that calls `createApp` imports it from.
  - From `@backstage/app-defaults`: the app is on the old system.
  - From `@backstage/frontend-defaults`, with `convertLegacyAppRoot` or `convertLegacyAppOptions`: the app is in hybrid mode, so phase 1 is done.
  - From `@backstage/frontend-defaults`, with neither helper: the app is migrated.
- **Plugins:** Look at each frontend plugin package.
  - `createPlugin` from `@backstage/core-plugin-api` and no `createFrontendPlugin`: not migrated.
  - Both: supports both systems, or is partly migrated, with some pages or tabs still only in the old plugin.
  - Only `createFrontendPlugin`: migrated.

Some repositories import these through their own wrapper packages that re-export `@backstage/*` packages, for example `@internal/backstage/app-defaults`. Follow such re-exports to the `@backstage/*` package they come from, and treat their imports like the original package's in every step.

If the user asked to migrate only part of the repository, migrate only that part.

## Migration Order

- **A repository with only plugins:** follow `references/plugin.md` for each plugin, one plugin per change. With no app in the repository, check each plugin through its dev app and a smoke test.
- **A repository with only an app, whose plugins come from npm:** follow `references/app.md`. Phase 2 explains what to do with npm plugins that don't support the new system yet.
- **A repository with both the app and its plugins:**
  1. Migrate the app to hybrid mode (phase 1 in `references/app.md`). Plugins that aren't migrated yet keep working through the compatibility helpers.
  2. Migrate the plugins one at a time with `references/plugin.md`. A plugin that drops old-system support needs the app on the new `createApp`, which is why phase 1 comes first. As each plugin lands, remove its legacy wiring from the app in the same change.
  3. Finish the app (phase 2 in `references/app.md`) once no plugin needs legacy wiring.

Plugins that are published, or used by other apps still on the old system, should keep old-system support, whatever the state of any app in this repository.

## Decisions to Confirm

Ask the user before starting, unless their request already answers these:

- **For each plugin:** do any apps still on the old frontend system use it? If not, it moves to the new system only. If so, it keeps old-system support.
- **For plugins that keep old-system support:** should the new plugin be the default export of the main entry, or of a separate `./alpha` entry? The `./alpha` entry is optional.
- **For the app:** should feature discovery be turned on? `references/app.md` explains when to turn it on.

`references/plugin.md` explains the plugin decisions.

## Related Skills

The references link to these skills from their steps. If they aren't installed, install them with `npx skills add https://backstage.io`, or follow the documentation links in each reference instead.

- `frontend-plugin-development`: what a finished plugin on the new frontend system looks like, including packaging, entity content, dev apps, tests, app wiring, and troubleshooting plugins that don't show up.
- `mui-to-bui-migration`: migrating page components from Material UI to Backstage UI, often done after a plugin moves to the new frontend system.
