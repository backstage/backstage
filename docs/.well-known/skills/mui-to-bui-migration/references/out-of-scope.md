# MUI → BUI out of scope

Read when a leftover component or pattern has no safe automated mapping after `@backstage/mui4-to-bui-migration-recipe`.

Leave these on MUI (or redesign manually) unless a newer recipe README says otherwise:

- Badge overlays (no safe 1:1 BUI mapping)
- `CircularProgress` / `LinearProgress` (no auto-map to Skeleton)
- `Drawer`, `Snackbar`, `Stepper`, and `Timeline`
- `@material-table/core` / material-table and broader table-system migrations
- Perfect theme parity, dark-mode polish, and final design-token tuning after source-level migration
- Custom wrapper abstractions that hide MUI behind project-specific APIs:
  migrate the wrapper boundary by hand

Platform constraint that may still need MUI-shaped icons:

- **PageBlueprint** (`@backstage/frontend-plugin-api`): page extension `icon` values may still expect icon elements compatible with existing app icon wiring. Keep a compatible icon element when types or runtime wiring require it.

Canonical list: [mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe).
