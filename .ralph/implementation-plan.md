# Implementation Plan

## Status Overview

- **Migrated (9):** Accordion, Alert, Avatar, Box, Button, ButtonIcon, ButtonLink, Card, Checkbox
- **Remaining (28):** see tasks below
- **Final cleanup:** delete useStyles + legacy types

## Reference Patterns

- **Simple consumer** (bg: 'consumer'): see Button definition.ts + Button.tsx
- **Provider with utilities** (bg: 'provider'): see Box definition.ts + Box.tsx
- **Neutral** (no bg): see Alert definition.ts + Alert.tsx
- **Multi-sub-component:** see Accordion definition.ts (multiple defineComponent calls) + Card definition.ts

## Key Migration Rules

1. definition.ts: Replace `ComponentDefinition` with `defineComponent<OwnProps>()({...})`
2. definition.ts: Move `import styles from './X.module.css'` here (remove from .tsx)
3. definition.ts: Convert `dataAttributes` map → `propDefs` with `dataAttribute: true`
4. definition.ts: Convert inline defaults → `default` in propDefs
5. definition.ts: Add `children: {}`, `className: {}`, `style: {}` to propDefs
6. .tsx: Replace `useStyles` with `useDefinition`, destructure `{ ownProps, restProps, dataAttributes }`
7. .tsx: Use `ownProps.classes.xxx` instead of `clsx(classNames.xxx, styles.xxx)`
8. .tsx: Remove `cleanedProps` usage → use `restProps` spread + `ownProps` destructuring
9. .tsx: Remove `clsx` import if no longer needed
10. .tsx: For bg providers: use `ownProps.childrenWithBgProvider` instead of manual `<BgProvider>` wrapping

## bg System Mapping

| Component       | bg value                                    |
| --------------- | ------------------------------------------- |
| Flex            | `'provider'` (currently uses useBgProvider) |
| Grid (GridRoot) | `'provider'` (currently uses useBgProvider) |
| Grid (GridItem) | `'provider'` (currently uses useBgProvider) |
| All others      | none (no bg participation)                  |

No unmigrated components use `useBgConsumer`.

---

## Tasks

### Batch 1: Simple single-file components (no bg, no utility props)

These are the simplest migrations — single component, no bg, no utility props.

- [x] **Task 1: Migrate Avatar** — Single component, has dataAttributes for `size` and `variant`. See `Avatar/definition.ts` and `Avatar/Avatar.tsx`.
- [x] **Task 1.5: Fix Avatar types** — `types.ts` is not according to the qa criteria. See `Avatar/types.ts`.
- [x] **Task 2: Migrate Checkbox** — Single component, dataAttributes for `selected` and `indeterminate`. See `Checkbox/definition.ts` and `Checkbox/Checkbox.tsx`.
- [ ] **Task 3: Migrate Container** — Single component, dataAttributes for `maxWidth`. See `Container/definition.ts` and `Container/Container.tsx`.
- [ ] **Task 4: Migrate FieldError** — Single component, no dataAttributes. See `FieldError/definition.ts` and `FieldError/FieldError.tsx`.
- [ ] **Task 5: Migrate FieldLabel** — Single component, dataAttributes for `size` and `disabled`. See `FieldLabel/definition.ts` and `FieldLabel/FieldLabel.tsx`.
- [ ] **Task 6: Migrate Link** — Single component, dataAttributes for `variant`. See `Link/definition.ts` and `Link/Link.tsx`.
- [ ] **Task 7: Migrate Skeleton** — Single component, dataAttributes for `variant`. See `Skeleton/definition.ts` and `Skeleton/Skeleton.tsx`.
- [ ] **Task 8: Migrate Switch** — Single component, dataAttributes for `labelPosition`. See `Switch/definition.ts` and `Switch/Switch.tsx`.
- [ ] **Task 9: Migrate Tooltip** — Single component, no dataAttributes. See `Tooltip/definition.ts` and `Tooltip/Tooltip.tsx`.
- [ ] **Task 10: Migrate VisuallyHidden** — Single component, no dataAttributes. See `VisuallyHidden/definition.ts` and `VisuallyHidden/VisuallyHidden.tsx`.
- [ ] **Task 11: Migrate Popover** — Single component, dataAttributes for `placement` and `triggerAction`. See `Popover/definition.ts` and `Popover/Popover.tsx`.
- [ ] **Task 12: Migrate FullPage** — Single component, no dataAttributes. See `FullPage/definition.ts` and `FullPage/FullPage.tsx`.
- [ ] **Task 13: Migrate ToggleButton** — Single component, dataAttributes for `size` and `variant`. See `ToggleButton/definition.ts` and `ToggleButton/ToggleButton.tsx`.
- [ ] **Task 14: Migrate ToggleButtonGroup** — Single component, dataAttributes for `orientation`. See `ToggleButtonGroup/definition.ts` and `ToggleButtonGroup/ToggleButtonGroup.tsx`.

### Batch 2: Form components (single-file, no bg, no utility props)

- [ ] **Task 15: Migrate PasswordField** — Single component, dataAttributes for `size`. See `PasswordField/definition.ts` and `PasswordField/PasswordField.tsx`.
- [ ] **Task 16: Migrate SearchField** — Single component, dataAttributes for `size`. See `SearchField/definition.ts` and `SearchField/SearchField.tsx`.
- [ ] **Task 17: Migrate TextField** — Single component, dataAttributes for `size`. See `TextField/definition.ts` and `TextField/TextField.tsx`.

### Batch 3: Components with utility props (no bg)

- [ ] **Task 18: Migrate Text** — Has utilityProps. dataAttributes for `variant`, `color`, `weight`, `truncate`, `align`. See `Text/definition.ts` and `Text/Text.tsx`.

### Batch 4: Components with bg: 'provider' + utility props

- [ ] **Task 19: Migrate Flex** — bg provider with utilityProps. Currently manually calls useBgProvider and wraps in BgProvider. See `Flex/definition.ts` and `Flex/Flex.tsx`.
- [ ] **Task 20: Migrate Grid** — bg provider with utilityProps. Has two sub-components: GridRoot and GridItem, both use useBgProvider. See `Grid/definition.ts` and `Grid/Grid.tsx`.

### Batch 5: Multi-sub-component directories

- [ ] **Task 21: Migrate Dialog** — Multiple sub-components (Dialog, DialogHeader, DialogBody, DialogFooter, DialogCloseButton). See `Dialog/definition.ts` and `Dialog/Dialog.tsx`.
- [ ] **Task 22: Migrate HeaderPage** — Multiple sub-components (HeaderPage, HeaderPageContent). See `HeaderPage/definition.ts` and `HeaderPage/HeaderPage.tsx`.
- [ ] **Task 23: Migrate PluginHeader** — Multiple sub-components (PluginHeader, PluginHeaderToolbar). See `PluginHeader/definition.ts` and `PluginHeader/PluginHeader.tsx` + `PluginHeaderToolbar.tsx`.
- [ ] **Task 24: Migrate RadioGroup** — Multiple sub-components (RadioGroup, Radio). See `RadioGroup/definition.ts` and `RadioGroup/RadioGroup.tsx`.
- [ ] **Task 25: Migrate Select** — Multiple sub-components (Select, SelectContent, SelectTrigger, SelectListBox). See `Select/definition.ts` and `Select/Select.tsx` + sub-files.
- [ ] **Task 26: Migrate Table** — Many sub-components (TableRoot, TableHeader, TableBody, Row, Column, Cell, CellText, CellProfile). See `Table/definition.ts` and multiple .tsx files.
- [ ] **Task 27: Migrate TablePagination** — Single component but has dataAttributes. See `TablePagination/definition.ts` and `TablePagination/TablePagination.tsx`.
- [ ] **Task 28: Migrate Tabs** — Multiple sub-components (Tabs, TabList, Tab, TabPanel, TabsIndicators). See `Tabs/definition.ts` and `Tabs/Tabs.tsx` + `TabsIndicators.tsx`.
- [ ] **Task 29: Migrate TagGroup** — Multiple sub-components (TagGroup, TagList, Tag). See `TagGroup/definition.ts` and `TagGroup/TagGroup.tsx`.
- [ ] **Task 30: Migrate Menu** — Complex, multiple sub-components (Menu, MenuTrigger, MenuPopover, MenuContent, MenuItem, MenuSection, MenuSectionHeader, MenuSeparator, SubmenuTrigger). See `Menu/definition.ts` and `Menu/Menu.tsx`.

### Batch 6: Final cleanup

- [ ] **Task 31: Delete useStyles hook** — Remove `packages/ui/src/hooks/useStyles.ts`. Only after all components are migrated.
- [ ] **Task 32: Remove legacy types** — Remove `ComponentDefinition`, `ClassNamesMap`, `DataAttributeValues`, `DataAttributesMap` from `packages/ui/src/types.ts`. Verify nothing else imports them.
- [ ] **Task 33: Verify build and API reports** — Run `yarn tsc`, `yarn build:api-reports packages/ui`, check for no CSS changes, verify no changes outside packages/ui. Create changeset if API report changed.

## Discoveries / Notes

- 7 of 37 styled components already migrated (~19%)
- Only 3 sub-components need bg: 'provider' (Flex, GridRoot, GridItem). No unmigrated components use useBgConsumer.
- InternalLinkProvider is a context provider, not a styled component — no migration needed.
- useStyles.ts already imports helpers from useDefinition (resolveResponsiveValue, processUtilityProps), confirming shared infrastructure.
