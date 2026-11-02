# Standalone MUI to BUI migration

Read only when the user selects the standalone path. Migrate the agreed target
directly using this guidance, without installing or running a codemod.

Inspect the target's installed `@backstage/ui` version and component APIs before
applying these examples. Preserve controlled state, event handling, form values,
accessibility, and responsive behavior. Check version-specific props and tokens
against the installed package and [BUI documentation](https://ui.backstage.io).

## Prerequisites

Before starting migration:

1. Add `@backstage/ui` to the package being migrated, following the repository's
   dependency conventions. For a Yarn workspace, replace `<package-name>` with
   that package's name:

   ```shell
   yarn workspace <package-name> add @backstage/ui
   ```

1. If replacing icons, add `@remixicon/react` to the same package. Keep MUI
   dependencies until all consumers in that package have been checked.

1. Ensure the app loads the BUI stylesheet once, using the repository's existing
   integration when present. Otherwise, add the CSS import to its entry point:

   ```typescript
   import '@backstage/ui/css/styles.css';
   ```

Done when: the target has the required dependencies and the app loads BUI styles.

## Available BUI components

### Layout components

- `Box` - Basic layout container with CSS properties
- `Container` - Centered content container with max-width
- `Flex` - Flex layout component
- `FullPage` - Full-page layout wrapper
- `Grid` - CSS Grid-based layout (`Grid.Root`, `Grid.Item`)

### UI components

- `Accordion` - Collapsible content panels (`Accordion`, `AccordionTrigger`, `AccordionPanel`, `AccordionGroup`)
- `Alert` - Alert/notification banners (`status`, `title`, `description`)
- `Avatar` - User/entity avatars
- `Badge` - Inline badge/label with optional icon (`size`, `icon`)
- `Button` - Action buttons (`variant="primary"`, `variant="secondary"`, `variant="tertiary"`, `isDisabled`, `destructive`, `loading`)
- `ButtonIcon` - Icon-only buttons (`icon`, `onPress`, `variant`)
- `ButtonLink` - Link styled as button
- `Card` - Content cards (`Card`, `CardHeader`, `CardBody`, `CardFooter`)
- `Checkbox` - Checkbox input
- `CheckboxGroup` - Grouped checkboxes with shared label (`label`, `orientation`, `isRequired`)
- `DateRangePicker` - Date range input field (`label`, `value`, `onChange`)
- `Dialog` - Modal dialogs (`DialogTrigger`, `Dialog`, `DialogHeader`, `DialogBody`, `DialogFooter`)
- `FieldLabel` - Form field label with description and secondary label
- `Header` - Page headers with breadcrumbs and tabs
- `Link` - Navigation links
- `List` - List component (`List`, `ListRow`)
- `Menu` - Dropdown menus (`MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, `MenuSeparator`, `SubmenuTrigger`)
- `PasswordField` - Password input field
- `PluginHeader` - Plugin-level header with icon, title, tabs, and actions
- `Popover` - Popover overlays
- `RadioGroup` - Radio button groups (`RadioGroup`, `Radio`)
- `SearchAutocomplete` - Search input with autocomplete popover (`SearchAutocomplete`, `SearchAutocompleteItem`)
- `SearchField` - Search input
- `Select` - Dropdown select (single and multiple selection modes)
- `Skeleton` - Loading skeleton
- `Slider` - Range slider input (`label`, `minValue`, `maxValue`, `step`)
- `Switch` - Toggle switch
- `Table` - Data tables (with `useTable` hook for data management)
- `TablePagination` - Standalone pagination component
- `Tabs` - Tab navigation (`Tabs`, `TabList`, `Tab`, `TabPanel`)
- `Tag` - Tag/chip component (replaces MUI Chip)
- `TagGroup` - Tag/chip groups
- `Text` - Typography component (`variant`, `color`, `weight`, `truncate`)
- `TextField` - Text input (`isRequired`, `onChange` receives string directly)
- `ToggleButton` - Toggle buttons
- `ToggleButtonGroup` - Grouped toggle buttons
- `Tooltip` - Tooltip overlays (`TooltipTrigger`, `Tooltip` — both from `@backstage/ui`)
- `VisuallyHidden` - Accessibility helper

### Hooks

- `useBreakpoint` - Responsive breakpoint hook
- `useTable` - Table data management hook (supports `complete`, `offset`, and `cursor` pagination modes)

## Migration patterns

### 1. Import changes

Replace imports as their consumers are migrated. Retain imports required by
components, styles, or platform integrations that still use MUI.

**Before:**

```typescript
import { Box, Typography, Tooltip, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
```

**Add BUI imports:**

```typescript
import { Box, Flex, Text, Tooltip, Card } from '@backstage/ui';
import { RiSettingsLine } from '@remixicon/react';
import styles from './MyComponent.module.css';
```

### 2. Styling: `makeStyles` to CSS modules

Create a `.module.css` file alongside your component using BUI CSS variables.
Inspect custom theme values before converting spacing or colors; the tables below
assume the default MUI spacing scale. Preserve dynamic styles with classes or CSS
custom properties driven by the same component state.

**Before (MUI `makeStyles`):**

```tsx
// MyComponent.tsx
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    minWidth: 56,
    color: theme.palette.text.secondary,
  },
}));

function MyComponent() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.title}>Title</Typography>
      <div className={classes.listItem}>
        <div className={classes.icon}>
          <SettingsIcon />
        </div>
        <span>Content</span>
      </div>
    </div>
  );
}
```

**After (CSS Modules with BUI variables):**

```css
/* MyComponent.module.css */
@layer components {
  .container {
    padding: var(--bui-space-4);
    background-color: var(--bui-bg-neutral-1);
    border-radius: var(--bui-radius-2);
  }

  .title {
    margin-bottom: var(--bui-space-2);
    color: var(--bui-fg-primary);
  }

  .listItem {
    display: flex;
    align-items: center;
  }

  .icon {
    min-width: 56px;
    display: flex;
    align-items: center;
    color: var(--bui-fg-secondary);
  }
}
```

```tsx
// MyComponent.tsx
import { Box, Text } from '@backstage/ui';
import { RiSettingsLine } from '@remixicon/react';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <Box className={styles.container}>
      <Text as="p" className={styles.title}>
        Title
      </Text>
      <div className={styles.listItem}>
        <div className={styles.icon}>
          <RiSettingsLine size={24} />
        </div>
        <span>Content</span>
      </div>
    </Box>
  );
}
```

### 3. Layout: Box with display to `Flex`

**Before (MUI Box with display prop):**

```tsx
<Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  justifyContent="space-between"
>
  <Box display="flex" flexDirection="row" gap={2}>
    {children}
  </Box>
</Box>
```

**After (BUI `Flex` component):**

```tsx
<Flex direction="column" align="center" justify="between">
  <Flex direction="row" style={{ gap: 'var(--bui-space-4)' }}>
    {children}
  </Flex>
</Flex>
```

Note: BUI `Flex` uses `justify="between"` not `justify="space-between"`.

### 4. Grid layout

**Before (MUI Grid):**

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {content}
  </Grid>
</Grid>
```

**After (BUI Grid):**

```tsx
import styles from './MyComponent.module.css';

<Grid.Root columns="12" gap="6">
  <Grid.Item className={styles.column}>{content}</Grid.Item>
</Grid.Root>;
```

```css
/* MyComponent.module.css */
@layer components {
  .column {
    grid-column: span 12;
  }

  @media (min-width: 960px) {
    .column {
      grid-column: span 6;
    }
  }
}
```

Breakpoint names can have different widths in MUI and BUI. This example preserves
the default MUI `md` threshold of 960px. Use the target theme's actual breakpoint
and spacing values when they differ from the defaults.

### 5. Typography to Text

**Before (MUI Typography):**

```tsx
<Typography variant="h1">Heading</Typography>
<Typography variant="h6">Subheading</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="body2" color="textSecondary">Secondary text</Typography>
```

**After (BUI Text):**

```tsx
<Text as="h1" variant="title-large">Heading</Text>
<Text as="h6" variant="title-small">Subheading</Text>
<Text as="p" variant="body-medium">Body text</Text>
<Text as="p" variant="body-small" color="secondary">Secondary text</Text>
```

Valid Text variants: `title-large`, `title-medium`, `title-small`, `title-x-small`, `body-large`, `body-medium`,
`body-small`, `body-x-small`

### 6. Tooltip pattern

**Before (MUI Tooltip):**

```tsx
import { Button, Tooltip } from '@material-ui/core';

<Tooltip title="Save changes">
  <Button onClick={handleSave}>Save</Button>
</Tooltip>;
```

**After (BUI TooltipTrigger pattern):**

```tsx
import { Button, Tooltip, TooltipTrigger } from '@backstage/ui';

<TooltipTrigger>
  <Button onPress={handleSave}>Save</Button>
  <Tooltip>Save changes</Tooltip>
</TooltipTrigger>;
```

Use a trigger that can receive keyboard focus and participates in the tooltip
interaction, such as a BUI button. Verify both keyboard focus and hover.

### 7. Dialog pattern

**Before (MUI Dialog):**

```tsx
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

<Dialog open={isOpen} onClose={onClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={onConfirm} color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>;
```

**After (BUI Dialog):**

```tsx
import { Dialog, DialogHeader, DialogFooter, Button } from '@backstage/ui';

<Dialog
  isOpen={isOpen}
  isDismissable
  onOpenChange={open => {
    if (!open) onClose();
  }}
>
  <DialogHeader>Title</DialogHeader>
  <DialogFooter>
    <Button onClick={onConfirm} variant="primary">
      Confirm
    </Button>
    <Button variant="secondary" slot="close">
      Cancel
    </Button>
  </DialogFooter>
</Dialog>;
```

For a dialog opened by a trigger button, use `DialogTrigger` with that button.
The example above preserves an externally controlled dialog.

### 8. Button changes

**Before (MUI Button):**

```tsx
<Button variant="contained" color="primary" disabled={loading} onClick={handleClick}>
  Submit
</Button>
<IconButton onClick={handleDelete} disabled={!canDelete}>
  <DeleteIcon />
</IconButton>
```

**After (BUI Button):**

```tsx
<Button variant="primary" isDisabled={loading} onClick={handleClick}>
  Submit
</Button>
<ButtonIcon
  aria-label="delete"
  isDisabled={!canDelete}
  onPress={handleDelete}
  icon={<RiDeleteBinLine size={16} />}
  variant="secondary"
/>
```

Map `contained` to `primary`, `outlined` to `secondary`, and `text` to `tertiary`.
Check destructive intent, loading behavior, and size separately. BUI controls
default to a small size; use `size="medium"` when needed to preserve MUI density.

### 9. TextField changes

**Before (MUI TextField):**

```tsx
<TextField
  required
  name="title"
  label="Title"
  value={value}
  onChange={e => setValue(e.target.value)}
  fullWidth
/>
```

**After (BUI TextField):**

```tsx
<TextField
  isRequired
  name="title"
  label="Title"
  value={value}
  onChange={newValue => setValue(newValue)} // receives the string value
  style={{ width: '100%' }}
/>
```

Note: BUI TextField `onChange` receives the string value directly, not an event object.

### 10. Tabs pattern

**Before (MUI Tabs):**

```tsx
import { Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

<TabContext value={tab}>
  <TabList onChange={(_, value) => setTab(value)}>
    <Tab label="Tab 1" value="tab1" />
    <Tab label="Tab 2" value="tab2" />
  </TabList>
  <TabPanel value="tab1">Content 1</TabPanel>
  <TabPanel value="tab2">Content 2</TabPanel>
</TabContext>;
```

**After (BUI Tabs):**

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@backstage/ui';

<Tabs selectedKey={tab} onSelectionChange={key => setTab(String(key))}>
  <TabList aria-label="Sections">
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>;
```

Preserve any additional side effects from the original change handler when
adapting it to BUI's key-based callback.

### 11. Menu pattern

**Before (MUI Menu):**

```tsx
import {IconButton, Popover, MenuList, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

<IconButton onClick={handleOpen}>
  <MoreVertIcon />
</IconButton>
<Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
  <MenuList>
    <MenuItem onClick={handleAction}>Action</MenuItem>
  </MenuList>
</Popover>
```

**After (BUI Menu):**

```tsx
import { ButtonIcon, Menu, MenuItem, MenuTrigger } from '@backstage/ui';
import { RiMore2Line } from '@remixicon/react';

<MenuTrigger>
  <ButtonIcon aria-label="more" icon={<RiMore2Line />} variant="secondary" />
  <Menu>
    <MenuItem onAction={handleAction}>Action</MenuItem>
  </Menu>
</MenuTrigger>;
```

This example lets `MenuTrigger` manage the open state. If the application needs
to control it, retain the state with `isOpen` and `onOpenChange`, including any
side effects from the original open and close handlers.

### 12. List to BUI List

**Before (MUI List):**

```tsx
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

<List>
  <ListItem>
    <ListItemIcon>
      <SettingsIcon />
    </ListItemIcon>
    <ListItemText primary="Title" secondary="Description" />
  </ListItem>
</List>;
```

**After (BUI List):**

```tsx
import { List, ListRow } from '@backstage/ui';
import { RiSettingsLine } from '@remixicon/react';

<List aria-label="Settings">
  <ListRow
    id="settings"
    icon={<RiSettingsLine size={20} />}
    description="Description"
  >
    Title
  </ListRow>
</List>;
```

Note: `ListRow` supports `icon`, `description`, `menuItems`, and `customActions` props.

BUI `List` provides interactive grid-list behavior. For a purely static list,
retain native list semantics with `ul` and `li` elements and BUI content components.

### 13. Chip to Tag

**Before (MUI Chip):**

```tsx
import { Chip } from '@material-ui/core';

<Chip label="Category" size="small" />;
```

**After (BUI Tag):**

```tsx
import { Tag, TagGroup } from '@backstage/ui';

<TagGroup aria-label="Categories">
  <Tag id="category" size="small">
    Category
  </Tag>
</TagGroup>;
```

### 14. Alert pattern

**Before (MUI Alert):**

```tsx
import { Alert, AlertTitle } from '@material-ui/lab';

<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  Something went wrong.
</Alert>;
```

**After (BUI Alert):**

```tsx
import { Alert } from '@backstage/ui';

<Alert
  status="danger"
  icon
  title="Error"
  description="Something went wrong."
/>;
```

Status mapping: `severity="error"` → `status="danger"`, `severity="warning"` → `status="warning"`,
`severity="info"` → `status="info"`, `severity="success"` → `status="success"`.

Set `icon` to `true` for automatic status icons, or pass a custom `ReactElement`.
Use `loading` for a loading spinner, and `customActions` for action buttons.

### 15. Icons: MUI icons to Remix icons

**Before (MUI Icons):**

```tsx
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

<CloseIcon />
<SearchIcon fontSize="small" />
```

**After (Remix Icons):**

```tsx
import {RiCloseLine, RiSearchLine} from '@remixicon/react';

<RiCloseLine />
<RiSearchLine size={16} />
```

Common icon mappings:

| MUI Icon          | Remix Icon           |
| ----------------- | -------------------- |
| `Close`           | `RiCloseLine`        |
| `Search`          | `RiSearchLine`       |
| `Settings`        | `RiSettingsLine`     |
| `Add`             | `RiAddLine`          |
| `Delete`          | `RiDeleteBinLine`    |
| `Edit`            | `RiEditLine`         |
| `Check`           | `RiCheckLine`        |
| `Error`           | `RiErrorWarningLine` |
| `Warning`         | `RiAlertLine`        |
| `Info`            | `RiInformationLine`  |
| `ExpandMore`      | `RiArrowDownSLine`   |
| `ExpandLess`      | `RiArrowUpSLine`     |
| `ChevronRight`    | `RiArrowRightSLine`  |
| `ChevronLeft`     | `RiArrowLeftSLine`   |
| `Menu`            | `RiMenuLine`         |
| `MoreVert`        | `RiMore2Line`        |
| `Visibility`      | `RiEyeLine`          |
| `VisibilityOff`   | `RiEyeOffLine`       |
| `NewReleases`     | `RiMegaphoneLine`    |
| `RecordVoiceOver` | `RiMegaphoneLine`    |
| `Description`     | `RiFileTextLine`     |

Find more icons in the [Remix icon library](https://remixicon.com/).

### 16. Paper and surface layout

Choose a replacement based on the content. Use `Card` for a card with a header
and body, as below. For a plain surface, consider `Box bg="neutral"` with the
needed padding and border. Neither replacement automatically preserves MUI
elevation or variant styling; compare the result visually.

**Before (MUI Paper):**

```tsx
import { Paper, Typography } from '@material-ui/core';

<Paper elevation={2}>
  <Typography variant="h6">Title</Typography>
  <Typography>Body content</Typography>
</Paper>;
```

**After (BUI Card):**

```tsx
import { Card, CardHeader, CardBody, Text } from '@backstage/ui';

<Card>
  <CardHeader>
    <Text as="h6" variant="title-small">
      Title
    </Text>
  </CardHeader>
  <CardBody>
    <Text as="p">Body content</Text>
  </CardBody>
</Card>;
```

### 17. Select

**Before (MUI Select):**

```tsx
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

<FormControl fullWidth>
  <InputLabel>Framework</InputLabel>
  <Select value={value} onChange={e => setValue(e.target.value as string)}>
    <MenuItem value="react">React</MenuItem>
    <MenuItem value="angular">Angular</MenuItem>
  </Select>
</FormControl>;
```

**After (BUI Select):**

```tsx
import { Select } from '@backstage/ui';

<Select
  label="Framework"
  value={value}
  onChange={key => setValue(key === null ? '' : String(key))}
  options={[
    { id: 'react', label: 'React' },
    { id: 'angular', label: 'Angular' },
  ]}
/>;
```

BUI `Select` accepts flat `options` arrays or grouped `OptionSection` arrays.
Use `selectionMode="multiple"` with array values for multiple selection. Check the
installed version: older APIs use `selectedKey` and `onSelectionChange`.

### 18. Accordion

**Before (MUI Accordion):**

```tsx
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    Section title
  </AccordionSummary>
  <AccordionDetails>Content goes here</AccordionDetails>
</Accordion>;
```

**After (BUI Accordion):**

```tsx
import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

<Accordion>
  <AccordionTrigger title="Section title" />
  <AccordionPanel>Content goes here</AccordionPanel>
</Accordion>;
```

Use `AccordionGroup` to wrap multiple `Accordion` items and control whether multiple panels can be open simultaneously.

### 19. RadioGroup

**Before (MUI RadioGroup):**

```tsx
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

<FormControl>
  <FormLabel>Frequency</FormLabel>
  <RadioGroup value={value} onChange={e => setValue(e.target.value)}>
    <FormControlLabel value="daily" control={<Radio />} label="Daily" />
    <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
  </RadioGroup>
</FormControl>;
```

**After (BUI RadioGroup):**

```tsx
import { RadioGroup, Radio } from '@backstage/ui';

<RadioGroup label="Frequency" value={value} onChange={setValue}>
  <Radio value="daily">Daily</Radio>
  <Radio value="weekly">Weekly</Radio>
</RadioGroup>;
```

### 20. Badge

BUI `Badge` is an inline label with an optional icon. It is not a replacement for
a MUI `Badge` that overlays a notification count on an icon. Preserve an existing
notification overlay with MUI, or reproduce its positioning and accessible label
with a deliberate implementation. Do not replace it with an inline label and
claim equivalent behavior.

For an inline label:

```tsx
import { Badge } from '@backstage/ui';

<Badge>New</Badge>;
```

### 21. Slider

**Before (MUI Slider):**

```tsx
import { Slider } from '@material-ui/core';

<Slider
  value={value}
  onChange={(_, newValue) => setValue(newValue as number)}
  min={0}
  max={100}
  step={10}
/>;
```

**After (BUI Slider):**

```tsx
import { Slider } from '@backstage/ui';

<Slider
  label="Volume"
  value={value}
  onChange={setValue}
  minValue={0}
  maxValue={100}
  step={10}
/>;
```

Note: BUI `Slider` `onChange` receives the new value directly. Use `minValue`/`maxValue` instead of `min`/`max`.

### 22. CheckboxGroup

**Before (MUI FormGroup with Checkboxes):**

```tsx
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

<FormControl>
  <FormLabel>Options</FormLabel>
  <FormGroup>
    <FormControlLabel
      control={
        <Checkbox
          checked={values.a}
          onChange={e => handleChange('a', e.target.checked)}
        />
      }
      label="Option A"
    />
    <FormControlLabel
      control={
        <Checkbox
          checked={values.b}
          onChange={e => handleChange('b', e.target.checked)}
        />
      }
      label="Option B"
    />
  </FormGroup>
</FormControl>;
```

**After (BUI CheckboxGroup):**

```tsx
import { CheckboxGroup, Checkbox } from '@backstage/ui';

<CheckboxGroup
  label="Options"
  value={(['a', 'b'] as const).filter(key => values[key])}
  onChange={selected => {
    for (const key of ['a', 'b'] as const) {
      const checked = selected.includes(key);
      if (checked !== values[key]) handleChange(key, checked);
    }
  }}
>
  <Checkbox value="a">Option A</Checkbox>
  <Checkbox value="b">Option B</Checkbox>
</CheckboxGroup>;
```

## CSS variable reference

### Spacing

| MUI theme.spacing()  | BUI CSS Variable     |
| -------------------- | -------------------- |
| `theme.spacing(0.5)` | `var(--bui-space-1)` |
| `theme.spacing(1)`   | `var(--bui-space-2)` |
| `theme.spacing(1.5)` | `var(--bui-space-3)` |
| `theme.spacing(2)`   | `var(--bui-space-4)` |
| `theme.spacing(3)`   | `var(--bui-space-6)` |
| `theme.spacing(4)`   | `var(--bui-space-8)` |

These spacing mappings assume the default MUI theme. Use the actual pixel or
relative value if the target theme has a custom spacing function.

### Colors

| MUI theme.palette    | BUI CSS Variable                           |
| -------------------- | ------------------------------------------ |
| `text.primary`       | `var(--bui-fg-primary)`                    |
| `text.secondary`     | `var(--bui-fg-secondary)`                  |
| `background.paper`   | `var(--bui-bg-neutral-1)`                  |
| `background.default` | `var(--bui-bg-app)`                        |
| `primary.main`       | `var(--bui-bg-solid)` or `var(--bui-ring)` |
| `error.main`         | `var(--bui-fg-danger)`                     |
| `action.hover`       | `var(--bui-bg-neutral-1-hover)`            |
| `divider`            | `var(--bui-border-1)`                      |

### Typography

| Property            | BUI CSS Variable                 |
| ------------------- | -------------------------------- |
| Font family         | `var(--bui-font-regular)`        |
| Font size small     | `var(--bui-font-size-1)`         |
| Font size medium    | `var(--bui-font-size-2)`         |
| Font size large     | `var(--bui-font-size-3)`         |
| Font weight regular | `var(--bui-font-weight-regular)` |
| Font weight bold    | `var(--bui-font-weight-bold)`    |

### Other

| Property             | BUI CSS Variable         |
| -------------------- | ------------------------ |
| Border radius small  | `var(--bui-radius-2)`    |
| Border radius medium | `var(--bui-radius-3)`    |
| Border radius full   | `var(--bui-radius-full)` |
| Link color           | `var(--bui-fg-info)`     |

## Migration checklist

1. [ ] Add the required BUI and icon dependencies to the target package and
       ensure the app loads the BUI stylesheet.
1. [ ] Migrate each component using the applicable patterns above, preserving
       state, event handlers, accessibility, and responsive behavior.
1. [ ] Replace `makeStyles` and other MUI styling in migrated components with
       CSS modules or BUI layout props.
1. [ ] Replace icons where the consuming API accepts them. Retain compatible
       icons for platform integrations, such as `PageBlueprint`, when required
       by the target's types or runtime wiring.
1. [ ] Search for remaining MUI imports, styling helpers, and theme usage. Keep
       components with no suitable BUI equivalent and record the reason.
1. [ ] Remove unused MUI dependencies only after checking all consumers in the
       package, including tests, stories, retained components, and icon imports.

Done when: every item is addressed for the agreed target and retained MUI usage
is recorded. Return to the main skill's remaining-work and verification steps.

## Reference

- [BUI documentation](https://ui.backstage.io)
- [Remix icons](https://remixicon.com/)
- [Example migration PR](https://github.com/backstage/backstage/pull/31631)
