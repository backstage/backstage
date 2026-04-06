# Technical Specification

# 0. Agent Action Plan

## 0.1 Intent Clarification

### 0.1.1 Core Refactoring Objective

Based on the prompt, the Blitzy platform understands that the refactoring objective is to **comprehensively redesign the Backstage Developer Portal's core frontend UI** by replacing its current Material UI (MUI v4/v5) component library with a modern design catalog built on **shadcn/ui — Radix UI primitives styled with Tailwind CSS**. The goal is to produce a lightweight, accessible, and visually cohesive developer portal experience optimized for platform engineering teams who navigate service catalogs, documentation, and software templates daily.

- **Refactoring type:** Tech stack migration (UI component library replacement) + Design pattern modernization
- **Target repository:** Same repository (Backstage monorepo at `github.com/backstage/backstage`)
- **Refactoring goals with enhanced clarity:**
  - Replace all MUI v4 (`@material-ui/core: ^4.12.2`, `@material-ui/icons: ^4.9.1`, `@material-ui/lab: 4.0.0-alpha.61`) component usage across 8 core packages and 6 core plugins with shadcn/ui equivalents built on Radix UI and Tailwind CSS
  - Replace all MUI v5 (`@mui/material: ^5.12.2`, `@emotion/react`, `@emotion/styled`) usage in the unified theme system with a CSS custom property-based token system
  - Redesign the application shell (sidebar, header, breadcrumbs) using shadcn/ui layout patterns including a collapsible sidebar and command-dialog-based global search
  - Implement full light and dark mode theming via CSS custom properties, meeting WCAG 2.1 AA contrast requirements
  - Apply a consistent spacing scale and code-adjacent typography system (monospace for identifiers, proportional for prose)
  - Maintain backward compatibility with the existing plugin mounting API so community plugins rendering MUI internally continue to function without modification
  - Generate programmatic screenshots (Playwright/Puppeteer) of every redesigned user flow in both light and dark modes as validation artifacts

- **Implicit requirements surfaced:**
  - The existing `packages/ui` (BUI) package built on React Aria Components represents Backstage's in-progress migration target; this redesign introduces shadcn/ui as the new component foundation, requiring a strategy to either extend BUI with shadcn/ui internals or establish shadcn/ui components alongside BUI
  - The `overridableComponents.ts` system in `@backstage/core-components` that enables theme-level style overrides must be preserved or replaced with an equivalent customization mechanism
  - The `coreComponentsTranslationRef` localization system must remain functional across all redesigned components
  - Storybook configurations (`.storybook/main.ts` referencing `packages/ui` and `packages/core-components` story paths) must be updated to support Tailwind CSS styling in the story environment
  - The `mui-to-bui` migration script and `.github/workflows/mui-migration-tracker.yml` workflow need to be updated to track the new shadcn/ui migration target

### 0.1.2 Technical Interpretation

This refactoring translates to the following technical transformation strategy:

- **Current architecture:** React 18 SPA with MUI v4 component library (`@material-ui/core`), MUI v4 `makeStyles` CSS-in-JS theming, MUI v5 unified theme provider (`@mui/material`), and Emotion-based styling (`@emotion/react`, `@emotion/styled`). The application shell is defined in `packages/app/src/App.tsx` using `createApp()`, with sidebar navigation in `packages/app/src/modules/appModuleNav.tsx` importing directly from `@material-ui/core/styles` and `@material-ui/icons`.

- **Target architecture:** React 18 SPA with shadcn/ui components (Radix UI primitives + Tailwind CSS utility classes), CSS custom property-based token system replacing MUI's ThemeProvider/makeStyles pattern, and Tailwind CSS as the styling engine. All 88 unique MUI core component imports and 104 unique MUI icon imports across the in-scope packages are replaced with shadcn/ui equivalents and Lucide icons (the standard shadcn/ui icon library).

- **Transformation rules:**
  - Every `import { X } from '@material-ui/core/X'` → `import { X } from '@/components/ui/x'` (shadcn/ui component) or Radix UI primitive
  - Every `makeStyles(theme => ...)` → Tailwind CSS utility classes via `className` or `cn()` helper
  - Every `@material-ui/icons/X` → `lucide-react` icon equivalent
  - Every MUI `ThemeProvider` / `createTheme()` → CSS custom property tokens with `[data-theme='dark']` selector
  - Every `@material-table/core` data table → shadcn/ui `DataTable` (built on `@tanstack/react-table`)
  - Every MUI `Stepper` (scaffolder wizard) → shadcn/ui multi-step form pattern with Radix UI primitives
  - Every `Snackbar` / `Alert` → shadcn/ui `Sonner` toast + `Alert` component


## 0.2 Source Analysis

### 0.2.1 Comprehensive Source File Discovery

A thorough audit of the Backstage monorepo reveals the full extent of MUI dependency across core packages and in-scope plugins. The following tables document every source directory and file group requiring refactoring.

**MUI Import Penetration by Package:**

| Package | MUI v4 Files | MUI v5 Files | Total Source Files | MUI Penetration |
|---------|-------------|-------------|-------------------|-----------------|
| `packages/core-components/src/` | 121 | 0 | ~180 | 67% |
| `packages/theme/src/` | 7 | 9 | ~25 | 64% |
| `packages/app/src/` | 3 | 0 | ~12 | 25% |
| `packages/app-defaults/src/` | 3 | 0 | ~8 | 38% |
| `plugins/catalog/src/` | 38 | 0 | 163 | 23% |
| `plugins/scaffolder/src/` | 63 | 0 | 219 | 29% |
| `plugins/techdocs/src/` | 28 | 0 | 140 | 20% |
| `plugins/search/src/` | 10 | 0 | 36 | 28% |
| `plugins/user-settings/src/` | 21 | 0 | 51 | 41% |
| `plugins/catalog-react/src/` | 33 | 0 | 178 | 19% |
| `plugins/search-react/src/` | 27 | 0 | 65 | 42% |
| `plugins/scaffolder-react/src/` | 28 | 0 | 120 | 23% |
| `plugins/techdocs-react/src/` | 2 | 0 | 13 | 15% |
| **Total** | **384** | **9** | **~1,210** | **~32%** |

### 0.2.2 Current Structure Mapping

```
Current (MUI-based) Structure:
packages/
├── core-components/                      # Primary MUI component library (121 MUI files)
│   └── src/
│       ├── components/                   # 37 UI controls (AlertDisplay, Table, Dialog, etc.)
│       │   ├── AlertDisplay/             # MUI Snackbar + Alert
│       │   ├── AutoLogout/              # MUI Dialog + Button + LinearProgress
│       │   ├── Avatar/                   # MUI Avatar
│       │   ├── Chip/                     # MUI Chip
│       │   ├── CodeSnippet/             # MUI + react-syntax-highlighter
│       │   ├── CopyTextButton/          # MUI IconButton + Tooltip
│       │   ├── CreateButton/            # MUI Button
│       │   ├── DependencyGraph/         # MUI + dagre + d3-selection
│       │   ├── Dialog/                   # MUI Dialog
│       │   ├── DismissableBanner/       # MUI Snackbar
│       │   ├── Drawer/                   # MUI Drawer
│       │   ├── EmptyState/              # MUI Typography + Button + Grid
│       │   ├── ErrorPanel/              # MUI Accordion + AccordionDetails
│       │   ├── FavoriteToggle/          # MUI IconButton
│       │   ├── FeatureDiscovery/        # MUI Portal + makeStyles
│       │   ├── HeaderIconLinkRow/       # MUI Grid + Typography + Link
│       │   ├── HorizontalScrollGrid/   # MUI makeStyles
│       │   ├── Lifecycle/               # MUI Chip
│       │   ├── Link/                     # MUI Link + react-router
│       │   ├── LinkButton/              # MUI Button + react-router
│       │   ├── LogViewer/               # MUI IconButton + Tooltip + virtualization
│       │   ├── MarkdownContent/         # MUI makeStyles + react-markdown
│       │   ├── OAuthRequestDialog/      # MUI Dialog + List + Checkbox
│       │   ├── OverflowTooltip/         # MUI Tooltip + Typography
│       │   ├── Progress/                # MUI LinearProgress + CircularProgress
│       │   ├── ProgressBars/            # MUI + rc-progress
│       │   ├── ResponseErrorPanel/      # MUI + ErrorPanel wrapper
│       │   ├── Select/                   # MUI Select + FormControl
│       │   ├── SimpleStepper/           # MUI Stepper + Step + StepContent
│       │   ├── Status/                   # MUI SvgIcon + makeStyles
│       │   ├── StructuredMetadataTable/ # MUI Table + TableBody + TableRow + TableCell
│       │   ├── SupportButton/           # MUI Popover + List
│       │   ├── TabbedLayout/            # MUI Tabs + Tab + react-router
│       │   ├── Table/                    # @material-table/core (complex data table)
│       │   ├── TrendLine/               # MUI + react-sparklines
│       │   └── WarningPanel/            # MUI Accordion + AccordionDetails + AccordionSummary
│       ├── layout/                       # 18 structural components
│       │   ├── BottomLink/              # MUI Box + Link
│       │   ├── Breadcrumbs/             # MUI Breadcrumbs + Popover + Box + Chip
│       │   ├── Content/                  # MUI makeStyles
│       │   ├── ContentHeader/           # MUI Grid + Typography
│       │   ├── ErrorBoundary/           # MUI + ErrorPanel
│       │   ├── ErrorPage/               # MUI Grid + Typography
│       │   ├── Header/                   # MUI Typography + Helmet + Grid
│       │   ├── HeaderActionMenu/        # MUI IconButton + Popover + MenuList + MenuItem
│       │   ├── HeaderLabel/             # MUI Typography + makeStyles
│       │   ├── HeaderTabs/              # MUI Tab + TabProps + makeStyles
│       │   ├── InfoCard/                # MUI Card + CardHeader + CardActions + CardContent
│       │   ├── ItemCard/                # MUI Card + CardMedia + CardContent + CardActions
│       │   ├── Page/                     # MUI Grid + ThemeProvider
│       │   ├── ProxiedSignInPage/       # MUI + sign-in flow
│       │   ├── Sidebar/                 # MUI Drawer + IconButton + Badge + TextField (22 files)
│       │   ├── SignInPage/              # MUI Grid + Card + Button + Typography
│       │   └── TabbedCard/             # MUI Card + Tabs + Tab + Divider
│       ├── hooks/                        # Query param, support config hooks
│       ├── icons/                        # MUI BrokenImage fallback icon
│       ├── overridableComponents.ts     # MUI override system
│       └── translation.ts              # i18n translation reference
├── theme/                                # Unified theming (MUI v4/v5)
│   └── src/
│       ├── base/                         # Base palettes, typography, page themes
│       ├── unified/                     # UnifiedThemeProvider (v4+v5 bridge)
│       ├── v4/                           # Deprecated MUI v4 createTheme
│       └── v5/                           # MUI v5 defaultComponentThemes
├── app/                                  # Example app entry point
│   └── src/
│       ├── App.tsx                       # createApp() with plugin registration
│       ├── modules/appModuleNav.tsx     # Sidebar (imports makeStyles, MUI icons)
│       └── HomePage.tsx                 # Homepage with grid widgets
├── app-defaults/                        # Default app configuration (MUI theme)
├── ui/                                   # Backstage UI (BUI) - React Aria based (NOT MUI)
│   └── src/
│       ├── components/                   # 38 components (Box, Flex, Button, Table, etc.)
│       ├── css/tokens.css               # CSS custom properties (--bui-*)
│       └── hooks/                       # useDefinition, useBg, useBreakpoint
plugins/
├── catalog/src/                          # Software catalog UI (38 MUI files)
│   ├── components/                       # AboutCard, CatalogPage, CatalogTable, EntityLayout...
│   └── alpha/components/                # EntityHeader, EntityLabels, EntityLayout, EntityTabs
├── scaffolder/src/                       # Template wizard (63 MUI files)
│   ├── components/                       # ActionsPage, ListTasksPage, OngoingTask, fields/*
│   └── alpha/components/                # TemplateEditorPage, TemplateListPage, TemplateWizardPage
├── techdocs/src/                         # Documentation reader (28 MUI files)
│   ├── home/                             # TechDocs landing page
│   ├── reader/                           # Documentation reader/viewer
│   └── search/                           # TechDocs search integration
├── search/src/                           # Global search (10 MUI files)
│   └── components/                       # SearchPage, SearchBar, util
├── user-settings/src/                    # User preferences (21 MUI files)
│   └── components/                       # Settings page, profile, theme toggles
├── catalog-react/src/                    # Shared catalog React components (33 MUI files)
│   └── components/                       # EntityTable, FilterLayout, Pickers, RefLink...
├── search-react/src/                     # Shared search React components (27 MUI files)
│   └── components/                       # SearchBar, SearchResult, SearchFilter...
├── scaffolder-react/src/                 # Shared scaffolder React components (28 MUI files)
│   └── components/                       # Stepper, ReviewState, FieldExtensions...
└── techdocs-react/src/                   # Shared TechDocs React components (2 MUI files)
```

### 0.2.3 Unique MUI Component Usage Inventory

The following MUI components are used across all in-scope packages (88 unique MUI core imports, 104 unique icon imports):

**MUI Core Components Used:**

| Category | MUI Components |
|----------|---------------|
| **Layout** | `Box`, `Grid`, `Divider`, `Drawer`, `Container` |
| **Navigation** | `Breadcrumbs`, `BottomNavigation`, `BottomNavigationAction`, `Link`, `Tabs`, `Tab`, `Stepper`, `Step`, `StepContent`, `StepLabel` |
| **Inputs** | `Button`, `IconButton`, `TextField`, `InputBase`, `InputLabel`, `Select`, `MenuItem`, `MenuList`, `Checkbox`, `FormControl`, `FormHelperText` |
| **Data Display** | `Typography`, `Table`, `TableBody`, `TableCell`, `TableRow`, `Chip`, `Avatar`, `Badge`, `List`, `ListItem`, `ListItemIcon`, `ListItemText`, `ListItemAvatar`, `Tooltip`, `SvgIcon` |
| **Feedback** | `Dialog`, `DialogTitle`, `DialogContent`, `DialogContentText`, `DialogActions`, `Snackbar`, `SnackbarContent`, `CircularProgress`, `LinearProgress`, `Popover` |
| **Surfaces** | `Card`, `CardHeader`, `CardContent`, `CardActions`, `CardMedia`, `Accordion`, `AccordionDetails`, `AccordionSummary`, `Paper` |
| **Utilities** | `ClickAwayListener`, `useMediaQuery`, `makeStyles`, `withStyles`, `useTheme`, `createBreakpoints` |
| **Lab** | `Alert` (from `@material-ui/lab`) |
| **Third-party** | `@material-table/core` (full data table with sort, filter, pagination) |

**MUI Icon Categories (104 unique icons):** Navigation arrows, action icons (Add, Edit, Delete, Search, Close, Check), status indicators (CheckCircle, Warning, Error, Info), utility icons (Build, Settings, Menu, ExpandMore), and domain-specific icons (Code, Cloud, Storage, Visibility).


## 0.3 Scope Boundaries

### 0.3.1 Exhaustively In Scope

**Source transformations (core packages):**
- `packages/core-components/src/**/*.tsx` — All 37 UI controls and 18 layout primitives (121 MUI files)
- `packages/core-components/src/**/*.ts` — Barrel exports, overridable components, hooks, translation ref
- `packages/theme/src/**/*.ts` — Complete theme system replacement (base, unified, v4, v5 directories)
- `packages/app/src/**/*.tsx` — App shell (`App.tsx`), navigation module (`modules/appModuleNav.tsx`), home page (`HomePage.tsx`)
- `packages/app-defaults/src/**/*.ts` — Default app configuration with MUI theme bindings

**Source transformations (core plugins):**
- `plugins/catalog/src/**/*.tsx` — Software catalog views: CatalogPage, CatalogTable, AboutCard, EntityLayout, EntityContextMenu, and 20+ entity cards (38 MUI files)
- `plugins/catalog/src/alpha/**/*.tsx` — Alpha catalog components: EntityHeader, EntityLabels, EntityTabs, filters, pages
- `plugins/scaffolder/src/**/*.tsx` — Scaffolder wizard: TemplateListPage, TemplateWizardPage, TemplateEditorPage, ActionsPage, form fields (63 MUI files)
- `plugins/techdocs/src/**/*.tsx` — TechDocs reader, home, search integration (28 MUI files)
- `plugins/search/src/**/*.tsx` — Search page, search bar, search result display (10 MUI files)
- `plugins/user-settings/src/**/*.tsx` — Settings page, profile display, theme toggles (21 MUI files)

**Source transformations (shared React libraries):**
- `plugins/catalog-react/src/**/*.tsx` — Shared catalog components: EntityTable, FilterLayout, Pickers, EntityRefLink, InspectEntityDialog (33 MUI files)
- `plugins/search-react/src/**/*.tsx` — Shared search components: SearchBar, SearchResult, SearchFilter (27 MUI files)
- `plugins/scaffolder-react/src/**/*.tsx` — Shared scaffolder components: Stepper, ReviewState, FieldExtensions (28 MUI files)
- `plugins/techdocs-react/src/**/*.tsx` — Shared TechDocs components (2 MUI files)

**Test updates:**
- `packages/core-components/src/**/*.test.tsx` — All unit tests for redesigned components
- `packages/core-components/src/**/*.test.ts` — Hook and utility tests
- `packages/theme/src/**/*.test.ts` — Theme system tests
- `plugins/catalog/src/**/*.test.tsx` — Catalog plugin tests
- `plugins/scaffolder/src/**/*.test.tsx` — Scaffolder plugin tests
- `plugins/techdocs/src/**/*.test.tsx` — TechDocs plugin tests
- `plugins/search/src/**/*.test.tsx` — Search plugin tests
- `plugins/user-settings/src/**/*.test.tsx` — User settings plugin tests
- `plugins/catalog-react/src/**/*.test.tsx` — Shared catalog-react tests
- `plugins/search-react/src/**/*.test.tsx` — Shared search-react tests
- `plugins/scaffolder-react/src/**/*.test.tsx` — Shared scaffolder-react tests
- `packages/app/e2e-tests/**/*.test.ts` — Playwright E2E tests

**Configuration updates:**
- `packages/core-components/package.json` — Replace MUI dependencies with shadcn/ui stack
- `packages/theme/package.json` — Replace Emotion + MUI v5 with Tailwind CSS
- `packages/app/package.json` — Replace MUI v4 dependencies
- `packages/app-defaults/package.json` — Replace MUI dependencies
- `plugins/catalog/package.json` — Replace MUI dependencies
- `plugins/scaffolder/package.json` — Replace MUI + `@rjsf/material-ui` dependencies
- `plugins/techdocs/package.json` — Replace MUI dependencies
- `plugins/search/package.json` — Replace MUI dependencies
- `plugins/user-settings/package.json` — Replace MUI dependencies
- `plugins/catalog-react/package.json` — Replace MUI + `material-ui-popup-state` dependencies
- `plugins/search-react/package.json` — Replace MUI dependencies
- `plugins/scaffolder-react/package.json` — Replace MUI + `@rjsf/material-ui` dependencies
- `packages/core-components/.eslintrc.js` — Update `no-top-level-material-ui-4-imports` rule
- `tsconfig.json` — Add path aliases for `@/components/ui/*`
- `package.json` (root) — Update `@types/react` resolutions, add Tailwind CSS
- `.storybook/main.ts` — Update Vite config for Tailwind CSS support
- `.storybook/preview.tsx` — Update theme provider and global styles
- `playwright.config.ts` — Add screenshot validation test configurations

**Documentation updates:**
- `README.md` — Update technology stack description
- `packages/core-components/README.md` — Reflect shadcn/ui migration
- `packages/theme/README.md` — Document new CSS custom property token system
- `packages/ui/README.md` — Document integration with shadcn/ui
- `docs/**/*.md` — Update architecture references to new component system

**Import corrections:**
- Every file containing `from '@material-ui/core/'` imports (384 files)
- Every file containing `from '@material-ui/icons/'` imports
- Every file containing `from '@material-ui/lab/'` imports
- Every file containing `from '@mui/material'` imports (9 files in theme)
- Every file containing `from '@emotion/'` imports
- Every file containing `makeStyles` or `withStyles` calls

### 0.3.2 Explicitly Out of Scope

- **Community plugins** — All plugins not listed above remain on MUI and are explicitly excluded per user instruction. Visual coexistence between shadcn/ui core surfaces and MUI plugin surfaces is acceptable during the transition period.
- `plugins/catalog-graph/` — Community graph visualization plugin
- `plugins/catalog-import/` — Community catalog import plugin (unless directly imported by core catalog)
- `plugins/kubernetes/` — Community Kubernetes plugin
- `plugins/notifications/` — Community notifications plugin
- `plugins/home/` — Community home plugin
- `plugins/devtools/` — Community DevTools plugin
- `plugins/app-visualizer/` — Community app visualizer plugin
- `plugins/org/` — Community org plugin
- **Backend packages** — All `packages/backend*`, `plugins/*-backend*` are backend-only and have no UI components
- **CLI tooling** — `packages/cli/`, `packages/cli-node/`, `packages/create-app/` are build/CLI tools
- **Documentation sites** — `docs-ui/`, `microsite/` (Next.js and Docusaurus marketing sites)
- **MUI within existing Backstage UI (BUI)** — `packages/ui/` is already MUI-free (uses React Aria Components); it is not a migration target itself but may serve as a pattern reference
- **Backend API contracts** — No backend API changes are required; this is a purely frontend UI redesign
- **Plugin mounting API** — The `packages/frontend-plugin-api/` contract must be preserved, not modified


## 0.4 Design System Compliance

### 0.4.1 System Identification

- **Library:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Version:** Latest (shadcn CLI 3.0+, using unified `radix-ui` mono-package as of February 2026)
- **Status:** To-be-added — shadcn/ui is not currently installed in the Backstage monorepo
- **Package:** `radix-ui` (unified package replacing individual `@radix-ui/react-*` packages), `tailwindcss` (v4), `lucide-react` (icons)
- **Style:** new-york (the recommended shadcn/ui style using the unified `radix-ui` package)
- **Source:** https://ui.shadcn.com/docs/components (official documentation)

shadcn/ui operates as a code-distribution system rather than a traditional npm package — components are copied into the project's source tree at `packages/core-components/src/components/ui/` and become first-party code. This aligns well with Backstage's monorepo architecture where component ownership is maintained locally.

### 0.4.2 Component Mapping

The following table maps every MUI component currently used in the core Backstage UI to its shadcn/ui equivalent, documenting the specific component, import path, and improvement characteristics.

**Layout and Structural Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Box` | Native `div` + Tailwind classes | — | `className` | Zero runtime overhead vs MUI's styled-system Box |
| `Grid` | CSS Grid via Tailwind (`grid`, `grid-cols-*`) | — | `className` | Pure CSS, no JS-in-CSS Grid component |
| `Container` | Native `div` + `max-w-*` Tailwind classes | — | `className` | No runtime, tree-shakeable |
| `Divider` | `Separator` | `radix-ui` / local `ui/separator` | `orientation` | Accessible, minimal |
| `Paper` | `Card` | local `ui/card` | — | Composable Card/CardHeader/CardContent/CardFooter |
| `Drawer` | `Sheet` | local `ui/sheet` | `side` | Animated, accessible, lightweight |

**Navigation Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Breadcrumbs` | `Breadcrumb` | local `ui/breadcrumb` | — | Composable BreadcrumbItem/Link/Separator/Ellipsis |
| `Tabs` + `Tab` | `Tabs` | local `ui/tabs` | `value`, `defaultValue` | Built on Radix Tabs primitive, accessible |
| `Stepper` + `Step` + `StepContent` | Custom stepper via Radix primitives | local `ui/stepper` (custom) | `steps[]`, `activeStep` | Composable, lightweight vs MUI's heavy stepper |
| `BottomNavigation` | `NavigationMenu` | local `ui/navigation-menu` | — | Radix NavigationMenu with keyboard nav |
| `Link` | shadcn `Link` + React Router | local wrapper | `href` | Pure CSS styling, no MUI overhead |

**Input Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Button` | `Button` | local `ui/button` | `variant`, `size` | 6 variants (default/destructive/outline/secondary/ghost/link), composable |
| `IconButton` | `Button` (variant=ghost, size=icon) | local `ui/button` | `variant="ghost"`, `size="icon"` | Single component, no separate IconButton needed |
| `TextField` | `Input` | local `ui/input` | `type`, `placeholder` | Minimal, Tailwind-styled |
| `InputBase` | `Input` | local `ui/input` | — | Cleaner API |
| `Select` + `MenuItem` | `Select` | local `ui/select` | `value`, `onValueChange` | Radix Select with keyboard nav, portal rendering |
| `Checkbox` | `Checkbox` | local `ui/checkbox` | `checked`, `onCheckedChange` | Radix Checkbox, accessible |
| `FormControl` + `FormHelperText` | `Field` + `FieldLabel` + `FieldError` | local `ui/field` | — | 2025 shadcn Field component unifies form wiring |

**Data Display Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Typography` | `Text` / native elements + Tailwind | — | `className` with typography tokens | No runtime component, pure CSS |
| `@material-table/core` | `DataTable` (shadcn + `@tanstack/react-table`) | local `ui/data-table` | `columns`, `data` | 90%+ smaller bundle, headless, composable |
| `Table` + `TableBody` + `TableRow` + `TableCell` | `Table` | local `ui/table` | — | Pure HTML table with Tailwind styling |
| `Chip` | `Badge` | local `ui/badge` | `variant` | Minimal, Tailwind-styled |
| `Avatar` | `Avatar` | local `ui/avatar` | — | Radix Avatar with fallback support |
| `Badge` (MUI) | `Badge` | local `ui/badge` | `variant` | Lightweight |
| `List` + `ListItem` + `ListItemIcon` + `ListItemText` | `Item` (2025 shadcn) | local `ui/item` | — | Composable ItemMedia/ItemContent/ItemTitle/ItemDescription |
| `Tooltip` | `Tooltip` | local `ui/tooltip` | `content` | Radix Tooltip with portal, collision-aware |
| `SvgIcon` | Lucide icons | `lucide-react` | `size`, `className` | Tree-shakeable, consistent icon set |

**Feedback Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Dialog` + `DialogTitle` + `DialogContent` + `DialogActions` | `Dialog` | local `ui/dialog` | — | Radix Dialog, composable, accessible |
| `Snackbar` + `SnackbarContent` | `Sonner` (toast) | `sonner` | `toast()` function | Stackable, animated, minimal |
| `Alert` (Lab) | `Alert` | local `ui/alert` | `variant` | Pure CSS variants |
| `CircularProgress` | `Spinner` (2025 shadcn) | local `ui/spinner` | — | Lightweight CSS animation |
| `LinearProgress` | `Progress` | local `ui/progress` | `value` | Radix Progress, accessible |
| `Popover` | `Popover` | local `ui/popover` | — | Radix Popover, collision-aware, portal |

**Surface Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `Card` + `CardHeader` + `CardContent` + `CardActions` + `CardMedia` | `Card` | local `ui/card` | — | Composable Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter |
| `Accordion` + `AccordionSummary` + `AccordionDetails` | `Accordion` | local `ui/accordion` | — | Radix Accordion, animated, accessible |

**Utility Components:**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `ClickAwayListener` | Built into Radix primitives | — | — | Handled by Radix Dialog/Popover/Dropdown |
| `makeStyles` / `withStyles` | Tailwind CSS utility classes + `cn()` | `lib/utils` | — | Zero runtime, no CSS-in-JS overhead |
| `useMediaQuery` | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) | — | — | Pure CSS, no JS media query listener |
| `useTheme` | CSS custom properties | — | `var(--*)` | No React context, pure CSS |
| `MenuList` + `MenuItem` | `DropdownMenu` | local `ui/dropdown-menu` | — | Radix DropdownMenu, keyboard nav, sub-menus |
| `@rjsf/material-ui` | `Field` + custom form components | local custom | — | shadcn Field + react-hook-form + zod |

**Global Search (Command Palette):**

| MUI Component | shadcn/ui Component | Import Path | Props / Variant | Improvement over MUI |
|---------------|-------------------|-------------|-----------------|---------------------|
| `SidebarSearchModal` (custom) | `Command` (cmdk) | local `ui/command` | — | `cmdk` library, keyboard-first, Discord/Linear-style |
| — | `CommandDialog` | local `ui/command` | — | Composable CommandInput/CommandList/CommandGroup/CommandItem |

### 0.4.3 Gaps Inventory

| Gap Element | Description | Proposed Resolution |
|------------|-------------|---------------------|
| `@material-table/core` full-featured data table | MUI's material-table provides built-in sorting, filtering, pagination, column reordering, row selection, and CSV export | Build custom `DataTable` on `@tanstack/react-table` v8 with shadcn/ui table primitives. The BUI package already uses `@tanstack/react-table: ^8.21.3` |
| MUI `Stepper` (vertical wizard) | Used extensively in scaffolder for multi-step template creation | Build custom stepper component using Radix primitives and Tailwind, maintaining the same step/label/content composition pattern |
| `@rjsf/material-ui` (JSON Schema forms) | Used in scaffolder for dynamic form generation from JSON Schema | Replace with `@rjsf/core` + custom shadcn/ui widget theme, or migrate to react-hook-form + zod with shadcn/ui Field components |
| MUI `overridableComponents.ts` system | Allows theme-level component style overrides | Implement a CSS custom property-based override system that plugin consumers can customize via CSS |
| MUI `makeStyles` patterns (121 files) | CSS-in-JS with theme injection | Replace with Tailwind utility classes and `cn()` helper; some complex dynamic styles may require `clsx` + CSS custom properties |
| `material-ui-popup-state` (catalog-react) | Manages popover/menu state | Replace with Radix's built-in state management in Popover/DropdownMenu primitives |
| `DependencyGraph` (dagre + d3) | Complex graph visualization with MUI styling | Retain dagre/d3 core logic; replace MUI styling with Tailwind classes |
| `ProgressBars` (rc-progress) | Circular gauge indicators | Retain rc-progress; wrap with Tailwind-styled containers |
| `TrendLine` (react-sparklines) | Inline trend charts | Retain react-sparklines; replace MUI theming with CSS custom property colors |
| `LogViewer` (react-window virtualization) | ANSI log rendering with virtualization | Retain virtualization; replace MUI controls (IconButton, Tooltip) with shadcn equivalents |

### 0.4.4 Token Mapping

The existing BUI token system in `packages/ui/src/css/tokens.css` already defines a comprehensive CSS custom property vocabulary with `--bui-*` prefix. The shadcn/ui redesign will align with this existing token system where possible while extending it with shadcn/ui conventions.

| Category | Existing BUI Token | shadcn/ui Convention | Resolution |
|----------|-------------------|---------------------|------------|
| Background | `--bui-bg-app` (#f8f8f8) | `--background` | Map to shadcn token name |
| Foreground | `--bui-fg-primary` (#000000) | `--foreground` | Map to shadcn token name |
| Primary solid | `--bui-bg-solid` (#1f5493) | `--primary` | Map to shadcn token name |
| Primary foreground | `--bui-fg-solid` (#ffffff) | `--primary-foreground` | Map to shadcn token name |
| Danger | `--bui-bg-danger` (#ffe2e2) | `--destructive` | Map to shadcn token name |
| Border | `--bui-border-1` (#d9d9d9) | `--border` | Map to shadcn token name |
| Radius | `--bui-radius-3` (0.5rem) | `--radius` | Map to shadcn token name |
| Ring | `--bui-ring` (#1f5493) | `--ring` | Map to shadcn token name |
| Card | `--bui-bg-neutral-1` (#fff) | `--card` | Map to shadcn token name |
| Popover | `--bui-bg-popover` (#ffffff) | `--popover` | Map to shadcn token name |
| Muted | `--bui-bg-neutral-2` | `--muted` | Map to shadcn token name |
| Spacing | `--bui-space` (0.25rem) | Tailwind spacing scale | Use Tailwind's built-in scale |
| Font family | `--bui-font-regular` (system-ui) | `--font-sans` | Map to shadcn token name |
| Monospace | `--bui-font-monospace` | `--font-mono` | Map to shadcn token name |

### 0.4.5 Compliance Summary

shadcn/ui provides direct equivalents for the vast majority of MUI components used in Backstage's core UI. Of the 88 unique MUI core component imports, shadcn/ui covers approximately 75 through direct component matches or Tailwind utility class replacements. The 10 identified gaps all have viable resolution paths — primarily through custom compositions of Radix primitives or retention of specialized third-party libraries (dagre, rc-progress, react-sparklines) with Tailwind CSS styling wrappers. The `radix-ui` unified package (as of February 2026) and Tailwind CSS v4 need to be added as new dependencies. The `lucide-react` icon library replaces all 104 MUI icon imports with tree-shakeable, consistently styled alternatives.


## 0.5 Target Design

### 0.5.1 Refactored Structure Planning

The target architecture replaces all MUI dependencies in the core Backstage packages and in-scope plugins with shadcn/ui components built on Radix UI primitives and styled with Tailwind CSS. The existing BUI (`packages/ui`) package provides the foundational token system and some components, while shadcn/ui components are added to `packages/core-components` as first-party code. The structure below comprehensively maps all affected packages and their contents:

```
Target:
packages/
├── core-components/
│   ├── package.json                           (UPDATE: remove @material-ui/*, add radix-ui, tailwindcss, lucide-react, @tanstack/react-table, cmdk, sonner)
│   ├── tailwind.config.ts                     (CREATE: Tailwind configuration with backstage token integration)
│   ├── postcss.config.js                      (CREATE: PostCSS with Tailwind plugin)
│   ├── .eslintrc.js                           (UPDATE: replace no-top-level-material-ui-4-imports rule)
│   ├── src/
│   │   ├── index.ts                           (UPDATE: re-export new components)
│   │   ├── lib/
│   │   │   └── utils.ts                       (CREATE: cn() helper using clsx + tailwind-merge)
│   │   ├── styles/
│   │   │   ├── globals.css                    (CREATE: shadcn/ui CSS custom property token system)
│   │   │   └── tailwind.css                   (CREATE: @tailwind base/components/utilities directives)
│   │   ├── components/
│   │   │   ├── ui/                            (CREATE: shadcn/ui primitive components directory)
│   │   │   │   ├── accordion.tsx              (CREATE: Radix Accordion primitive)
│   │   │   │   ├── alert.tsx                  (CREATE: Alert with variant support)
│   │   │   │   ├── avatar.tsx                 (CREATE: Radix Avatar with fallback)
│   │   │   │   ├── badge.tsx                  (CREATE: Badge replacing MUI Chip)
│   │   │   │   ├── breadcrumb.tsx             (CREATE: Composable breadcrumb)
│   │   │   │   ├── button.tsx                 (CREATE: Button with 6 variants)
│   │   │   │   ├── card.tsx                   (CREATE: Card/Header/Content/Footer)
│   │   │   │   ├── checkbox.tsx               (CREATE: Radix Checkbox)
│   │   │   │   ├── command.tsx                (CREATE: cmdk-based command palette)
│   │   │   │   ├── data-table.tsx             (CREATE: @tanstack/react-table integration)
│   │   │   │   ├── dialog.tsx                 (CREATE: Radix Dialog)
│   │   │   │   ├── dropdown-menu.tsx          (CREATE: Radix DropdownMenu)
│   │   │   │   ├── input.tsx                  (CREATE: Input field)
│   │   │   │   ├── label.tsx                  (CREATE: Radix Label)
│   │   │   │   ├── navigation-menu.tsx        (CREATE: Radix NavigationMenu)
│   │   │   │   ├── popover.tsx                (CREATE: Radix Popover)
│   │   │   │   ├── progress.tsx               (CREATE: Radix Progress)
│   │   │   │   ├── scroll-area.tsx            (CREATE: Radix ScrollArea)
│   │   │   │   ├── select.tsx                 (CREATE: Radix Select)
│   │   │   │   ├── separator.tsx              (CREATE: Radix Separator)
│   │   │   │   ├── sheet.tsx                  (CREATE: Radix Dialog-based Sheet/Drawer)
│   │   │   │   ├── skeleton.tsx               (CREATE: Skeleton loader)
│   │   │   │   ├── switch.tsx                 (CREATE: Radix Switch)
│   │   │   │   ├── table.tsx                  (CREATE: Table/Head/Body/Row/Cell)
│   │   │   │   ├── tabs.tsx                   (CREATE: Radix Tabs)
│   │   │   │   ├── textarea.tsx               (CREATE: Textarea input)
│   │   │   │   ├── toast.tsx                  (CREATE: Sonner toast integration)
│   │   │   │   ├── tooltip.tsx                (CREATE: Radix Tooltip)
│   │   │   │   └── visually-hidden.tsx        (CREATE: VisuallyHidden utility)
│   │   │   ├── AlertDisplay/
│   │   │   │   ├── AlertDisplay.tsx           (UPDATE: replace MUI Snackbar with Sonner toast)
│   │   │   │   └── AlertDisplay.test.tsx      (UPDATE: test expectations)
│   │   │   ├── AutoLogout/
│   │   │   │   ├── AutoLogout.tsx             (UPDATE: replace MUI Dialog/Button with shadcn Dialog/Button)
│   │   │   │   └── AutoLogout.test.tsx        (UPDATE: test expectations)
│   │   │   ├── Avatar/
│   │   │   │   ├── Avatar.tsx                 (UPDATE: replace MUI Avatar with shadcn Avatar)
│   │   │   │   └── Avatar.test.tsx            (UPDATE: test expectations)
│   │   │   ├── Chip/
│   │   │   │   ├── Chip.tsx                   (UPDATE: replace MUI Chip with shadcn Badge)
│   │   │   │   └── Chip.test.tsx              (UPDATE: test expectations)
│   │   │   ├── CodeSnippet/
│   │   │   │   └── CodeSnippet.tsx            (UPDATE: replace MUI makeStyles with Tailwind classes)
│   │   │   ├── CopyTextButton/
│   │   │   │   └── CopyTextButton.tsx         (UPDATE: replace MUI IconButton/Tooltip with shadcn)
│   │   │   ├── CreateButton/
│   │   │   │   └── CreateButton.tsx           (UPDATE: replace MUI Button with shadcn Button)
│   │   │   ├── DependencyGraph/
│   │   │   │   └── DependencyGraph.tsx        (UPDATE: replace MUI styling with Tailwind classes)
│   │   │   ├── Dialog/
│   │   │   │   └── Dialog.tsx                 (UPDATE: replace MUI Dialog with shadcn Dialog)
│   │   │   ├── DismissableBanner/
│   │   │   │   └── DismissableBanner.tsx      (UPDATE: replace MUI Snackbar with shadcn Alert)
│   │   │   ├── Drawer/
│   │   │   │   └── Drawer.tsx                 (UPDATE: replace MUI Drawer with shadcn Sheet)
│   │   │   ├── EmptyState/
│   │   │   │   └── EmptyState.tsx             (UPDATE: replace MUI Grid/Typography with Tailwind)
│   │   │   ├── ErrorPanel/
│   │   │   │   └── ErrorPanel.tsx             (UPDATE: replace MUI Accordion with shadcn Accordion)
│   │   │   ├── FavoriteToggle/
│   │   │   │   └── FavoriteToggle.tsx         (UPDATE: replace MUI IconButton with shadcn Button icon variant)
│   │   │   ├── FeatureDiscovery/
│   │   │   │   └── FeatureCalloutCircular.tsx (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── HeaderIconLinkRow/
│   │   │   │   └── HeaderIconLinkRow.tsx      (UPDATE: replace MUI Typography/Link with Tailwind)
│   │   │   ├── HorizontalScrollGrid/
│   │   │   │   └── HorizontalScrollGrid.tsx   (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── Lifecycle/
│   │   │   │   └── Lifecycle.tsx              (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── Link/
│   │   │   │   └── Link.tsx                   (UPDATE: replace MUI Link with Tailwind-styled anchor)
│   │   │   ├── LinkButton/
│   │   │   │   └── LinkButton.tsx             (UPDATE: replace MUI Button with shadcn Button)
│   │   │   ├── LogViewer/
│   │   │   │   ├── LogViewer.tsx              (UPDATE: replace MUI controls with shadcn)
│   │   │   │   └── LogViewerControls.tsx      (UPDATE: replace MUI IconButton/Tooltip)
│   │   │   ├── MarkdownContent/
│   │   │   │   └── MarkdownContent.tsx        (UPDATE: replace MUI makeStyles with Tailwind prose)
│   │   │   ├── OAuthRequestDialog/
│   │   │   │   └── OAuthRequestDialog.tsx     (UPDATE: replace MUI Dialog/List with shadcn Dialog)
│   │   │   ├── OverflowTooltip/
│   │   │   │   └── OverflowTooltip.tsx        (UPDATE: replace MUI Tooltip with shadcn Tooltip)
│   │   │   ├── Progress/
│   │   │   │   └── Progress.tsx               (UPDATE: replace MUI LinearProgress with shadcn Progress)
│   │   │   ├── ProgressBars/
│   │   │   │   └── ProgressBars.tsx           (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── ResponseErrorPanel/
│   │   │   │   └── ResponseErrorPanel.tsx     (UPDATE: replace MUI components with shadcn)
│   │   │   ├── Select/
│   │   │   │   └── Select.tsx                 (UPDATE: replace MUI Select with shadcn Select)
│   │   │   ├── SimpleStepper/
│   │   │   │   └── SimpleStepper.tsx          (UPDATE: replace MUI Stepper with custom shadcn stepper)
│   │   │   ├── Status/
│   │   │   │   └── Status.tsx                 (UPDATE: replace MUI makeStyles with Tailwind status classes)
│   │   │   ├── StructuredMetadataTable/
│   │   │   │   └── StructuredMetadataTable.tsx (UPDATE: replace MUI Table with shadcn Table)
│   │   │   ├── SupportButton/
│   │   │   │   └── SupportButton.tsx          (UPDATE: replace MUI Popover/List with shadcn Popover)
│   │   │   ├── TabbedLayout/
│   │   │   │   └── TabbedLayout.tsx           (UPDATE: replace MUI Tabs with shadcn Tabs)
│   │   │   ├── Table/
│   │   │   │   └── Table.tsx                  (UPDATE: replace @material-table/core with @tanstack/react-table + shadcn DataTable)
│   │   │   ├── TrendLine/
│   │   │   │   └── TrendLine.tsx              (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   └── WarningPanel/
│   │   │       └── WarningPanel.tsx           (UPDATE: replace MUI Accordion with shadcn Accordion)
│   │   ├── layout/
│   │   │   ├── BottomLink/
│   │   │   │   └── BottomLink.tsx             (UPDATE: replace MUI Card/Button with shadcn)
│   │   │   ├── Breadcrumbs/
│   │   │   │   └── Breadcrumbs.tsx            (UPDATE: replace MUI Breadcrumbs with shadcn Breadcrumb)
│   │   │   ├── Content/
│   │   │   │   └── Content.tsx                (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── ContentHeader/
│   │   │   │   └── ContentHeader.tsx          (UPDATE: replace MUI Grid/Typography with Tailwind)
│   │   │   ├── ErrorBoundary/
│   │   │   │   └── ErrorBoundary.tsx          (UPDATE: replace MUI components with shadcn)
│   │   │   ├── ErrorPage/
│   │   │   │   └── ErrorPage.tsx              (UPDATE: replace MUI Grid/Typography/Button with shadcn)
│   │   │   ├── Header/
│   │   │   │   └── Header.tsx                 (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   ├── HeaderActionMenu/
│   │   │   │   └── HeaderActionMenu.tsx       (UPDATE: replace MUI IconButton/MenuList with shadcn DropdownMenu)
│   │   │   ├── HeaderLabel/
│   │   │   │   └── HeaderLabel.tsx            (UPDATE: replace MUI Typography with Tailwind)
│   │   │   ├── HeaderTabs/
│   │   │   │   └── HeaderTabs.tsx             (UPDATE: replace MUI Tabs with shadcn Tabs)
│   │   │   ├── InfoCard/
│   │   │   │   └── InfoCard.tsx               (UPDATE: replace MUI Card with shadcn Card)
│   │   │   ├── ItemCard/
│   │   │   │   ├── ItemCard.tsx               (UPDATE: replace MUI Card with shadcn Card)
│   │   │   │   └── ItemCardGrid.tsx           (UPDATE: replace MUI Grid with Tailwind grid)
│   │   │   ├── Page/
│   │   │   │   └── Page.tsx                   (UPDATE: replace MUI ThemeProvider with CSS custom properties)
│   │   │   ├── ProxiedSignInPage/
│   │   │   │   └── ProxiedSignInPage.tsx      (UPDATE: replace MUI components with shadcn)
│   │   │   ├── Sidebar/
│   │   │   │   ├── Bar.tsx                    (UPDATE: replace MUI Drawer with shadcn Sheet + custom sidebar)
│   │   │   │   ├── SidebarItem.tsx            (UPDATE: replace MUI makeStyles/ListItem with Tailwind)
│   │   │   │   ├── SidebarSubmenu.tsx         (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   │   ├── SidebarSubmenuItem.tsx     (UPDATE: replace MUI styled with Tailwind)
│   │   │   │   ├── SidebarGroup.tsx           (UPDATE: replace MUI makeStyles with Tailwind)
│   │   │   │   ├── SidebarPinStateContext.tsx (UPDATE: remove MUI theme dependency)
│   │   │   │   ├── SidebarOpenStateContext.tsx (UPDATE: remove MUI theme dependency)
│   │   │   │   ├── SidebarPage.tsx            (UPDATE: replace MUI makeStyles with Tailwind layout)
│   │   │   │   ├── MobileSidebar.tsx          (UPDATE: replace MUI BottomNavigation with Tailwind)
│   │   │   │   └── icons/                    (UPDATE: replace MUI SvgIcon usage with Lucide icons)
│   │   │   ├── SignInPage/
│   │   │   │   └── SignInPage.tsx             (UPDATE: replace MUI Grid/Card/Button with shadcn)
│   │   │   ├── TabbedCard/
│   │   │   │   └── TabbedCard.tsx             (UPDATE: replace MUI Card/Tabs with shadcn Card + Tabs)
│   │   │   └── index.ts                       (UPDATE: barrel exports)
│   │   └── overridableComponents.ts           (UPDATE: replace MUI override system with CSS custom property system)
│   └── api-report/                            (UPDATE: regenerate after API changes)
│
├── theme/
│   ├── package.json                           (UPDATE: add tailwindcss dependency, retain MUI for backward compat)
│   ├── src/
│   │   ├── index.ts                           (UPDATE: export new shadcn theme helpers)
│   │   ├── base/
│   │   │   ├── palette.ts                     (UPDATE: add CSS custom property token generation)
│   │   │   └── typography.ts                  (UPDATE: add CSS custom property typography tokens)
│   │   ├── unified/
│   │   │   ├── UnifiedThemeProvider.tsx        (UPDATE: inject CSS custom properties alongside MUI themes)
│   │   │   └── theme.ts                       (UPDATE: add shadcn token generation helpers)
│   │   └── tokens/
│   │       └── shadcn-tokens.css              (CREATE: shadcn/ui CSS custom property definitions for light/dark)
│   └── api-report/                            (UPDATE: regenerate)
│
├── app/
│   ├── package.json                           (UPDATE: add tailwindcss, radix-ui, lucide-react)
│   ├── tailwind.config.ts                     (CREATE: app-level Tailwind config)
│   ├── src/
│   │   ├── index.tsx                          (UPDATE: import global shadcn styles)
│   │   ├── App.tsx                            (UPDATE: verify shadcn theme provider integration)
│   │   ├── HomePage.tsx                       (UPDATE: replace MUI components with shadcn)
│   │   ├── modules/
│   │   │   └── appModuleNav.tsx               (UPDATE: replace MUI makeStyles/icons with Tailwind/Lucide)
│   │   └── examples/
│   │       └── notFoundErrorPageExtension.tsx (UPDATE: replace MUI Box/Typography/Button)
│   └── e2e-tests/
│       └── app.test.ts                        (UPDATE: Playwright visual regression assertions)
│
├── app-defaults/
│   ├── package.json                           (UPDATE: remove direct MUI dependencies)
│   └── src/
│       └── defaults.ts                        (UPDATE: ensure shadcn theme integration)
│
├── frontend-defaults/
│   └── src/
│       └── index.ts                           (REFERENCE: verify compatibility with shadcn theme provider)
│
├── ui/                                        (REFERENCE: existing BUI token system as foundation)
│   └── src/
│       └── css/
│           └── tokens.css                     (REFERENCE: align shadcn tokens with --bui-* naming)
│
plugins/
├── catalog/
│   ├── package.json                           (UPDATE: remove @material-ui/*, add shadcn/ui deps)
│   ├── src/
│   │   ├── overridableComponents.ts           (UPDATE: replace MUI override types with CSS custom properties)
│   │   ├── plugin.tsx                         (UPDATE: verify extension registration with new components)
│   │   ├── components/
│   │   │   ├── AboutCard/                     (UPDATE: all *.tsx files — replace MUI with shadcn)
│   │   │   ├── CatalogPage/                   (UPDATE: CatalogPage.tsx, DefaultCatalogPage.tsx)
│   │   │   ├── CatalogTable/                  (UPDATE: replace @material-table/core with shadcn DataTable)
│   │   │   ├── EntityLayout/                  (UPDATE: EntityLayout.tsx — replace MUI Tabs/Grid)
│   │   │   ├── EntityLabelsCard/              (UPDATE: replace MUI Card/Chip with shadcn Card/Badge)
│   │   │   ├── EntityLinksCard/               (UPDATE: replace MUI Card/List with shadcn Card)
│   │   │   ├── EntityOrphanWarning/           (UPDATE: replace MUI Alert with shadcn Alert)
│   │   │   ├── EntityProcessingErrorsPanel/   (UPDATE: replace MUI components)
│   │   │   ├── EntitySwitch/                  (REFERENCE: logic-only, minimal styling changes)
│   │   │   ├── HasComponentsCard/             (UPDATE: replace MUI Card/Table with shadcn)
│   │   │   ├── HasResourcesCard/              (UPDATE: replace MUI Card/Table with shadcn)
│   │   │   ├── HasSubcomponentsCard/          (UPDATE: replace MUI Card/Table with shadcn)
│   │   │   ├── HasSystemsCard/                (UPDATE: replace MUI Card/Table with shadcn)
│   │   │   ├── RelatedEntitiesCard/           (UPDATE: replace MUI Card/Table with shadcn)
│   │   │   ├── SystemDiagramCard/             (UPDATE: replace MUI Card with shadcn, retain dagre)
│   │   │   └── CatalogSearchResultListItem/   (UPDATE: replace MUI ListItem with Tailwind)
│   │   └── alpha/
│   │       └── components/                    (UPDATE: all alpha components — replace MUI)
│
├── catalog-react/
│   ├── package.json                           (UPDATE: remove @material-ui/*, material-ui-popup-state)
│   └── src/
│       ├── components/                        (UPDATE: all *.tsx — replace MUI components)
│       └── hooks/                             (UPDATE: remove MUI theme dependencies from hooks)
│
├── scaffolder/
│   ├── package.json                           (UPDATE: remove @material-ui/*, @rjsf/material-ui)
│   ├── src/
│   │   ├── overridableComponents.ts           (UPDATE: replace MUI override types)
│   │   ├── components/
│   │   │   ├── Router/                        (UPDATE: Router.tsx — minimal, verify rendering)
│   │   │   ├── TemplatingExtensionsPage/      (UPDATE: replace MUI Autocomplete/Table with shadcn)
│   │   │   └── fields/                        (UPDATE: all field components — replace MUI form elements)
│   │   ├── alpha/
│   │   │   └── components/                    (UPDATE: all alpha scaffolder components)
│   │   └── lib/                               (REFERENCE: browser utilities, no MUI dependency)
│
├── scaffolder-react/
│   ├── package.json                           (UPDATE: remove @material-ui/*, @rjsf/material-ui)
│   └── src/
│       ├── components/                        (UPDATE: Stepper, Review, form components — replace MUI)
│       └── hooks/                             (UPDATE: remove MUI theme dependencies)
│
├── techdocs/
│   ├── package.json                           (UPDATE: remove @material-ui/*)
│   └── src/
│       ├── home/                              (UPDATE: replace MUI Table/Card with shadcn)
│       ├── reader/                            (UPDATE: replace MUI makeStyles with Tailwind)
│       └── search/                            (UPDATE: replace MUI components with shadcn)
│
├── techdocs-react/
│   ├── package.json                           (UPDATE: remove @material-ui/*)
│   └── src/                                   (UPDATE: replace MUI components where present)
│
├── search/
│   ├── package.json                           (UPDATE: remove @material-ui/*)
│   └── src/
│       └── components/                        (UPDATE: replace MUI with shadcn Command + search components)
│
├── search-react/
│   ├── package.json                           (UPDATE: remove @material-ui/*)
│   └── src/
│       └── components/                        (UPDATE: replace MUI search components with shadcn)
│
└── user-settings/
    ├── package.json                           (UPDATE: remove @material-ui/*)
    └── src/
        └── components/                        (UPDATE: replace MUI settings components with shadcn)

Root Configuration:
├── package.json                               (UPDATE: remove mui-to-bui tracking if no longer needed)
├── tailwind.config.ts                         (CREATE: monorepo root Tailwind config with shared preset)
├── postcss.config.js                          (CREATE: root PostCSS config)
├── .storybook/
│   └── main.ts                                (UPDATE: add Tailwind/PostCSS support to Vite config)
└── playwright.config.ts                       (REFERENCE: existing e2e config, add visual snapshot assertions)
```

### 0.5.2 Web Search Research Conducted

Research was conducted to inform the target architecture and validate design decisions:

- **shadcn/ui component catalog and architecture** — Confirmed shadcn/ui operates as a code-distribution system where components are copied into the project source tree. The CLI (`npx shadcn-ui@latest`) initializes configuration and adds components. All components use the unified `radix-ui` package (February 2026) instead of individual `@radix-ui/react-*` packages.
- **Radix UI unified package migration** — Validated that as of June 2025, Radix UI consolidated scattered packages into a single `radix-ui` mono-package. Import pattern changes from `import * as DialogPrimitive from "@radix-ui/react-dialog"` to `import { Dialog as DialogPrimitive } from "radix-ui"`.
- **MUI to shadcn/ui migration patterns** — Researched best practices for large-scale MUI-to-shadcn migrations. The copy-paste ownership model means components become first-party code, enabling deep customization without upstream dependency churn.
- **Tailwind CSS v4 configuration** — Validated Tailwind v4 approach with CSS custom properties and `@tailwind` directives for the build pipeline.
- **@tanstack/react-table for data table replacement** — Confirmed as the headless replacement for `@material-table/core`, already used by BUI (`packages/ui`) at version `^8.21.3`.

### 0.5.3 Design Pattern Applications

The following design patterns guide the target architecture:

- **Code ownership pattern (shadcn/ui)** — Components are copied into `packages/core-components/src/components/ui/` as first-party code. This eliminates external UI library version coupling and enables Backstage-specific customization at the source level.
- **Token-based theming pattern** — CSS custom properties define all visual tokens (color, spacing, radius, typography). Theme switching is achieved by swapping token values at the `:root` or `[data-theme-mode]` level, requiring zero JavaScript runtime for theme application.
- **Composition over inheritance** — shadcn/ui components use the compound component pattern (e.g., `Card` → `CardHeader` + `CardTitle` + `CardContent` + `CardFooter`) enabling flexible layouts without prop drilling or complex configuration objects.
- **Headless data layer** — `@tanstack/react-table` provides headless table state management (sorting, filtering, pagination, selection, column visibility) while shadcn/ui `Table` components render the visual layer. This separates data concerns from presentation.
- **Progressive coexistence** — The `UnifiedThemeProvider` in `packages/theme` continues to supply MUI v4/v5 theme contexts for community plugins that remain on MUI. The shadcn/ui token system runs alongside, with CSS custom properties injected at the document root.
- **Utility-first styling** — Tailwind CSS utility classes replace all `makeStyles`/`withStyles` CSS-in-JS calls. The `cn()` helper (using `clsx` + `tailwind-merge`) manages conditional class composition.

### 0.5.4 User Interface Design

The redesigned Backstage UI focuses on the following design goals as specified by the user:

- **Application shell** — A shadcn/ui-based collapsible sidebar replaces the MUI Drawer-based sidebar. The sidebar supports catalog navigation, pinned/collapsed states persisted via localStorage, and responsive Desktop/Mobile variants. A global search using the `Command` dialog pattern (`cmdk`) is prominently placed, activated by `Cmd/Ctrl+K`.
- **Software catalog surfaces** — The catalog list view uses a shadcn `DataTable` with `@tanstack/react-table` for sorting, filtering, column visibility, and pagination. Entity detail views use shadcn `Card` compositions for metadata, `Tabs` for plugin content areas, and `Badge` for labels/tags. The `EntityLayout` header region displays entity metadata with consistent spacing and typography.
- **Scaffolder (template wizard)** — Multi-step template creation uses a custom stepper component built on Radix primitives. Form fields use shadcn `Input`, `Select`, `Checkbox`, and `Textarea` with react-hook-form integration. The `@rjsf/material-ui` dependency is replaced with `@rjsf/core` plus a custom shadcn widget theme.
- **TechDocs reader** — The documentation reader uses Tailwind prose classes (`prose dark:prose-invert`) for Markdown content rendering. Navigation and search within docs use shadcn components. Code blocks maintain monospace typography tokens.
- **Global search** — The `Command` component provides a Discord/Linear-style search experience with keyboard navigation, categorized results (entities, docs, templates), and real-time filtering.
- **Settings** — Settings pages use shadcn `Card` layouts with form controls for user preferences, authentication, and feature flags.
- **Spacing and typography** — A consistent spacing scale (based on 0.25rem increments aligned with BUI's `--bui-space` token) reduces visual clutter across all surfaces. Typography uses a dual-font system: `--font-sans` (system-ui stack) for prose and navigation, `--font-mono` for identifiers, metadata values, and code content.
- **Theming and accessibility** — Full light/dark mode support via CSS custom properties on `[data-theme-mode]`. Both themes meet WCAG 2.1 AA contrast requirements. Color-blind-friendly status indicators use shape and pattern differentiation alongside color for catalog health and CI/CD displays.
- **Validation artifacts** — Playwright-generated screenshots capture every redesigned flow (catalog browse, entity detail, scaffolder, TechDocs, search, settings) in both light and dark modes to verify component rendering, layout consistency, and theme correctness.


## 0.6 Transformation Mapping

### 0.6.1 File-by-File Transformation Plan

Every target file is mapped to its source, with the transformation mode indicating the nature of the change. Wildcard patterns are used only where a directory's files share a uniform transformation.

**Root Configuration Files:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `tailwind.config.ts` | CREATE | `packages/ui/src/css/tokens.css` | Create monorepo root Tailwind config with shared preset, integrating BUI token values |
| `postcss.config.js` | CREATE | — | Create PostCSS config with Tailwind plugin |
| `package.json` | UPDATE | `package.json` | Add tailwindcss, postcss to workspace-level devDependencies |
| `.storybook/main.ts` | UPDATE | `.storybook/main.ts` | Add PostCSS/Tailwind plugin to Vite config, ensure stories render with shadcn styles |

**packages/core-components — New shadcn/ui Primitives:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/core-components/package.json` | UPDATE | `packages/core-components/package.json` | Remove `@material-ui/core`, `@material-ui/lab`, `@material-ui/icons`, `@material-table/core`; add `radix-ui`, `tailwindcss`, `lucide-react`, `@tanstack/react-table`, `cmdk`, `sonner`, `clsx`, `tailwind-merge` |
| `packages/core-components/tailwind.config.ts` | CREATE | `packages/ui/src/css/tokens.css` | Tailwind config extending root preset with core-components paths |
| `packages/core-components/postcss.config.js` | CREATE | — | PostCSS config with Tailwind plugin |
| `packages/core-components/.eslintrc.js` | UPDATE | `packages/core-components/.eslintrc.js` | Remove `no-top-level-material-ui-4-imports` rule, add rule preventing MUI imports |
| `packages/core-components/src/lib/utils.ts` | CREATE | `packages/ui/src/hooks/useStyles.ts` | Create `cn()` helper using `clsx` + `tailwind-merge` following shadcn convention |
| `packages/core-components/src/styles/globals.css` | CREATE | `packages/ui/src/css/tokens.css` | Define shadcn CSS custom properties (--background, --foreground, --primary, etc.) mapped from BUI tokens for light and dark modes |
| `packages/core-components/src/styles/tailwind.css` | CREATE | — | `@tailwind base; @tailwind components; @tailwind utilities;` plus token imports |
| `packages/core-components/src/components/ui/accordion.tsx` | CREATE | `packages/core-components/src/components/ErrorPanel/ErrorPanel.tsx` | Radix Accordion primitive styled with Tailwind, following existing Accordion usage patterns |
| `packages/core-components/src/components/ui/alert.tsx` | CREATE | `packages/core-components/src/components/AlertDisplay/AlertDisplay.tsx` | shadcn Alert with destructive/default/warning variants |
| `packages/core-components/src/components/ui/avatar.tsx` | CREATE | `packages/core-components/src/components/Avatar/Avatar.tsx` | Radix Avatar with image + fallback composition |
| `packages/core-components/src/components/ui/badge.tsx` | CREATE | `packages/core-components/src/components/Chip/Chip.tsx` | shadcn Badge replacing MUI Chip, with variant support |
| `packages/core-components/src/components/ui/breadcrumb.tsx` | CREATE | `packages/core-components/src/layout/Breadcrumbs/Breadcrumbs.tsx` | Composable Breadcrumb/BreadcrumbItem/BreadcrumbLink/BreadcrumbSeparator |
| `packages/core-components/src/components/ui/button.tsx` | CREATE | `packages/core-components/src/components/CreateButton/CreateButton.tsx` | shadcn Button with 6 variants (default/destructive/outline/secondary/ghost/link) and 4 sizes |
| `packages/core-components/src/components/ui/card.tsx` | CREATE | `packages/core-components/src/layout/InfoCard/InfoCard.tsx` | Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter composition |
| `packages/core-components/src/components/ui/checkbox.tsx` | CREATE | — | Radix Checkbox with indicator animation |
| `packages/core-components/src/components/ui/command.tsx` | CREATE | — | cmdk-based command palette for global search |
| `packages/core-components/src/components/ui/data-table.tsx` | CREATE | `packages/core-components/src/components/Table/Table.tsx` | @tanstack/react-table v8 integration with shadcn Table for sorting, filtering, pagination |
| `packages/core-components/src/components/ui/dialog.tsx` | CREATE | `packages/core-components/src/components/Dialog/Dialog.tsx` | Radix Dialog with overlay, portal, and composition slots |
| `packages/core-components/src/components/ui/dropdown-menu.tsx` | CREATE | `packages/core-components/src/layout/HeaderActionMenu/HeaderActionMenu.tsx` | Radix DropdownMenu with keyboard navigation and sub-menus |
| `packages/core-components/src/components/ui/input.tsx` | CREATE | `packages/core-components/src/components/Select/Select.tsx` | Tailwind-styled input field |
| `packages/core-components/src/components/ui/label.tsx` | CREATE | — | Radix Label primitive |
| `packages/core-components/src/components/ui/navigation-menu.tsx` | CREATE | `packages/core-components/src/layout/Sidebar/Bar.tsx` | Radix NavigationMenu for sidebar navigation |
| `packages/core-components/src/components/ui/popover.tsx` | CREATE | `packages/core-components/src/components/SupportButton/SupportButton.tsx` | Radix Popover with collision detection and portal |
| `packages/core-components/src/components/ui/progress.tsx` | CREATE | `packages/core-components/src/components/Progress/Progress.tsx` | Radix Progress bar with accessible value reporting |
| `packages/core-components/src/components/ui/scroll-area.tsx` | CREATE | `packages/core-components/src/components/LogViewer/LogViewer.tsx` | Radix ScrollArea for virtualized content regions |
| `packages/core-components/src/components/ui/select.tsx` | CREATE | `packages/core-components/src/components/Select/Select.tsx` | Radix Select with search, portal, and keyboard navigation |
| `packages/core-components/src/components/ui/separator.tsx` | CREATE | — | Radix Separator horizontal/vertical |
| `packages/core-components/src/components/ui/sheet.tsx` | CREATE | `packages/core-components/src/components/Drawer/Drawer.tsx` | Radix Dialog-based Sheet for side panel/drawer |
| `packages/core-components/src/components/ui/skeleton.tsx` | CREATE | — | Skeleton loader with pulse animation |
| `packages/core-components/src/components/ui/switch.tsx` | CREATE | — | Radix Switch toggle |
| `packages/core-components/src/components/ui/table.tsx` | CREATE | `packages/core-components/src/components/StructuredMetadataTable/StructuredMetadataTable.tsx` | Table/TableHeader/TableBody/TableRow/TableHead/TableCell |
| `packages/core-components/src/components/ui/tabs.tsx` | CREATE | `packages/core-components/src/components/TabbedLayout/TabbedLayout.tsx` | Radix Tabs with list, trigger, content |
| `packages/core-components/src/components/ui/textarea.tsx` | CREATE | — | Tailwind-styled textarea |
| `packages/core-components/src/components/ui/toast.tsx` | CREATE | `packages/core-components/src/components/AlertDisplay/AlertDisplay.tsx` | Sonner toast notification integration |
| `packages/core-components/src/components/ui/tooltip.tsx` | CREATE | `packages/core-components/src/components/OverflowTooltip/OverflowTooltip.tsx` | Radix Tooltip with arrow and delay |
| `packages/core-components/src/components/ui/visually-hidden.tsx` | CREATE | — | Accessible visually hidden utility |

**packages/core-components — Existing Component Updates:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/core-components/src/components/AlertDisplay/*.tsx` | UPDATE | `packages/core-components/src/components/AlertDisplay/*.tsx` | Replace MUI `Snackbar`/`SnackbarContent`/`IconButton` with Sonner toast; replace `makeStyles` with Tailwind |
| `packages/core-components/src/components/AutoLogout/*.tsx` | UPDATE | `packages/core-components/src/components/AutoLogout/*.tsx` | Replace MUI `Dialog`/`DialogTitle`/`DialogContent`/`DialogActions`/`Button` with shadcn equivalents |
| `packages/core-components/src/components/Avatar/*.tsx` | UPDATE | `packages/core-components/src/components/Avatar/*.tsx` | Replace MUI `Avatar` with shadcn `Avatar`; replace `makeStyles` with Tailwind |
| `packages/core-components/src/components/Chip/*.tsx` | UPDATE | `packages/core-components/src/components/Chip/*.tsx` | Replace MUI `Chip` with shadcn `Badge` |
| `packages/core-components/src/components/CodeSnippet/*.tsx` | UPDATE | `packages/core-components/src/components/CodeSnippet/*.tsx` | Replace `makeStyles` with Tailwind; retain `react-syntax-highlighter` |
| `packages/core-components/src/components/CopyTextButton/*.tsx` | UPDATE | `packages/core-components/src/components/CopyTextButton/*.tsx` | Replace MUI `IconButton`/`Tooltip` with shadcn `Button` (ghost/icon) + `Tooltip` |
| `packages/core-components/src/components/CreateButton/*.tsx` | UPDATE | `packages/core-components/src/components/CreateButton/*.tsx` | Replace MUI `Button` with shadcn `Button` |
| `packages/core-components/src/components/DependencyGraph/*.tsx` | UPDATE | `packages/core-components/src/components/DependencyGraph/*.tsx` | Replace `makeStyles` with Tailwind classes; retain `dagre`/`d3-selection` |
| `packages/core-components/src/components/Dialog/*.tsx` | UPDATE | `packages/core-components/src/components/Dialog/*.tsx` | Replace MUI `Dialog`/`DialogTitle`/`DialogContent`/`DialogActions` with shadcn `Dialog` |
| `packages/core-components/src/components/DismissableBanner/*.tsx` | UPDATE | `packages/core-components/src/components/DismissableBanner/*.tsx` | Replace MUI `Snackbar`/`SnackbarContent` with shadcn `Alert` + dismiss logic |
| `packages/core-components/src/components/Drawer/*.tsx` | UPDATE | `packages/core-components/src/components/Drawer/*.tsx` | Replace MUI `Drawer` with shadcn `Sheet` |
| `packages/core-components/src/components/EmptyState/*.tsx` | UPDATE | `packages/core-components/src/components/EmptyState/*.tsx` | Replace MUI `Grid`/`Typography`/`Button` with Tailwind grid + shadcn components |
| `packages/core-components/src/components/ErrorPanel/*.tsx` | UPDATE | `packages/core-components/src/components/ErrorPanel/*.tsx` | Replace MUI `Accordion`/`AccordionSummary`/`AccordionDetails` with shadcn `Accordion` |
| `packages/core-components/src/components/FavoriteToggle/*.tsx` | UPDATE | `packages/core-components/src/components/FavoriteToggle/*.tsx` | Replace MUI `IconButton` with shadcn `Button` (variant="ghost", size="icon") |
| `packages/core-components/src/components/FeatureDiscovery/*.tsx` | UPDATE | `packages/core-components/src/components/FeatureDiscovery/*.tsx` | Replace `makeStyles` with Tailwind classes |
| `packages/core-components/src/components/HeaderIconLinkRow/*.tsx` | UPDATE | `packages/core-components/src/components/HeaderIconLinkRow/*.tsx` | Replace MUI `Typography`/`Link`/`makeStyles` with Tailwind |
| `packages/core-components/src/components/HorizontalScrollGrid/*.tsx` | UPDATE | `packages/core-components/src/components/HorizontalScrollGrid/*.tsx` | Replace `makeStyles` with Tailwind; retain scroll logic |
| `packages/core-components/src/components/Lifecycle/*.tsx` | UPDATE | `packages/core-components/src/components/Lifecycle/*.tsx` | Replace MUI `Chip`/`makeStyles` with shadcn `Badge` |
| `packages/core-components/src/components/Link/*.tsx` | UPDATE | `packages/core-components/src/components/Link/*.tsx` | Replace MUI `Link` with Tailwind-styled anchor preserving analytics and security |
| `packages/core-components/src/components/LinkButton/*.tsx` | UPDATE | `packages/core-components/src/components/LinkButton/*.tsx` | Replace MUI `Button` with shadcn `Button` as link |
| `packages/core-components/src/components/LogViewer/*.tsx` | UPDATE | `packages/core-components/src/components/LogViewer/*.tsx` | Replace MUI controls (`IconButton`, `Tooltip`, `makeStyles`) with shadcn equivalents; retain `react-window` virtualization |
| `packages/core-components/src/components/MarkdownContent/*.tsx` | UPDATE | `packages/core-components/src/components/MarkdownContent/*.tsx` | Replace `makeStyles` with Tailwind `prose` classes |
| `packages/core-components/src/components/OAuthRequestDialog/*.tsx` | UPDATE | `packages/core-components/src/components/OAuthRequestDialog/*.tsx` | Replace MUI `Dialog`/`List`/`ListItem` with shadcn `Dialog` + Tailwind list |
| `packages/core-components/src/components/OverflowTooltip/*.tsx` | UPDATE | `packages/core-components/src/components/OverflowTooltip/*.tsx` | Replace MUI `Tooltip` with shadcn `Tooltip` |
| `packages/core-components/src/components/Progress/*.tsx` | UPDATE | `packages/core-components/src/components/Progress/*.tsx` | Replace MUI `LinearProgress` with shadcn `Progress` |
| `packages/core-components/src/components/ProgressBars/*.tsx` | UPDATE | `packages/core-components/src/components/ProgressBars/*.tsx` | Replace `makeStyles` with Tailwind; retain `rc-progress` |
| `packages/core-components/src/components/ResponseErrorPanel/*.tsx` | UPDATE | `packages/core-components/src/components/ResponseErrorPanel/*.tsx` | Replace MUI components with shadcn equivalents |
| `packages/core-components/src/components/Select/*.tsx` | UPDATE | `packages/core-components/src/components/Select/*.tsx` | Replace MUI `Select`/`MenuItem`/`FormControl` with shadcn `Select` |
| `packages/core-components/src/components/SimpleStepper/*.tsx` | UPDATE | `packages/core-components/src/components/SimpleStepper/*.tsx` | Replace MUI `Stepper`/`Step`/`StepLabel`/`StepContent` with custom shadcn stepper |
| `packages/core-components/src/components/Status/*.tsx` | UPDATE | `packages/core-components/src/components/Status/*.tsx` | Replace `makeStyles` with Tailwind; add color-blind-friendly shape indicators |
| `packages/core-components/src/components/StructuredMetadataTable/*.tsx` | UPDATE | `packages/core-components/src/components/StructuredMetadataTable/*.tsx` | Replace MUI `Table`/`TableBody`/`TableRow`/`TableCell` with shadcn `Table` |
| `packages/core-components/src/components/SupportButton/*.tsx` | UPDATE | `packages/core-components/src/components/SupportButton/*.tsx` | Replace MUI `Popover`/`ListItem` with shadcn `Popover` |
| `packages/core-components/src/components/TabbedLayout/*.tsx` | UPDATE | `packages/core-components/src/components/TabbedLayout/*.tsx` | Replace MUI `Tabs`/`Tab` with shadcn `Tabs` |
| `packages/core-components/src/components/Table/*.tsx` | UPDATE | `packages/core-components/src/components/Table/*.tsx` | Replace `@material-table/core` with `@tanstack/react-table` + shadcn `DataTable` |
| `packages/core-components/src/components/TrendLine/*.tsx` | UPDATE | `packages/core-components/src/components/TrendLine/*.tsx` | Replace `makeStyles` with Tailwind; retain `react-sparklines` |
| `packages/core-components/src/components/WarningPanel/*.tsx` | UPDATE | `packages/core-components/src/components/WarningPanel/*.tsx` | Replace MUI `Accordion` with shadcn `Accordion` |
| `packages/core-components/src/components/index.ts` | UPDATE | `packages/core-components/src/components/index.ts` | Add re-exports for `ui/` primitives |
| `packages/core-components/src/overridableComponents.ts` | UPDATE | `packages/core-components/src/overridableComponents.ts` | Replace MUI `Overrides`/`StyleRules` types with CSS custom property override interface |

**packages/core-components — Layout Updates:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/core-components/src/layout/BottomLink/*.tsx` | UPDATE | `packages/core-components/src/layout/BottomLink/*.tsx` | Replace MUI `Card`/`Button`/`makeStyles` with shadcn `Card`/`Button` |
| `packages/core-components/src/layout/Breadcrumbs/*.tsx` | UPDATE | `packages/core-components/src/layout/Breadcrumbs/*.tsx` | Replace MUI `Breadcrumbs`/`Typography`/`Link` with shadcn `Breadcrumb` |
| `packages/core-components/src/layout/Content/*.tsx` | UPDATE | `packages/core-components/src/layout/Content/*.tsx` | Replace `makeStyles` with Tailwind |
| `packages/core-components/src/layout/ContentHeader/*.tsx` | UPDATE | `packages/core-components/src/layout/ContentHeader/*.tsx` | Replace MUI `Grid`/`Typography`/`makeStyles` with Tailwind flex layout |
| `packages/core-components/src/layout/ErrorBoundary/*.tsx` | UPDATE | `packages/core-components/src/layout/ErrorBoundary/*.tsx` | Replace MUI components with shadcn `Alert`/`Button` |
| `packages/core-components/src/layout/ErrorPage/*.tsx` | UPDATE | `packages/core-components/src/layout/ErrorPage/*.tsx` | Replace MUI `Grid`/`Typography`/`Button` with Tailwind + shadcn `Button` |
| `packages/core-components/src/layout/Header/*.tsx` | UPDATE | `packages/core-components/src/layout/Header/*.tsx` | Replace MUI `makeStyles`/`Typography`/`Tooltip` with Tailwind + shadcn |
| `packages/core-components/src/layout/HeaderActionMenu/*.tsx` | UPDATE | `packages/core-components/src/layout/HeaderActionMenu/*.tsx` | Replace MUI `IconButton`/`MenuList`/`MenuItem`/`Popover` with shadcn `DropdownMenu` |
| `packages/core-components/src/layout/HeaderLabel/*.tsx` | UPDATE | `packages/core-components/src/layout/HeaderLabel/*.tsx` | Replace MUI `Typography`/`makeStyles` with Tailwind |
| `packages/core-components/src/layout/HeaderTabs/*.tsx` | UPDATE | `packages/core-components/src/layout/HeaderTabs/*.tsx` | Replace MUI `Tabs`/`Tab`/`makeStyles` with shadcn `Tabs` |
| `packages/core-components/src/layout/InfoCard/*.tsx` | UPDATE | `packages/core-components/src/layout/InfoCard/*.tsx` | Replace MUI `Card`/`CardHeader`/`CardContent`/`CardActions`/`Divider`/`IconButton` with shadcn `Card` + `Separator` |
| `packages/core-components/src/layout/ItemCard/*.tsx` | UPDATE | `packages/core-components/src/layout/ItemCard/*.tsx` | Replace MUI `Card`/`Grid`/`Box`/`makeStyles` with shadcn `Card` + Tailwind grid |
| `packages/core-components/src/layout/Page/*.tsx` | UPDATE | `packages/core-components/src/layout/Page/*.tsx` | Replace MUI `ThemeProvider`/`makeStyles` with CSS custom property page themes |
| `packages/core-components/src/layout/ProxiedSignInPage/*.tsx` | UPDATE | `packages/core-components/src/layout/ProxiedSignInPage/*.tsx` | Replace MUI `Grid`/`Typography`/`LinearProgress` with Tailwind + shadcn `Progress` |
| `packages/core-components/src/layout/Sidebar/*.tsx` | UPDATE | `packages/core-components/src/layout/Sidebar/*.tsx` | Replace MUI `Drawer`/`makeStyles`/`BottomNavigation`/`IconButton` with shadcn `Sheet` + Tailwind sidebar; replace `@material-ui/icons` with `lucide-react` |
| `packages/core-components/src/layout/SignInPage/*.tsx` | UPDATE | `packages/core-components/src/layout/SignInPage/*.tsx` | Replace MUI `Grid`/`Card`/`Button`/`Typography`/`TextField` with shadcn components |
| `packages/core-components/src/layout/TabbedCard/*.tsx` | UPDATE | `packages/core-components/src/layout/TabbedCard/*.tsx` | Replace MUI `Card`/`Tabs`/`Tab`/`makeStyles` with shadcn `Card` + `Tabs` |
| `packages/core-components/src/layout/index.ts` | UPDATE | `packages/core-components/src/layout/index.ts` | Verify barrel exports |

**packages/theme:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/theme/package.json` | UPDATE | `packages/theme/package.json` | Add `tailwindcss` as dependency; retain `@mui/material` for backward compat |
| `packages/theme/src/index.ts` | UPDATE | `packages/theme/src/index.ts` | Export new `./tokens` module |
| `packages/theme/src/base/palette.ts` | UPDATE | `packages/theme/src/base/palette.ts` | Add CSS custom property token generation function alongside existing palette |
| `packages/theme/src/base/typography.ts` | UPDATE | `packages/theme/src/base/typography.ts` | Add CSS custom property typography tokens |
| `packages/theme/src/unified/UnifiedThemeProvider.tsx` | UPDATE | `packages/theme/src/unified/UnifiedThemeProvider.tsx` | Inject CSS custom properties via `useApplyThemeAttributes` alongside MUI theme contexts |
| `packages/theme/src/unified/theme.ts` | UPDATE | `packages/theme/src/unified/theme.ts` | Add shadcn token generation helpers |
| `packages/theme/src/tokens/shadcn-tokens.css` | CREATE | `packages/ui/src/css/tokens.css` | Define shadcn/ui CSS variables for light and dark modes aligned with BUI tokens |

**packages/app:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/app/package.json` | UPDATE | `packages/app/package.json` | Add `tailwindcss`, `radix-ui`, `lucide-react`; remove direct `@material-ui/core`, `@material-ui/icons` |
| `packages/app/tailwind.config.ts` | CREATE | `packages/core-components/tailwind.config.ts` | App-level Tailwind config extending core-components preset |
| `packages/app/src/index.tsx` | UPDATE | `packages/app/src/index.tsx` | Import global shadcn styles CSS |
| `packages/app/src/App.tsx` | UPDATE | `packages/app/src/App.tsx` | Verify shadcn theme provider integration |
| `packages/app/src/HomePage.tsx` | UPDATE | `packages/app/src/HomePage.tsx` | Replace MUI homepage components with shadcn equivalents |
| `packages/app/src/modules/appModuleNav.tsx` | UPDATE | `packages/app/src/modules/appModuleNav.tsx` | Replace `makeStyles` with Tailwind; replace `@material-ui/icons` with `lucide-react` |
| `packages/app/src/examples/notFoundErrorPageExtension.tsx` | UPDATE | `packages/app/src/examples/notFoundErrorPageExtension.tsx` | Replace MUI `Box`/`Typography`/`Button` with Tailwind + shadcn |

**packages/app-defaults:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `packages/app-defaults/package.json` | UPDATE | `packages/app-defaults/package.json` | Remove `@material-ui/core`, `@material-ui/icons` |
| `packages/app-defaults/src/*.ts` | UPDATE | `packages/app-defaults/src/*.ts` | Remove MUI imports, ensure shadcn theme integration |

**plugins/catalog:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/catalog/package.json` | UPDATE | `plugins/catalog/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`, `@mui/utils` |
| `plugins/catalog/src/overridableComponents.ts` | UPDATE | `plugins/catalog/src/overridableComponents.ts` | Replace MUI `Overrides`/`StyleRules` with CSS custom property override types |
| `plugins/catalog/src/components/**/*.tsx` | UPDATE | `plugins/catalog/src/components/**/*.tsx` | Replace all MUI imports with shadcn/Tailwind across ~38 files |
| `plugins/catalog/src/alpha/**/*.tsx` | UPDATE | `plugins/catalog/src/alpha/**/*.tsx` | Replace MUI in alpha components |

**plugins/catalog-react:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/catalog-react/package.json` | UPDATE | `plugins/catalog-react/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`, `material-ui-popup-state` |
| `plugins/catalog-react/src/components/**/*.tsx` | UPDATE | `plugins/catalog-react/src/components/**/*.tsx` | Replace MUI components across ~33 files; replace `material-ui-popup-state` with Radix Popover state |

**plugins/scaffolder:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/scaffolder/package.json` | UPDATE | `plugins/scaffolder/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`; replace `@rjsf/material-ui` with `@rjsf/core` |
| `plugins/scaffolder/src/overridableComponents.ts` | UPDATE | `plugins/scaffolder/src/overridableComponents.ts` | Replace MUI override types with CSS custom property types |
| `plugins/scaffolder/src/components/**/*.tsx` | UPDATE | `plugins/scaffolder/src/components/**/*.tsx` | Replace MUI form fields, Stepper, Dialog across ~63 files |
| `plugins/scaffolder/src/alpha/**/*.tsx` | UPDATE | `plugins/scaffolder/src/alpha/**/*.tsx` | Replace MUI in alpha components |

**plugins/scaffolder-react:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/scaffolder-react/package.json` | UPDATE | `plugins/scaffolder-react/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`, `@rjsf/material-ui` |
| `plugins/scaffolder-react/src/**/*.tsx` | UPDATE | `plugins/scaffolder-react/src/**/*.tsx` | Replace MUI Stepper, form components, review step across ~28 files |

**plugins/techdocs:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/techdocs/package.json` | UPDATE | `plugins/techdocs/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`, `@material-ui/styles` |
| `plugins/techdocs/src/home/**/*.tsx` | UPDATE | `plugins/techdocs/src/home/**/*.tsx` | Replace MUI Table/Card with shadcn DataTable/Card |
| `plugins/techdocs/src/reader/**/*.tsx` | UPDATE | `plugins/techdocs/src/reader/**/*.tsx` | Replace MUI makeStyles with Tailwind prose; replace MUI controls with shadcn |
| `plugins/techdocs/src/search/**/*.tsx` | UPDATE | `plugins/techdocs/src/search/**/*.tsx` | Replace MUI search components with shadcn |

**plugins/techdocs-react:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/techdocs-react/package.json` | UPDATE | `plugins/techdocs-react/package.json` | Remove `@material-ui/core` |
| `plugins/techdocs-react/src/**/*.tsx` | UPDATE | `plugins/techdocs-react/src/**/*.tsx` | Replace minimal MUI usage (~2 files) |

**plugins/search:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/search/package.json` | UPDATE | `plugins/search/package.json` | Remove `@material-ui/core`, `@material-ui/icons` |
| `plugins/search/src/components/**/*.tsx` | UPDATE | `plugins/search/src/components/**/*.tsx` | Replace MUI components with shadcn Command + search across ~10 files |

**plugins/search-react:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/search-react/package.json` | UPDATE | `plugins/search-react/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab` |
| `plugins/search-react/src/components/**/*.tsx` | UPDATE | `plugins/search-react/src/components/**/*.tsx` | Replace MUI search components with shadcn across ~27 files |

**plugins/user-settings:**

| Target File | Transformation | Source File | Key Changes |
|------------|---------------|-------------|-------------|
| `plugins/user-settings/package.json` | UPDATE | `plugins/user-settings/package.json` | Remove `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab` |
| `plugins/user-settings/src/components/**/*.tsx` | UPDATE | `plugins/user-settings/src/components/**/*.tsx` | Replace MUI settings components with shadcn Card/Select/Switch across ~21 files |

### 0.6.2 Cross-File Dependencies

Import statement transformations apply across all updated files. The following rules govern all import changes:

**MUI Core Component Imports:**
- FROM: `import { Button, Dialog, ... } from '@material-ui/core'`
- TO: `import { Button } from '../ui/button'` + `import { Dialog } from '../ui/dialog'`
- APPLIES TO: All files matching `packages/core-components/src/**/*.tsx`, `plugins/*/src/**/*.tsx`

**MUI Styling Imports:**
- FROM: `import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles'`
- TO: `import { cn } from '../../lib/utils'` (use Tailwind utility classes inline)
- APPLIES TO: All files currently using `makeStyles` (~121 files in core-components, ~140+ across plugins)

**MUI Icon Imports:**
- FROM: `import SomeIcon from '@material-ui/icons/SomeIcon'`
- TO: `import { SomeIcon } from 'lucide-react'`
- APPLIES TO: All files importing from `@material-ui/icons` (104 unique icons across all packages)

**MUI Lab Imports:**
- FROM: `import { Autocomplete, Alert, ... } from '@material-ui/lab'`
- TO: `import { Command } from '../ui/command'` + `import { Alert } from '../ui/alert'`
- APPLIES TO: All files importing from `@material-ui/lab`

**Material Table Imports:**
- FROM: `import MaterialTable from '@material-table/core'`
- TO: `import { DataTable } from '../ui/data-table'` + `import { useReactTable } from '@tanstack/react-table'`
- APPLIES TO: `packages/core-components/src/components/Table/`, `plugins/catalog/src/components/CatalogTable/`

**RJSF Material UI Imports:**
- FROM: `import MaterialUITheme from '@rjsf/material-ui'`
- TO: `import { default as CoreTheme } from '@rjsf/core'` (with custom shadcn widget set)
- APPLIES TO: `plugins/scaffolder/src/**/*.tsx`, `plugins/scaffolder-react/src/**/*.tsx`

**Popup State Imports:**
- FROM: `import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'`
- TO: Remove (use Radix Popover/DropdownMenu built-in state management)
- APPLIES TO: `plugins/catalog-react/src/**/*.tsx`

**Configuration Updates:**
- `tsconfig.json` — Verify path aliases for new `ui/` directory
- `packages/*/package.json` — All `@material-ui/*` peer dependencies removed from in-scope packages
- `packages/core-components/src/index.ts` — Add barrel exports for `ui/*` primitives
- `packages/core-components/src/layout/index.ts` — Verify layout component exports

### 0.6.3 Wildcard Pattern Summary

All wildcard patterns are trailing and scoped to specific packages:

- `packages/core-components/src/components/**/*.tsx` — UPDATE: all 37 component directories
- `packages/core-components/src/layout/**/*.tsx` — UPDATE: all 18 layout directories
- `plugins/catalog/src/components/**/*.tsx` — UPDATE: ~38 MUI files
- `plugins/catalog/src/alpha/**/*.tsx` — UPDATE: alpha components
- `plugins/catalog-react/src/components/**/*.tsx` — UPDATE: ~33 MUI files
- `plugins/scaffolder/src/components/**/*.tsx` — UPDATE: ~63 MUI files
- `plugins/scaffolder/src/alpha/**/*.tsx` — UPDATE: alpha components
- `plugins/scaffolder-react/src/**/*.tsx` — UPDATE: ~28 MUI files
- `plugins/techdocs/src/**/*.tsx` — UPDATE: ~28 MUI files
- `plugins/search/src/components/**/*.tsx` — UPDATE: ~10 MUI files
- `plugins/search-react/src/components/**/*.tsx` — UPDATE: ~27 MUI files
- `plugins/user-settings/src/components/**/*.tsx` — UPDATE: ~21 MUI files
- `plugins/*/package.json` — UPDATE: remove MUI dependencies (all in-scope plugins)

### 0.6.4 One-Phase Execution

The entire refactor is executed by Blitzy in a single phase. All shadcn/ui primitive creation, all MUI component replacements, all import transformations, all configuration updates, and all test corrections are delivered simultaneously. There is no phased migration — the target state is achieved in one atomic transformation.


## 0.7 Dependency Inventory

### 0.7.1 Key Private and Public Packages

**New Dependencies (To Be Added):**

| Registry | Package | Version | Purpose |
|----------|---------|---------|---------|
| npm | `radix-ui` | ^1.4.3 | Unified Radix UI primitives package — provides accessible, unstyled component primitives (Dialog, Select, Popover, Tabs, Accordion, etc.) that shadcn/ui components wrap |
| npm | `tailwindcss` | ^4.2.0 | Utility-first CSS framework — replaces all MUI `makeStyles`/`withStyles` CSS-in-JS with zero-runtime Tailwind utility classes |
| npm | `@tailwindcss/postcss` | ^4.2.0 | PostCSS plugin for Tailwind CSS v4 — required since v4 separated the PostCSS plugin from the main package |
| npm | `@tailwindcss/vite` | ^4.2.0 | First-party Vite plugin for Tailwind CSS — tight integration with Backstage's Vite ^7.1.5 build pipeline |
| npm | `lucide-react` | ^0.575.0 | Tree-shakeable icon library — replaces all 104 `@material-ui/icons` imports with consistent, lightweight SVG icons |
| npm | `cmdk` | ^1.1.1 | Command palette React component — powers the global search `Command` dialog (⌘K pattern) replacing `SidebarSearchModal` |
| npm | `sonner` | ^2.0.7 | Opinionated toast notification component — replaces MUI `Snackbar`/`SnackbarContent` in `AlertDisplay` with animated, stackable toasts |
| npm | `clsx` | ^2.1.1 | Tiny utility for constructing `className` strings conditionally — used by `cn()` helper |
| npm | `tailwind-merge` | ^3.0.2 | Tailwind CSS class merging utility — prevents style conflicts when composing Tailwind classes in `cn()` helper |
| npm | `@tanstack/react-table` | ^8.21.3 | Headless table state management — replaces `@material-table/core` for sorting, filtering, pagination, selection (already used by `packages/ui`) |
| npm | `@rjsf/core` | ^5.24.13 | JSON Schema form renderer (headless core) — replaces `@rjsf/material-ui` in scaffolder, providing widget-agnostic form generation |

**Retained Dependencies (No Change):**

| Registry | Package | Version | Purpose |
|----------|---------|---------|---------|
| npm | `react` | ^18.0.2 | Core React library |
| npm | `react-dom` | ^18.0.2 | React DOM renderer |
| npm | `react-router-dom` | ^6.3.0 | Client-side routing |
| npm | `@emotion/react` | ^11.14.0 | Retained for `packages/theme` backward compatibility with MUI plugins |
| npm | `@emotion/styled` | ^11.14.0 | Retained for `packages/theme` backward compatibility |
| npm | `@mui/material` | ^5.12.2 | Retained in `packages/theme` only for backward MUI v5 compatibility layer |
| npm | `dagre` | ^0.8.5 | Graph layout engine for `DependencyGraph` component |
| npm | `d3-selection` | ^3.0.0 | DOM manipulation for `DependencyGraph` |
| npm | `d3-zoom` | ^3.0.0 | Zoom behavior for `DependencyGraph` |
| npm | `rc-progress` | ^3.0.0 | Circular/linear gauge indicators in `ProgressBars` |
| npm | `react-sparklines` | ^1.7.0 | Inline trend charts in `TrendLine` |
| npm | `react-syntax-highlighter` | ^15.4.5 | Code syntax highlighting in `CodeSnippet` |
| npm | `react-window` | ^1.8.8 | Windowed list rendering in `LogViewer` |
| npm | `react-use` | ^17.2.4 | React hook utilities |
| npm | `react-helmet` | ^6.1.0 | Document head management in `Header` |

**Dependencies Being Removed (From In-Scope Packages):**

| Registry | Package | Current Version | Removed From |
|----------|---------|----------------|--------------|
| npm | `@material-ui/core` | ^4.12.2 | `packages/core-components`, `packages/app`, `packages/app-defaults`, all in-scope plugins |
| npm | `@material-ui/icons` | ^4.9.1 | `packages/core-components`, `packages/app`, `packages/app-defaults`, all in-scope plugins |
| npm | `@material-ui/lab` | 4.0.0-alpha.61 | `packages/core-components`, `plugins/catalog`, `plugins/scaffolder`, `plugins/search-react`, `plugins/user-settings`, `plugins/catalog-react` |
| npm | `@material-ui/styles` | ^4.11.5 | `plugins/techdocs` |
| npm | `@material-table/core` | ^0.2.41 | `packages/core-components` |
| npm | `@rjsf/material-ui` | 5.24.13 | `plugins/scaffolder`, `plugins/scaffolder-react` |
| npm | `material-ui-popup-state` | ^5.0.0 | `plugins/catalog-react` |

### 0.7.2 Import Refactoring

**Files Requiring Import Updates (Wildcard Patterns):**

- `packages/core-components/src/**/*.tsx` — Update all internal MUI imports to shadcn/Tailwind (~121 files)
- `packages/core-components/src/**/*.ts` — Update type imports referencing MUI types
- `plugins/catalog/src/**/*.tsx` — Update ~38 MUI files
- `plugins/catalog-react/src/**/*.tsx` — Update ~33 MUI files
- `plugins/scaffolder/src/**/*.tsx` — Update ~63 MUI files
- `plugins/scaffolder-react/src/**/*.tsx` — Update ~28 MUI files
- `plugins/techdocs/src/**/*.tsx` — Update ~28 MUI files
- `plugins/techdocs-react/src/**/*.tsx` — Update ~2 MUI files
- `plugins/search/src/**/*.tsx` — Update ~10 MUI files
- `plugins/search-react/src/**/*.tsx` — Update ~27 MUI files
- `plugins/user-settings/src/**/*.tsx` — Update ~21 MUI files
- `packages/app/src/**/*.tsx` — Update app-level MUI imports
- `packages/app-defaults/src/**/*.ts` — Update defaults MUI imports

**Import Transformation Rules:**

MUI Component → shadcn/ui:
- Old: `import { Button, Typography, Grid } from '@material-ui/core'`
- New: `import { Button } from '../components/ui/button'` (Typography → Tailwind classes, Grid → Tailwind grid)
- Apply to: All files matching `packages/core-components/src/**/*.tsx`

MUI Styling → Tailwind:
- Old: `import { makeStyles, createStyles } from '@material-ui/core/styles'`
- New: `import { cn } from '../../lib/utils'` (inline Tailwind utility classes)
- Apply to: All files using `makeStyles` (~384 files across all packages)

MUI Icons → Lucide:
- Old: `import HomeIcon from '@material-ui/icons/Home'`
- New: `import { Home } from 'lucide-react'`
- Apply to: All files importing from `@material-ui/icons` (~104 unique icons)

Material Table → TanStack:
- Old: `import MaterialTable from '@material-table/core'`
- New: `import { useReactTable, getCoreRowModel } from '@tanstack/react-table'`
- Apply to: `packages/core-components/src/components/Table/`, `plugins/catalog/src/components/CatalogTable/`

RJSF Material → RJSF Core:
- Old: `import MaterialUITheme from '@rjsf/material-ui'`
- New: `import Form from '@rjsf/core'` (with custom shadcn widget set)
- Apply to: `plugins/scaffolder/src/**/*.tsx`, `plugins/scaffolder-react/src/**/*.tsx`

### 0.7.3 External Reference Updates

- **Configuration files:** All `packages/*/package.json` — remove MUI dependencies, add shadcn/ui dependencies
- **Build configuration:** `packages/core-components/.eslintrc.js` — replace MUI import restriction rules
- **Storybook configuration:** `.storybook/main.ts` — add Tailwind/PostCSS Vite plugin support
- **TypeScript configuration:** `packages/*/tsconfig.json` — verify path resolution for new `ui/` directory
- **CI/CD:** `.github/workflows/mui-migration-tracker.yml` — update or remove MUI tracking workflow
- **API Reports:** `packages/core-components/api-report/`, `packages/theme/api-report/` — regenerate after API surface changes


## 0.8 Refactoring Rules

### 0.8.1 Refactoring-Specific Rules

**Backward Compatibility — Plugin Mounting API:**
- The existing Backstage plugin mounting API must remain unchanged — plugins that render MUI internally must continue to function without any modification
- `createPlugin()`, `createRoutableExtension()`, `createComponentExtension()`, and the entire `@backstage/frontend-plugin-api` surface must not change
- `packages/theme`'s `UnifiedThemeProvider` must continue providing MUI v4 and v5 theme contexts for plugin consumption
- The `overridableComponents` pattern used in `packages/core-components` and plugins must preserve its public contract, even as underlying implementations switch to shadcn/ui

**Visual Coexistence Between MUI and shadcn/ui:**
- Community plugins remain on MUI and are explicitly out of scope
- The application must support simultaneous rendering of shadcn/ui core surfaces alongside MUI plugin surfaces without CSS conflicts
- Tailwind's `@layer` and `preflight` reset must be scoped to prevent bleeding into MUI-rendered plugin content
- Use Tailwind's `@layer base`, `@layer components`, and `@layer utilities` cascade layers to isolate styling
- Test visual coexistence by mounting at least one MUI community plugin alongside redesigned core surfaces

**Responsive Breakpoints:**
- Follow Backstage's existing responsive breakpoint conventions as defined in the theme package
- Do not introduce new breakpoint values — map Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to Backstage's established breakpoint widths

**Public API Preservation:**
- All exported symbols from `packages/core-components/src/index.ts` must remain exported with identical names, prop interfaces, and behavior
- The `coreComponentsTranslationRef` must continue to function for i18n across all refactored components
- `packages/theme`'s exported `createUnifiedTheme()`, `themes`, `palettes`, `pageThemes`, and typography utilities must not change their public interfaces
- Theme override mechanisms via `createUnifiedTheme({ components: { ... } })` must remain functional

**Functional Behavior Preservation:**
- Every refactored component must produce identical functional behavior — same API calls, same navigation, same state management
- Catalog entity resolution, scaffolder template execution, TechDocs rendering, and search query flows must remain unchanged
- Sidebar navigation state (collapsed/expanded) must persist identically
- All existing keyboard navigation and focus management must be preserved or improved via Radix primitives

**Test Continuity:**
- All existing unit tests must continue to pass with minimal adaptation (import path changes only, no logic changes)
- E2e tests in `packages/app/e2e-tests/` must pass with the redesigned UI
- Playwright-based screenshot validation must be added for all redesigned user flows in both light and dark modes as specified by the user

### 0.8.2 Special Instructions and Constraints

**Accessibility Requirements:**
- Both light and dark themes must meet WCAG 2.1 AA contrast requirements for all text and interactive elements
- All interactive elements must have visible focus indicators
- Color-blind-friendly status indicators are required across catalog health and CI/CD displays — avoid relying solely on red/green differentiation; use shape, pattern, or icon supplementation
- Radix UI's built-in accessibility (ARIA attributes, keyboard navigation, screen reader support) must be leveraged for all applicable components

**Theming Architecture — CSS Custom Property Token System:**
- All color, spacing, radius, and typography tokens must be defined as CSS custom properties (`--variable-name`) at the `:root` level
- Tokens must be swappable at the root level to support full light and dark mode switching
- Dark mode activation via `[data-theme-mode='dark']` selector (preserving Backstage's existing data-attribute convention)
- No hardcoded color values, pixel sizes, or font stacks in component code — every value must resolve to a token

**Spacing and Typography Constraints:**
- Apply a consistent spacing scale across all form wizards, data tables, and entity detail pages to reduce visual clutter
- Use a type scale optimized for code-adjacent content: monospace for identifiers and metadata, proportional for prose and navigation
- Preserve Backstage's existing font family system while extending it with Tailwind's typography plugin

**Validation — Programmatic Screenshots:**
- Screenshots of every redesigned user flow must be generated programmatically via Playwright or Puppeteer
- Flows to capture: catalog browsing, entity detail navigation, scaffolder template creation, TechDocs reading, global search, and settings management
- Each flow must be captured in both light and dark modes
- Screenshots must be included as build artifacts to verify component rendering, layout consistency, and theme correctness

**No Phased Migration:**
- The entire refactoring must be executed in a single phase — no partial migration states
- All in-scope packages are transformed atomically

### 0.8.3 Additional User-Provided Rules

- Implement as modifications to the Backstage core packages (not as forks or external wrappers)
- The application shell (sidebar + header chrome) must be replaced with a shadcn/ui-based design featuring a collapsible sidebar and prominently placed global search via the command dialog pattern
- The layout must support dense information display appropriate for entity detail pages with metadata, relations, and plugin tabs
- Audit every core Backstage UI component currently implemented with MUI and map each to its shadcn/ui equivalent — this mapping is documented in sub-section 0.4 Design System Compliance
- For each component mapping, the implementation should improve over MUI in terms of bundle size, composability, and visual clarity


## 0.9 References

### 0.9.1 Codebase Files and Folders Searched

**Root-Level Files Inspected:**
- `package.json` — monorepo root; Yarn 4.8.1 workspaces configuration, Node.js >=22 engine requirement
- `yarn.lock` — dependency lock file confirming exact installed versions
- `.yarnrc.yml` — Yarn Berry configuration with `nodeLinker: node-modules`
- `tsconfig.json` — root TypeScript configuration, ~5.7.0
- `lerna.json` — Lerna monorepo orchestration
- `.github/workflows/mui-migration-tracker.yml` — existing MUI-to-BUI migration tracker

**packages/core-components/ (Explored to Depth 4):**
- `packages/core-components/package.json` — MUI v4 dependencies: `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`, `@material-table/core`
- `packages/core-components/src/index.ts` — barrel export aggregating all 37 components + 18 layouts
- `packages/core-components/src/components/` — 37 component directories (AlertDisplay, AutoLogout, Avatar, Chip, CodeSnippet, CopyTextButton, CreateButton, DependencyGraph, Dialog, DismissableBanner, Drawer, EmptyState, ErrorPanel, FavoriteToggle, FeatureDiscovery, HeaderIconLinkRow, HorizontalScrollGrid, Lifecycle, Link, LinkButton, LogViewer, MarkdownContent, OAuthRequestDialog, OverflowTooltip, Progress, ProgressBars, ResponseErrorPanel, Select, SimpleStepper, Status, StructuredMetadataTable, SupportButton, TabbedLayout, Table, TrendLine, WarningPanel, Dialog)
- `packages/core-components/src/layout/` — 18 layout directories (ErrorPage, Header, ContentHeader, ErrorBoundary, HeaderActionMenu, HeaderLabel, HeaderTabs, InfoCard, ItemCard, Page, ProxiedSignInPage, Sidebar, SignInPage, TabbedCard, BottomLink, Breadcrumbs, Content)
- `packages/core-components/src/overridableComponents.ts` — theme-level component style overrides registry

**packages/ui/ (Explored to Depth 3):**
- `packages/ui/package.json` — MUI-free BUI package; React Aria Components + CSS custom properties
- `packages/ui/src/components/` — 38 BUI components (TagGroup, Card, Checkbox, Text, Container, Dialog, TextField, ButtonLink, Link, ToggleButton, Menu, ToggleButtonGroup, PasswordField, Tooltip, PluginHeader, VisuallyHidden, Popover, RadioGroup, SearchField, Select, Accordion, Skeleton, Switch, Table, Alert, Avatar, Box, Button, ButtonIcon, TablePagination, Tabs, FieldError, HeaderPage, FieldLabel, InternalLinkProvider, Grid, Flex, FullPage)
- `packages/ui/src/hooks/` — useDefinition, useBg, useBreakpoint, useStyles
- `packages/ui/src/styles/` — CSS custom property token definitions (`--bui-*` prefixed)

**packages/theme/ (Explored to Depth 3):**
- `packages/theme/package.json` — @mui/material ^5.12.2, @emotion/react, MUI v4+v5 bridge
- `packages/theme/src/base/` — palettes, typography, pageThemes
- `packages/theme/src/unified/` — UnifiedThemeProvider, overrides, presets, createUnifiedTheme
- `packages/theme/src/v4/` — deprecated MUI v4 theming
- `packages/theme/src/v5/` — modern MUI v5 entry, defaultComponentThemes

**packages/app/ (Explored to Depth 3):**
- `packages/app/package.json` — app shell dependencies
- `packages/app/src/App.tsx` — createApp() from @backstage/frontend-defaults
- `packages/app/src/modules/appModuleNav.tsx` — sidebar navigation using NavContentBlueprint with MUI makeStyles and icons
- `packages/app/src/HomePage.tsx` — CustomHomepageGrid with Page + Header
- `packages/app/e2e-tests/` — Playwright end-to-end tests for landing, homepage, and search

**packages/app-defaults/ (Explored to Depth 2):**
- `packages/app-defaults/package.json` — default app configuration
- `packages/app-defaults/src/` — default theme and plugin registration

**packages/frontend-defaults/ (Explored to Depth 2):**
- `packages/frontend-defaults/package.json` — frontend creation defaults
- `packages/frontend-defaults/src/` — createApp entry point

**plugins/catalog/ (Explored to Depth 3):**
- `plugins/catalog/package.json` — MUI v4 deps: core, icons, lab, @mui/utils
- `plugins/catalog/src/components/` — cards, layouts, tables, search results
- `plugins/catalog/src/overridableComponents.ts`
- `plugins/catalog/src/plugin.ts`, `routes.ts`

**plugins/catalog-react/ (Explored to Depth 2):**
- `plugins/catalog-react/package.json` — MUI core + icons + lab + material-ui-popup-state
- `plugins/catalog-react/src/` — shared catalog React hooks and components

**plugins/scaffolder/ (Explored to Depth 3):**
- `plugins/scaffolder/package.json` — MUI core + icons + lab + @rjsf/material-ui
- `plugins/scaffolder/src/components/` — Router, fields, TemplatingExtensionsPage
- `plugins/scaffolder/src/translation.ts`

**plugins/scaffolder-react/ (Explored to Depth 2):**
- `plugins/scaffolder-react/package.json` — MUI core + icons + lab + @rjsf/material-ui
- `plugins/scaffolder-react/src/` — shared scaffolder React utilities

**plugins/techdocs/ (Explored to Depth 2):**
- `plugins/techdocs/package.json` — MUI core + icons + lab + styles
- `plugins/techdocs/src/` — TechDocs rendering and reader components

**plugins/techdocs-react/ (Explored to Depth 2):**
- `plugins/techdocs-react/package.json` — minimal MUI usage (2 files)

**plugins/search/ (Explored to Depth 2):**
- `plugins/search/package.json` — MUI core + icons
- `plugins/search/src/` — search page and result display

**plugins/search-react/ (Explored to Depth 2):**
- `plugins/search-react/package.json` — MUI core + icons + lab
- `plugins/search-react/src/` — shared search React components

**plugins/user-settings/ (Explored to Depth 2):**
- `plugins/user-settings/package.json` — MUI core + icons + lab
- `plugins/user-settings/src/` — settings page, theme toggle, auth settings

### 0.9.2 Technical Specification Sections Retrieved

- **Section 7.1 — Core UI Technologies:** React 18, TypeScript ~5.7, Vite ^7.1.5, Storybook 10.3.0-alpha.1; confirmed dual component libraries (MUI v4/v5 in core-components, React Aria in BUI)
- **Section 7.2 — UI Component Libraries:** Detailed MUI component inventory, BUI architecture, overridable components pattern
- **Section 7.3 — Theme System:** UnifiedThemeProvider dual-theme bridge, CSS custom property token system, light/dark mode via `data-theme-mode`, WCAG accessibility targets
- **Section 7.4 — Screens and Navigation:** Application shell structure, sidebar navigation, 6 core surfaces (Catalog, Scaffolder, TechDocs, Search, Settings, Homepage)
- **Section 3.1 — Programming Languages:** TypeScript ~5.7.0, Node.js >=22
- **Section 3.2 — Frameworks and Libraries:** React ^18.0.2, React Router ^6.3.0, Vite ^7.1.5, full dependency matrix

### 0.9.3 Web Research Conducted

- **Tailwind CSS v4 releases and architecture** — confirmed v4.2.0 as latest (Feb 2026); CSS-first configuration via `@import "tailwindcss"` and `@theme`; `@tailwindcss/postcss` and `@tailwindcss/vite` as separate packages; Oxide high-performance engine
- **Radix UI unified package** — confirmed `radix-ui` v1.4.3 as unified mono-package replacing individual `@radix-ui/react-*` packages; shadcn/ui new-york style uses unified imports as of Feb 2026
- **shadcn/ui changelog and Tailwind v4 support** — confirmed shadcn CLI supports Tailwind v4 and React 19; `data-slot` attribute pattern; Radix and Base UI dual-library support; RTL support
- **lucide-react** — confirmed v0.575.0 as latest; ISC licensed; tree-shakeable SVG icons
- **cmdk** — confirmed v1.1.1; composable command palette component built on Radix Dialog
- **sonner** — confirmed v2.0.7; opinionated toast component; default toast in shadcn/ui replacing deprecated toast component

### 0.9.4 Attachments and External Resources

- **User attachments:** None provided (0 environments attached)
- **Figma URLs:** None specified
- **Setup instructions:** None provided — environment setup derived from repository configuration files