# Implementation Plan

## Status Overview

- **Migrated (28):** Accordion, Alert, Avatar, Box, Button, ButtonIcon, ButtonLink, Card, Checkbox, Container, Dialog, FieldError, FieldLabel, Flex, FullPage, Grid, Link, PasswordField, Popover, SearchField, Skeleton, Switch, Text, TextField, ToggleButton, ToggleButtonGroup, Tooltip, VisuallyHidden
- **Remaining (9 component tasks + 3 cleanup):** see tasks below
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
- [x] **Task 3: Migrate Container** — Has utilityProps, no dataAttributes. User style overrides utilityStyle.
- [x] **Task 4: Migrate FieldError** — React Aria wrapper. OwnProps only has className (style/children via restProps).
- [x] **Task 5: Migrate FieldLabel** — Multiple classNames, no children prop, no style (would break downstream types).
- [x] **Task 6: Migrate Link** — Fixed variant default from 'body' to 'body-medium'. Defaults in definition.ts.
- [x] **Task 7: Migrate Skeleton** — dataAttribute for rounded, width/height as inline styles with defaults.
- [x] **Task 8: Migrate Switch** — Single component, no custom dataAttributes (plan incorrectly mentioned labelPosition). See `Switch/definition.ts` and `Switch/Switch.tsx`.
- [x] **Task 9: Migrate Tooltip** — Single component, no custom dataAttributes (CSS uses React Aria built-in ones). See `Tooltip/definition.ts` and `Tooltip/Tooltip.tsx`.
- [x] **Task 10: Migrate VisuallyHidden** — Single component, no dataAttributes. Only className in OwnProps (children/style pass through restProps). See `VisuallyHidden/definition.ts` and `VisuallyHidden/VisuallyHidden.tsx`.
- [x] **Task 11: Migrate Popover** — Single component, no custom dataAttributes (plan incorrectly mentioned placement/triggerAction — those are React Aria built-in). See `Popover/definition.ts` and `Popover/Popover.tsx`.
- [x] **Task 12: Migrate FullPage** — Single component, no dataAttributes. See `FullPage/definition.ts` and `FullPage/FullPage.tsx`.
- [x] **Task 13: Migrate ToggleButton** — Single component, dataAttributes for `size` and `variant`. See `ToggleButton/definition.ts` and `ToggleButton/ToggleButton.tsx`.
- [x] **Task 14: Migrate ToggleButtonGroup** — Single component, dataAttributes for `orientation`. See `ToggleButtonGroup/definition.ts` and `ToggleButtonGroup/ToggleButtonGroup.tsx`.

### Batch 2: Form components (single-file, no bg, no utility props)

- [x] **Task 15: Migrate PasswordField** — Single component, dataAttributes for `size`. See `PasswordField/definition.ts` and `PasswordField/PasswordField.tsx`.
- [x] **Task 16: Migrate SearchField** — Single component, dataAttributes for `size` and `startCollapsed`. See `SearchField/definition.ts` and `SearchField/SearchField.tsx`.
- [x] **Task 17: Migrate TextField** — Single component, dataAttributes for `size`. `invalid`/`disabled` are React Aria built-ins, not custom dataAttributes. See `TextField/definition.ts` and `TextField/TextField.tsx`.

### Batch 3: Components with utility props (no bg)

- [x] **Task 18: Migrate Text** — Polymorphic component (no utilityProps despite plan). dataAttributes for `variant`, `color`, `weight`, `truncate`. Added `className` to existing `TextOwnProps`. See `Text/definition.ts` and `Text/Text.tsx`.

### Batch 4: Components with bg: 'provider' + utility props

- [x] **Task 19: Migrate Flex** — bg provider with utilityProps. Uses `childrenWithBgProvider` pattern from Box. Gap default handled via `{ gap: '4', ...props }` since utility prop defaults not supported in defineComponent. See `Flex/definition.ts` and `Flex/Flex.tsx`.
- [x] **Task 20: Migrate Grid** — bg provider with utilityProps. Two sub-components (GridRoot, GridItem), both bg providers. Uses `childrenWithBgProvider` pattern. GridRoot defaults `columns: 'auto'` and `gap: '4'` via spread pattern. See `Grid/definition.ts` and `Grid/Grid.tsx`.

### Batch 5: Multi-sub-component directories

- [x] **Task 21: Migrate Dialog** — Multiple sub-components (Dialog, DialogHeader, DialogBody, DialogFooter). Split monolithic definition into 4 per-sub-component definitions. Used `classNameTarget: 'dialog'` for Dialog since className targets inner RADialog, not Modal overlay. Added `style` to DialogOwnProps for manual merging with CSS custom properties. Added DialogFooterProps/OwnProps (was inline type). DialogTrigger unchanged (no useStyles usage).
- [x] **Task 22: Migrate HeaderPage** — Single component (not multi-sub-component as originally described — `content`, `breadcrumbs`, `tabsWrapper`, `controls` are just classNames for inner divs). No bg, no dataAttributes, no utilityProps. See `HeaderPage/definition.ts` and `HeaderPage/HeaderPage.tsx`.
- [x] **Task 23: Migrate PluginHeader** — Two sub-components (PluginHeader, PluginHeaderToolbar) sharing one old definition, split into two `defineComponent` calls following the Dialog pattern. Toolbar definition is `@internal` and not exported. No bg, no utilityProps, no dataAttributes. Manual `data-has-tabs` preserved as-is. Toolbar classNames removed from public `PluginHeaderDefinition` (breaking API surface change to be documented in Task 33 changeset).
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

- 22 of 31 component tasks complete (~71%), plus 3 cleanup tasks remaining. 28 unique components migrated (PluginHeader + PluginHeaderToolbar).
- Only 3 sub-components need bg: 'provider' (Flex, GridRoot, GridItem). No unmigrated components use useBgConsumer.
- InternalLinkProvider is a context provider, not a styled component — no migration needed.
- useStyles.ts already imports helpers from useDefinition (resolveResponsiveValue, processUtilityProps), confirming shared infrastructure.
- Link had pre-existing type mismatch: variant default 'body' didn't match TextVariants type. Old dataAttributes listed ['subtitle','body','caption','label'] but CSS uses TextVariants. Fixed default to 'body-medium'.
- Rule 5 ("add style: {} to propDefs") only applies when the component uses style directly. For React Aria wrappers (FieldError) and components where style would break downstream types (FieldLabel), let style pass through restProps instead.
- useDefinition auto-merges className into classes (line 109) but does NOT auto-merge style. Components with utilityProps must merge manually: `{...utilityStyle, ...style}` (user style wins).
- docs-ui Link props-definition.tsx was missing 'info' from color values — fixed.
- Several task descriptions incorrectly claimed custom dataAttributes (Switch: "labelPosition", Popover: "placement"/"triggerAction") that are actually React Aria built-in data attributes. Always verify dataAttributes against the old `definition.ts` `dataAttributes` map, not CSS selectors — CSS `data-*` selectors are often React Aria built-ins.
- Each migrated component's `index.ts` needs `OwnProps` added to type exports.
- `useDefinition` must be the FIRST line in the component. Never access raw `props` after that — use `ownProps` and `restProps` exclusively. Props not in OwnProps (e.g. `aria-label`) can be read from `restProps` when needed (e.g. for effects) and still pass through via `{...restProps}`.
- Only extend another component's full prop type (e.g. FieldLabelProps) if you also spread `restProps` onto that component. If you only use specific props from it in the implementation, declare those individually in OwnProps (using `FieldLabelProps['key']` syntax) instead.
- Components using `export * from './types'` in index.ts auto-export OwnProps — no index.ts change needed for those.
- TextField's old `dataAttributes` included `invalid` and `disabled`, but these are React Aria built-in data attributes applied automatically by `AriaTextField`. Only `size` needed `dataAttribute: true` in propDefs. Same pattern applies to all React Aria field components.
- Text has NO utilityProps despite the plan claiming otherwise. Always verify against the actual old `definition.ts`, not the plan description.
- When a component applies `className` to an element other than the root (e.g. Dialog applies `className` to the inner `<RADialog>` rather than the `<Modal>` overlay), use the `classNameTarget` option: `useDefinition(def, props, { classNameTarget: 'dialog' })`. This tells `useDefinition` to merge the user's `className` into `classes.dialog` instead of `classes.root`.
- For utility prop defaults (e.g. Flex's `gap: '4'`), `defineComponent` has no mechanism. Pass the default in the props spread to useDefinition: `useDefinition(def, { gap: '4', ...props })`. This is the same pattern the old useStyles code used.
- For bg providers with style: merge order should be `{ ...utilityStyle, ...ownProps.style }` (user style wins). Note Box uses the opposite order `{ ...ownProps.style, ...utilityStyle }` — this is a pre-existing inconsistency, not something to fix during migration.
- Only spread `restProps` when the component actually inherits props it needs to pass through (e.g. HTML attributes from extending `React.HTMLAttributes`, or React Aria props). If all props are consumed by `propDefs` and `utilityProps`, omit `restProps` entirely — don't spread an empty object for consistency's sake.
