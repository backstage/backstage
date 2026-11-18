# MUI to BUI migration limits

Read in either migration path when a component or pattern has no equivalent that
preserves its behavior. These cases need deliberate design choices; an automated
recipe leaving a component unchanged does not prevent a standalone migration.

Check the target's installed BUI APIs. Retain MUI where needed, or redesign the
component while preserving its behavior and accessibility:

- Badge overlays (no safe 1:1 BUI mapping)
- `CircularProgress` / `LinearProgress` (no auto-map to Skeleton)
- `Drawer`, `Snackbar`, `Stepper`, and `Timeline`
- `@material-table/core` / material-table and broader table-system migrations
- Theme parity, dark-mode polish, and final design-token tuning after source-level migration
- Custom wrapper abstractions that hide MUI behind project-specific APIs:
  migrate the wrapper boundary by hand

Platform constraint that may still need MUI-shaped icons:

- **PageBlueprint** (`@backstage/frontend-plugin-api`): page extension `icon` values may still expect icon elements compatible with existing app icon wiring. Keep a compatible icon element when types or runtime wiring require it.

For codemod coverage, consult the
[mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe).
For direct edits, consult the target's installed APIs and
[BUI documentation](https://ui.backstage.io).
