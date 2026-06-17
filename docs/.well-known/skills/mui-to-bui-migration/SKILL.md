---
name: mui-to-bui-migration
description: Migrate Backstage plugins from Material-UI (MUI) to Backstage UI (BUI). Use this skill when migrating components, updating imports, replacing styling patterns, or converting MUI components to their BUI equivalents.
---

# MUI to BUI Migration Skill

This skill helps migrate Backstage plugins from Material-UI (@material-ui/core, @material-ui/icons) to
Backstage UI (@backstage/ui).

## Prerequisites

Before starting migration:

1. Install the BUI package:

   ```bash
   yarn add @backstage/ui
   ```

2. Add the CSS import to your root file (typically `src/index.ts` or app entry point):

   ```typescript
   import '@backstage/ui/css/styles.css';
   ```

## Available BUI Components

### Layout Components

- `Box` - Basic layout container with CSS properties
- `Container` - Centered content container with max-width
- `Flex` - Flex layout component
- `FullPage` - Full-page layout wrapper
- `Grid` - CSS Grid-based layout (`Grid.Root`, `Grid.Item`)

### UI Components

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

## Migration Patterns

### 1. Import Changes

**Remove MUI imports:**

```typescript
// REMOVE these imports
import { Box, Typography, Tooltip, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SomeIcon from '@material-ui/icons/SomeIcon';
```

**Add BUI imports:**

```typescript
// ADD these imports
import { Box, Flex, Text, Tooltip, Card } from '@backstage/ui';
import { RiSomeIcon } from '@remixicon/react';
import styles from './MyComponent.module.css';
```

### 2. Styling: `makeStyles` to CSS Modules

Create a `.module.css` file alongside your component using BUI CSS variables.

**Before (MUI `makeStyles`):**

```tsx
// MyComponent.tsx
import { makeStyles, Theme } from '@material-ui/core/styles';

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
          <SomeIcon />
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
    padding: var(--bui-space-2) 0;
  }

  .icon {
    min-width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bui-fg-secondary);
  }
}
```

```tsx
// MyComponent.tsx
import { Box, Text } from '@backstage/ui';
import { RiSomeIcon } from '@remixicon/react';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <Box className={styles.container}>
      <Text className={styles.title}>Title</Text>
      <div className={styles.listItem}>
        <div className={styles.icon}>
          <RiSomeIcon size={24} />
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

### 4. Grid Layout

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
<Grid.Root columns={{ sm: '12' }} gap="6">
  <Grid.Item colSpan={{ sm: '12', md: '6' }}>{content}</Grid.Item>
</Grid.Root>
```

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
<Text variant="title-large">Heading</Text>
<Text variant="title-small">Subheading</Text>
<Text variant="body-medium">Body text</Text>
<Text variant="body-small" color="secondary">Secondary text</Text>
```

Valid Text variants: `title-large`, `title-medium`, `title-small`, `title-x-small`, `body-large`, `body-medium`,
`body-small`, `body-x-small`

### 6. Tooltip Pattern

**Before (MUI Tooltip):**

```tsx
import { Tooltip, Typography } from '@material-ui/core';

<Tooltip title={<Typography>Tooltip content</Typography>}>
  <span>Hover me</span>
</Tooltip>;
```

**After (BUI TooltipTrigger pattern):**

```tsx
import { Tooltip, TooltipTrigger, Text } from '@backstage/ui';

<TooltipTrigger>
  <Text>Hover me</Text>
  <Tooltip>Tooltip content</Tooltip>
</TooltipTrigger>;
```

### 7. Dialog Pattern

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
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  Button,
} from '@backstage/ui';

<DialogTrigger>
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
      <Button onClick={onClose} variant="secondary" slot="close">
        Cancel
      </Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>;
```

### 8. Button Changes

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

### 9. TextField Changes

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
  id="title"
  label="Title"
  value={value}
  onChange={newValue => setValue(newValue)} // receives string directly!
/>
```

Note: BUI TextField `onChange` receives the string value directly, not an event object.

### 10. Tabs Pattern

**Before (MUI Tabs):**

```tsx
import { Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

<TabContext value={tab}>
  <TabList onChange={handleChange}>
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

<Tabs defaultSelectedKey="tab1">
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>;
```

### 11. Menu Pattern

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

### 12. List to BUI List

**Before (MUI List):**

```tsx
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

<List>
  <ListItem>
    <ListItemIcon>
      <SomeIcon />
    </ListItemIcon>
    <ListItemText primary="Title" secondary="Description" />
  </ListItem>
</List>;
```

**After (BUI List):**

```tsx
import { List, ListRow } from '@backstage/ui';
import { RiSomeIcon } from '@remixicon/react';

<List>
  <ListRow icon={<RiSomeIcon size={20} />} description="Description">
    Title
  </ListRow>
</List>;
```

Note: `ListRow` supports `icon`, `description`, `menuItems`, and `customActions` props.

### 13. Chip to Tag

**Before (MUI Chip):**

```tsx
import { Chip } from '@material-ui/core';

<Chip label="Category" size="small" />;
```

**After (BUI Tag):**

```tsx
import { Tag } from '@backstage/ui';

<Tag size="small">Category</Tag>;
```

### 14. Alert Pattern

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

### 15. Icons: MUI Icons to Remix Icons

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

Find more icons at: https://remixicon.com/

### 16. Paper to Card

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
  <CardHeader>Title</CardHeader>
  <CardBody>
    <Text>Body content</Text>
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
  selectedKey={value}
  onSelectionChange={key => setValue(key as string)}
  options={[
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
  ]}
/>;
```

Note: BUI `Select` accepts flat `options` arrays or grouped `OptionSection` arrays. Pass `multiple` for multi-select.

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

**Before (MUI Badge):**

```tsx
import { Badge } from '@material-ui/core';

<Badge badgeContent={4} color="primary">
  <MailIcon />
</Badge>;
```

**After (BUI Badge):**

```tsx
import { Badge } from '@backstage/ui';
import { RiMailLine } from 'react-icons/ri';

<Badge>New</Badge>
<Badge size="small" icon={<RiMailLine size={12} />}>4</Badge>
```

Note: BUI `Badge` is a label-style badge (inline text with optional icon), not a notification counter overlay.
For notification counters overlaid on icons, use CSS positioning.

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

<CheckboxGroup label="Options" value={selected} onChange={setSelected}>
  <Checkbox value="a">Option A</Checkbox>
  <Checkbox value="b">Option B</Checkbox>
</CheckboxGroup>;
```

## CSS Variable Reference

### Spacing

| MUI theme.spacing()  | BUI CSS Variable     |
| -------------------- | -------------------- |
| `theme.spacing(0.5)` | `var(--bui-space-1)` |
| `theme.spacing(1)`   | `var(--bui-space-2)` |
| `theme.spacing(1.5)` | `var(--bui-space-3)` |
| `theme.spacing(2)`   | `var(--bui-space-4)` |
| `theme.spacing(3)`   | `var(--bui-space-6)` |
| `theme.spacing(4)`   | `var(--bui-space-8)` |

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

## Known Limitations

Some Backstage APIs still require MUI-compatible icon types:

- **PageBlueprint** (`@backstage/frontend-plugin-api`): The `icon` param on page extensions expects an `IconElement`. MUI icon components can still be used via `<Icon fontSize="inherit" />`.
- **Timeline** (`@material-ui/lab`): No BUI equivalent exists.

For these cases, keep using MUI components.

## Migration Checklist

When migrating a plugin:

1. [ ] Add `@backstage/ui` dependency
2. [ ] Add `@remixicon/react` dependency (if using icons)
3. [ ] Add CSS import to root file
4. [ ] Remove `@material-ui/core` imports (except components with no BUI equivalent)
5. [ ] Remove `@material-ui/icons` imports
6. [ ] Remove `@material-ui/lab` imports (Alert, Pagination now in BUI)
7. [ ] Remove `makeStyles` and related imports
8. [ ] Create `.module.css` files for component styles
9. [ ] Replace `Typography` with `Text`
10. [ ] Replace `Box display="flex"` with `Flex`
11. [ ] Replace `Grid container/item` with `Grid.Root/Grid.Item`
12. [ ] Replace `Paper` with `Card`
13. [ ] Replace MUI `Dialog` with BUI `DialogTrigger` pattern
14. [ ] Replace MUI `Tooltip` with BUI `TooltipTrigger` pattern (both from `@backstage/ui`)
15. [ ] Replace MUI `Tabs` with BUI `Tabs`
16. [ ] Replace MUI `Menu`/`Popover` with BUI `MenuTrigger` pattern
17. [ ] Replace `Chip` with `Tag`
18. [ ] Replace `IconButton` with `ButtonIcon`
19. [ ] Replace MUI `Alert` with BUI `Alert`
20. [ ] Replace MUI `List` with BUI `List` and `ListRow`
21. [ ] Replace MUI `Select`/`FormControl` with BUI `Select`
22. [ ] Replace MUI `Accordion` with BUI `Accordion`/`AccordionTrigger`/`AccordionPanel`
23. [ ] Replace MUI `RadioGroup`/`FormControlLabel` with BUI `RadioGroup`/`Radio`
24. [ ] Replace MUI `FormGroup` with BUI `CheckboxGroup`
25. [ ] Replace MUI `Slider` with BUI `Slider`
26. [ ] Update `Button` props (`disabled` → `isDisabled`, `variant="contained"` → `variant="primary"`)
27. [ ] Update `TextField` props (`required` → `isRequired`, `onChange` signature)
28. [ ] Replace MUI icons with Remix icons
29. [ ] Run `yarn tsc` to check for type errors
30. [ ] Run the project's build command (e.g. `yarn build`, `yarn build:all`, or `yarn workspace <pkg> build`) to verify build
31. [ ] Run `yarn lint` to check for missing dependencies
32. [ ] Test component rendering and functionality

## Reference

- BUI Documentation: https://ui.backstage.io
- Remix Icons: https://remixicon.com/
- Example Migration PR: https://github.com/backstage/backstage/pull/31631
