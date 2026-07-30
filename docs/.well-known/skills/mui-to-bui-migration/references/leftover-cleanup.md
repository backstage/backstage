# Leftover cleanup after the MUI → BUI recipe

Read when finishing styling tokens, icons, or ambiguous layout after `@backstage/mui4-to-bui-migration-recipe` has run. Use only after the recipe; the recipe still owns covered components.

## Resolve markers

1. Grep for `TODO(backstage-codemod)` and handle each site.
2. Grep for `@material-ui/` and `@mui/`.
3. For each remaining import, check `out-of-scope.md` before inventing a mapping.

## Common follow-ups

- **Paper:** The layout transform never maps Paper to `Surface`. Bare Paper often becomes `Box bg="neutral"` plus a verify TODO (MUI elevation chrome dropped). Card-like Paper may become `Card`. Ambiguous elevation/variant cases stay marked — choose deliberately.
- **Button `outlined`:** Maps to `variant="secondary"` (BUI secondary is the outlined visual). Confirm destructive/secondary intent where TODOs remain.
- **Density:** BUI controls default to `size="small"`. The recipe often emits `size="medium"` when MUI omitted size so visuals stay closer to MUI defaults — keep those props unless a deliberate density change is intended.
- **Icons:** Unknown `@material-ui/icons` may be left for manual Remix picks at https://remixicon.com/
- **CSS modules:** Complete any `makeStyles` / JSS blocks the styles transform only partially extracted. Prefer BUI CSS variables from https://ui.backstage.io over memorized aliases (token names can change across releases).

## External docs

- Recipe details: https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe
- BUI docs: https://ui.backstage.io
- Example migration PR: https://github.com/backstage/backstage/pull/31631
