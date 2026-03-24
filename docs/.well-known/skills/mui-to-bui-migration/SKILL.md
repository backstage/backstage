---
name: mui-to-bui-migration
description: Migrate Backstage plugins from Material-UI (MUI) to Backstage UI (BUI). Use this skill when migrating components, updating imports, replacing styling patterns, or converting MUI components to their BUI equivalents.
---

# MUI to BUI Migration Skill

This skill helps migrate Backstage plugins from Material-UI (@material-ui/core, @material-ui/icons) to Backstage UI (
@backstage/ui).

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
- `Grid` - CSS Grid-based layout (`Grid.Root`, `Grid.Item`)
- `Flex` - `Flexbox` layout component

### UI Components

- `Accordion` - Collapsible content panels
- `Avatar` - User/entity avatars
- `Button` - Primary action buttons (`variant="primary"`, `variant="secondary"`, `isDisabled`)
- `ButtonIcon` - Icon-only buttons (`icon`, `onPress`, `variant`)
- `ButtonLink` - Link styled as button
- `Card` - Content cards (`Card`, `CardHeader`, `CardBody`, `CardFooter`)
- `Checkbox` - Checkbox input
- `Dialog` - Modal dialogs (`DialogTrigger`, `Dialog`, `DialogHeader`, `DialogBody`, `DialogFooter`)
- `Header` - Page headers
- `HeaderPage` - Full page header component
- `Link` - Navigation links
- `Menu` - Dropdown menus (`MenuTrigger`, `Menu`, `MenuItem`)
- `PasswordField` - Password input field
- `Popover` - Popover overlays
- `RadioGroup` - Radio button groups
- `SearchField` - Search input
- `Select` - Dropdown select
- `Skeleton` - Loading skeleton
- `Switch` - Toggle switch
- `Table` - Data tables
- `Tabs` - Tab navigation (`Tabs`, `TabList`, `Tab`, `TabPanel`)
- `Tag` - Tag/chip component (replaces MUI Chip)
- `TagGroup` - Tag/chip groups
- `Text` - Typography component (`variant`, `color`)
- `TextField` - Text input (`isRequired`, `onChange` receives string directly)
- `ToggleButton` - Toggle buttons
- `ToggleButtonGroup` - Grouped toggle buttons
- `Tooltip` - Tooltip overlays (used with TooltipTrigger from react-aria-components)
- `VisuallyHidden` - Accessibility helper

### Hooks

- `useBreakpoint` - Responsive breakpoint hook

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

```typescript
// MyComponent.tsx
import {makeStyles, Theme} from '@material-ui/core/styles';

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
    <div className = {classes.container} >
    <Typography className = {classes.title} > Title < /Typography>
      < div
  className = {classes.listItem} >
  <div className = {classes.icon} >
    <SomeIcon / >
    </div>
    < span > Content < /span>
    < /div>
    < /div>
)
  ;
}
```

**After (CSS Modules with BUI variables):**

```css
/* MyComponent.module.css */
@layer components {
  .container {
    padding: var(--bui-space-4);
    background-color: var(--bui-bg-surface-1);
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

```typescript
// MyComponent.tsx
import {Box, Text} from '@backstage/ui';
import {RiSomeIcon} from '@remixicon/react';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <Box className = {styles.container} >
    <Text className = {styles.title} > Title < /Text>
      < div
  className = {styles.listItem} >
  <div className = {styles.icon} >
  <RiSomeIcon size = {24}
  />
  < /div>
  < span > Content < /span>
  < /div>
  < /Box>
)
  ;
}
```

### 3. Layout: Box with display to `Flex`

**Before (MUI Box with display prop):**

```typescript
<Box
  display = "flex"
flexDirection = "column"
alignItems = "center"
justifyContent = "space-between"
>
<Box display = "flex"
flexDirection = "row"
gap = {2} >
  {children}
  < /Box>
  < /Box>
```

**After (BUI `Flex` component):**

```typescript
<Flex direction = "column"
align = "center"
justify = "between" >
<Flex direction = "row"
style = {
{
  gap: 'var(--bui-space-4)'
}
}>
{
  children
}
</Flex>
< /Flex>
```

Note: BUI `Flex` uses `justify="between"` not `justify="space-between"`.

### 4. Grid Layout

**Before (MUI Grid):**

```typescript
<Grid container
spacing = {3} >
  <Grid item
xs = {12}
md = {6} >
  {content}
  < /Grid>
  < /Grid>
```

**After (BUI Grid):**

```typescript
<Grid.Root columns = {
{
  sm: '12'
}
}
gap = "6" >
<Grid.Item colSpan = {
{
  sm: '12', md
:
  '6'
}
}>
{
  content
}
</Grid.Item>
< /Grid.Root>
```

### 5. Typography to Text

**Before (MUI Typography):**

```typescript
<Typography variant = "h1" > Heading < /Typography>
  < Typography
variant = "h6" > Subheading < /Typography>
  < Typography
variant = "body1" > Body
text < /Typography>
< Typography
variant = "body2"
color = "textSecondary" > Secondary
text < /Typography>
```

**After (BUI Text):**

```typescript
<Text variant = "title-large" > Heading < /Text>
  < Text
variant = "title-small" > Subheading < /Text>
  < Text
variant = "body-medium" > Body
text < /Text>
< Text
variant = "body-small"
color = "secondary" > Secondary
text < /Text>
```

Valid Text variants: `title-large`, `title-medium`, `title-small`, `title-x-small`, `body-large`, `body-medium`,
`body-small`, `body-x-small`

### 6. Tooltip Pattern

**Before (MUI Tooltip):**

```typescript
import {Tooltip, Typography} from '@material-ui/core';

<Tooltip title = { < Typography > Tooltip
content < /Typography>}>
< span > Hover
me < /span>
< /Tooltip>;
```

**After (BUI TooltipTrigger pattern):**

```typescript
import {Tooltip, Text} from '@backstage/ui';
import {TooltipTrigger} from 'react-aria-components';

<TooltipTrigger>
  <Text>Hover
me < /Text>
< Tooltip > Tooltip
content < /Tooltip>
< /TooltipTrigger>;
```

Note: Add `react-aria-components` to your dependencies.

### 7. Dialog Pattern

**Before (MUI Dialog):**

```typescript
import {Dialog, DialogTitle, DialogActions, Button} from '@material-ui/core';

<Dialog open = {isOpen}
onClose = {onClose} >
<DialogTitle>Title < /DialogTitle>
< DialogActions >
<Button onClick = {onClose} > Cancel < /Button>
  < Button
onClick = {onConfirm}
color = "primary" >
  Confirm
  < /Button>
  < /DialogActions>
  < /Dialog>;
```

**After (BUI Dialog):**

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  Button,
} from '@backstage/ui';

<DialogTrigger>
  <Dialog
    isOpen = {isOpen}
isDismissable
onOpenChange = {open
=>
{
  if (!open) onClose();
}
}
>
<DialogHeader>Title < /DialogHeader>
< DialogFooter >
<Button onClick = {onConfirm}
variant = "primary" >
  Confirm
  < /Button>
  < Button
onClick = {onClose}
variant = "secondary"
slot = "close" >
  Cancel
  < /Button>
  < /DialogFooter>
  < /Dialog>
  < /DialogTrigger>;
```

### 8. Button Changes

**Before (MUI Button):**

```typescript
<Button variant = "contained"
color = "primary"
disabled = {loading}
onClick = {handleClick} >
  Submit
  < /Button>
  < IconButton
onClick = {handleDelete}
disabled = {!
canDelete
}>
<DeleteIcon / >
</IconButton>
```

**After (BUI Button):**

```typescript
<Button variant = "primary"
isDisabled = {loading}
onClick = {handleClick} >
  Submit
  < /Button>
  < ButtonIcon
aria - label = "delete"
isDisabled = {!
canDelete
}
onPress = {handleDelete}
icon = { < RiDeleteBinLine
size = {16}
/>}
variant = "secondary"
  / >
```

### 9. TextField Changes

**Before (MUI TextField):**

```typescript
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

```typescript
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

```typescript
import {Tab} from '@material-ui/core';
import {TabContext, TabList, TabPanel} from '@material-ui/lab';

<TabContext value = {tab} >
<TabList onChange = {handleChange} >
<Tab label = "Tab 1"
value = "tab1" / >
<Tab label = "Tab 2"
value = "tab2" / >
  </TabList>
  < TabPanel
value = "tab1" > Content
1 < /TabPanel>
< TabPanel
value = "tab2" > Content
2 < /TabPanel>
< /TabContext>;
```

**After (BUI Tabs):**

```typescript
import {Tabs, TabList, Tab, TabPanel} from '@backstage/ui';

<Tabs defaultSelectedKey = "tab1" >
<TabList>
  <Tab id = "tab1" > Tab
1 < /Tab>
< Tab
id = "tab2" > Tab
2 < /Tab>
< /TabList>
< TabPanel
id = "tab1" > Content
1 < /TabPanel>
< TabPanel
id = "tab2" > Content
2 < /TabPanel>
< /Tabs>;
```

### 11. Menu Pattern

**Before (MUI Menu):**

```typescript
import {IconButton, Popover, MenuList, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

<IconButton onClick = {handleOpen} > <MoreVertIcon / > </IconButton>
  < Popover
open = {open}
anchorEl = {anchorEl}
onClose = {handleClose} >
<MenuList>
  <MenuItem onClick = {handleAction} > Action < /MenuItem>
  < /MenuList>
  < /Popover>
```

**After (BUI Menu):**

```typescript
import {ButtonIcon, Menu, MenuItem, MenuTrigger} from '@backstage/ui';
import {RiMore2Line} from '@remixicon/react';

<MenuTrigger>
  <ButtonIcon aria - label = "more"
icon = { < RiMore2Line / >
}
variant = "secondary" / >
<Menu>
  <MenuItem onAction = {handleAction} > Action < /MenuItem>
  < /Menu>
  < /MenuTrigger>;
```

### 12. List to HTML with CSS Modules

**Before (MUI List):**

```typescript
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';

<List>
  <ListItem>
    <ListItemIcon>
      <SomeIcon / >
</ListItemIcon>
< ListItemText
primary = "Title"
secondary = "Description" / >
  </ListItem>
  < /List>;
```

**After (HTML list with BUI and CSS Modules):**

```css
/* MyList.module.css */
@layer components {
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .listItem {
    display: flex;
    align-items: flex-start;
    padding: var(--bui-space-2) 0;
  }

  .listItemIcon {
    min-width: 36px;
    display: flex;
    align-items: center;
    color: var(--bui-fg-primary);
  }
}
```

```typescript
import {Flex, Text} from '@backstage/ui';
import {RiSomeIcon} from '@remixicon/react';
import styles from './MyList.module.css';

<ul className = {styles.list} >
<li className = {styles.listItem} >
<div className = {styles.listItemIcon} >
<RiSomeIcon size = {20}
/>
< /div>
< Flex
direction = "column" >
  <Text>Title < /Text>
  < Text
variant = "body-small"
color = "secondary" >
  Description
  < /Text>
  < /Flex>
  < /li>
  < /ul>;
```

### 13. Chip to Tag

**Before (MUI Chip):**

```typescript
import { Chip } from '@material-ui/core';

<Chip label="Category" size="small" />;
```

**After (BUI Tag):**

```typescript
import {Tag} from '@backstage/ui';

<Tag size = "small" > Category < /Tag>;
```

### 14. Icons: MUI Icons to Remix Icons

**Before (MUI Icons):**

```typescript
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

<CloseIcon / >
<SearchIcon fontSize = "small" / >
```

**After (Remix Icons):**

```typescript
import {RiCloseLine, RiSearchLine} from '@remixicon/react';

<RiCloseLine / >
<RiSearchLine size = {16}
/>
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
| `background.paper`   | `var(--bui-bg-surface-1)`                  |
| `background.default` | `var(--bui-bg-surface-0)`                  |
| `primary.main`       | `var(--bui-bg-solid)` or `var(--bui-ring)` |
| `error.main`         | `var(--bui-fg-danger)`                     |
| `action.hover`       | `var(--bui-bg-hover)`                      |
| `divider`            | `var(--bui-border)`                        |

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
| Link color           | `var(--bui-fg-link)`     |

## Known Limitations

Some Backstage APIs still require MUI-compatible icon types:

- **NavItemBlueprint** (`@backstage/frontend-plugin-api`): The `icon` prop expects MUI `IconComponent` type. Remix icons
  are not type-compatible.
- **Timeline** (`@material-ui/lab`): No BUI equivalent exists.
- **Pagination** (`@material-ui/lab`): No BUI equivalent exists.
- **Alert** (`@material-ui/lab`): No BUI equivalent exists.

For these cases, keep using MUI components.

## Migration Checklist

When migrating a plugin:

1. [ ] Add `@backstage/ui` dependency
2. [ ] Add `@remixicon/react` dependency (if using icons)
3. [ ] Add `react-aria-components` dependency (if using Tooltip)
4. [ ] Add CSS import to root file
5. [ ] Remove `@material-ui/core` imports (except components with no BUI equivalent)
6. [ ] Remove `@material-ui/icons` imports
7. [ ] Remove `makeStyles` and related imports
8. [ ] Create `.module.css` files for component styles
9. [ ] Replace `Typography` with `Text`
10. [ ] Replace `Box display="flex"` with `Flex`
11. [ ] Replace `Grid container/item` with `Grid.Root/Grid.Item`
12. [ ] Replace `Paper` with `Card`
13. [ ] Replace MUI `Dialog` with BUI `DialogTrigger` pattern
14. [ ] Replace MUI `Tooltip` with BUI `TooltipTrigger` pattern
15. [ ] Replace MUI `Tabs` with BUI `Tabs`
16. [ ] Replace MUI `Menu` with BUI `MenuTrigger` pattern
17. [ ] Replace `Chip` with `Tag`
18. [ ] Replace `IconButton` with `ButtonIcon`
19. [ ] Update `Button` props (`disabled` → `isDisabled`, `variant="contained"` → `variant="primary"`)
20. [ ] Update `TextField` props (`required` → `isRequired`, `onChange` signature)
21. [ ] Replace MUI icons with Remix icons
22. [ ] Run `yarn tsc` to check for type errors
23. [ ] Run `yarn build` to verify build
24. [ ] Run `yarn lint` to check for missing dependencies
25. [ ] Test component rendering and functionality

## Reference

- BUI Documentation: https://ui.backstage.io
- Remix Icons: https://remixicon.com/
- Example Migration PR: https://github.com/backstage/backstage/pull/31631
