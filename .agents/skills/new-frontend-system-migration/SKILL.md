---
name: new-frontend-system-migration
description: Migrate a Backstage app, its frontend plugins, or both from the old frontend system to the new one. Use this skill when moving an app to the new `createApp`, adding new frontend system support to a plugin while keeping the old system working, or moving a plugin to the new frontend system entirely.
---

# New Frontend System Migration

This skill migrates a Backstage repository from the old frontend system (`@backstage/core-plugin-api`, `@backstage/app-defaults`) to the new one (`@backstage/frontend-plugin-api`, `@backstage/frontend-defaults`). It covers the app package, plugin packages, and repositories that have both.

Start here, then read only the reference you need:

- `references/app.md`: migrating the app package, in a hybrid phase and then a full migration
- `references/plugin.md`: migrating one plugin package, either keeping old-system support or dropping it

It is highly recommended to be on Backstage version 1.49.x or above before starting. Check the version in `backstage.json` at the root of the repository.

## Find What Needs Migrating

Check the repository before choosing a reference. Don't rely only on the user's description.

- **App:** Look at the `createApp` import in the app package, usually `packages/app/src/App.tsx`.
  - From `@backstage/app-defaults`: the app is on the old system.
  - From `@backstage/frontend-defaults`, with `convertLegacyAppRoot` or `convertLegacyAppOptions`: the app is in hybrid mode, so phase 1 is done.
  - From `@backstage/frontend-defaults`, with neither helper: the app is migrated.
- **Plugins:** Look at each frontend plugin package.
  - `createPlugin` from `@backstage/core-plugin-api` and no `createFrontendPlugin`: not migrated.
  - Both: already supports both systems.
  - Only `createFrontendPlugin`: migrated.

```bash
grep -rl "@backstage/app-defaults\|@backstage/frontend-defaults" packages/*/src
grep -rlE "createPlugin\(" plugins/*/src
grep -rl "createFrontendPlugin" plugins/*/src
```

If the user asked to migrate only part of the repository, migrate only that part.

## Migration Order

- **Only the app:** follow `references/app.md`.
- **Only plugins:** follow `references/plugin.md` for each plugin, one plugin per change.
- **Both the app and its plugins in one repository:**
  1. Migrate the app to hybrid mode (phase 1 in `references/app.md`). Plugins that aren't migrated yet keep working through the compatibility helpers.
  2. Migrate the plugins one at a time with `references/plugin.md`. A plugin that drops old-system support needs the app on the new `createApp`, which is why phase 1 comes first. As each plugin lands, remove its legacy wiring from the app in the same change.
  3. Finish the app (phase 2 in `references/app.md`) once no plugin needs legacy wiring.

Plugins that are published, or used by other apps still on the old system, should keep old-system support, whatever the state of the app in this repository.

## Decisions to Confirm

Ask the user before starting, unless their request already answers these:

- **For each plugin:** do any apps still on the old frontend system use it? If not, it moves to the new system only. If so, it keeps old-system support.
- **For plugins that keep old-system support:** should the new plugin be the default export of the main entry, or of a separate `./alpha` entry? The `./alpha` entry is optional.

`references/plugin.md` explains both decisions.

## Related Skills

- `frontend-plugin-development`: what a finished plugin on the new frontend system looks like, including packaging, entity content, dev apps, tests, app wiring, and troubleshooting plugins that don't show up. The references in this skill link to it from their steps.
- `mui-to-bui-migration`: migrating page components from Material UI to Backstage UI, often done after a plugin moves to the new frontend system.
