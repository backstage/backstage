# Page Header Architecture - Implementation Summary

## Overview

This branch implements a new page header architecture for Backstage's New Frontend System (NFS) that provides:

- Consistent headers across all plugin pages
- Support for sub-pages with tab navigation
- Header actions (buttons/controls in the header)
- Plugin-level display metadata (titles and icons)

## Architectural Changes

### 1. New Blueprint: `HeaderActionBlueprint`

**Location:** `packages/frontend-plugin-api/src/blueprints/HeaderActionBlueprint.tsx`

A new extension blueprint that allows plugins to register actions (buttons, controls) that appear in the page header.

**Key Features:**

- Attaches to `app/routes` with input `headerActions`
- Outputs `coreExtensionData.reactElement`
- Uses lazy loading with `ExtensionBoundary`

**Usage Example** (from api-docs plugin):

```typescript
HeaderActionBlueprint.make({
  name: 'register-api',
  params: {
    loader: async () =>
      compatWrapper(
        <ButtonLink href="/catalog">Register Existing API</ButtonLink>,
      ),
  },
});
```

### 2. Enhanced `PageBlueprint`

**Location:** `packages/frontend-plugin-api/src/blueprints/PageBlueprint.tsx`

The `PageBlueprint` has been significantly enhanced to support sub-pages and tabbed navigation.

**New Features:**

#### Inputs

- New `pages` input that accepts sub-pages with:
  - `routePath`
  - `routeRef` (optional)
  - `reactElement`
  - `title` (optional)

#### Outputs

- Added `title` output (optional)

#### Configuration

- New `title` config schema property

#### Parameters

- `title?: string` - Page title displayed in header
- `loader` is now optional (not required when using sub-pages)
- `routeRef` now accepts both `RouteRef` and `SubRouteRef`

#### Behavior Changes

1. **With loader (traditional page):** Renders Header + page content
2. **Without loader (parent page with tabs):** Renders Header with tabs populated from `inputs.pages`

### 3. Central Routing Changes: `AppRoutes`

**Location:** `plugins/app/src/extensions/AppRoutes.tsx`

The core routing extension has been substantially refactored to orchestrate the new header architecture.

**Key Implementation Details:**

#### Header Action Aggregation

```typescript
const headerActionsByPluginId = new Map<string, Array<ReactNode>>();
```

- Collects all header actions from inputs
- Groups them by plugin ID
- Passes them to the Header component via `customActions` prop

#### Page Aggregation by Path

```typescript
const pagesByPath = new Map<
  string,
  Array<{ element: JSX.Element; title: string; node: AppNode }>
>();
```

- Groups pages by their route path
- Enables detection of pages with sub-pages
- Stores title and node reference for each page

#### Conditional Rendering Logic

1. **Multiple pages at same path (tabbed navigation):**

   - Renders `Header` with tabs
   - Uses nested `<Routes>` for tab content
   - Tab matching uses prefix strategy

2. **Single page (traditional):**
   - Renders `Header` with plugin title
   - Renders page element directly

### 4. Plugin Display Metadata

**Location:** `plugins/catalog/src/alpha/plugin.tsx`

Plugins can now define display metadata:

```typescript
export default createFrontendPlugin({
  pluginId: 'catalog',
  info: {
    packageJson: () => import('../../package.json'),
  },
  display: {
    icon: 'catalog',
    title: 'Software Catalog',
  },
  // ...
});
```

### 5. Header Component Styling Updates

**Location:** `packages/ui/src/components/Header/Header.module.css`

- Commented out default `margin-bottom` on `.bui-HeaderToolbar`
- Allows tighter integration between header and content
- Maintains conditional margin for tabbed headers

## Implementation Examples

### Example 1: App Visualizer (Multi-page with Tabs)

**Location:** `plugins/app-visualizer/src/plugin.tsx`

Demonstrates the sub-page pattern:

1. **Parent page** (no loader):

```typescript
const appVisualizerPage = PageBlueprint.make({
  params: {
    path: '/visualizer',
    routeRef: rootRouteRef,
    title: 'Visualizer',
    // No loader - will show tabs
  },
});
```

2. **Sub-pages** (using `SubPageBlueprint` - not yet fully implemented):

```typescript
const appVisualizerTreePage = SubPageBlueprint.make({
  attachTo: { id: 'page:app-visualizer', input: 'pages' },
  name: 'tree',
  params: {
    path: '/tree',
    title: 'Tree',
    loader: () => import('./components/...'),
  },
});
```

Multiple sub-pages are defined:

- Tree view (`/tree`)
- Detailed view (`/details`)
- Text view (`/text`)

### Example 2: API Docs (Header Actions)

**Location:** `plugins/api-docs/src/alpha.tsx`

Demonstrates header actions:

```typescript
HeaderActionBlueprint.make({
  name: 'register-api',
  params: {
    loader: async () =>
      compatWrapper(
        <ButtonLink href="/catalog">Register Existing API</ButtonLink>,
      ),
  },
});
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        AppRoutes                             │
│  (Central orchestrator)                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌────────────────────┐
    │  headerActions    │       │      routes        │
    │    input          │       │      input         │
    └───────────────────┘       └────────────────────┘
                │                           │
                │                           │
                ▼                           ▼
    Group by plugin ID          Group by route path
                │                           │
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Route Renderer │
                    └─────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
                ▼                            ▼
    ┌──────────────────┐        ┌──────────────────────┐
    │  Single Page     │        │  Multi-page (Tabs)   │
    │                  │        │                      │
    │  Header +        │        │  Header (w/ tabs) +  │
    │  Page Element    │        │  Nested Routes       │
    └──────────────────┘        └──────────────────────┘
```

## Extension Data Types Used

The implementation relies on these core extension data types:

- `coreExtensionData.routePath` - Route paths for pages
- `coreExtensionData.routeRef` - Route references for navigation
- `coreExtensionData.reactElement` - React components to render
- `coreExtensionData.title` - Page/sub-page titles

## Technical Considerations

### 1. Plugin-Relative Attachment Points

The implementation uses string-based attachment points:

```typescript
attachTo: { id: 'page:app-visualizer', input: 'pages' }
```

**Future consideration:** TypeScript-based attachment points for type safety:

```typescript
attachTo: appVisualizerPage.inputs.pages;
```

### 2. SubPageBlueprint

The code references `SubPageBlueprint` which is not yet fully implemented in the blueprint exports. This suggests it's either:

- Still being developed
- Implemented locally for testing
- Planned for future implementation

### 3. Header Component Integration

The `Header` component from `@backstage/ui` is used directly in:

- `PageBlueprint` rendering
- `AppRoutes` conditional rendering

This component accepts:

- `title` - Page title
- `tabs` - Array of tab configurations
- `customActions` - Array of React nodes for header actions

### 4. Route Matching Strategy

Sub-pages use different route matching:

- Parent pages: Match with trailing `/*` for catch-all
- Tab content: Direct path matching
- Tab component: Uses `matchStrategy: 'prefix'`

## Outstanding Questions & TODOs

From `header.md`:

### Decisions Needed

- [ ] Should we add titles to all plugins?
- [ ] Should we add icons to all plugins?
- [ ] Is `HeaderActionBlueprint` too specific? (Note: "a bit wonky")
- [ ] PageBlueprint additions or ContentBlueprint?

### Implementation Items

- [ ] Ship the Figma design
- [ ] TopBarActionBlueprint? (alternative naming consideration)
- [ ] Add `icon` and `title` to plugin info (partially done)
- [ ] Add support for plugin-relative attachment points
- [ ] Consider TypeScript-based attachment points
- [ ] Add `coreExtensionData.navTarget`
- [ ] Add swappable component for PageBlueprint React element

## Breaking Changes

This implementation introduces breaking changes:

1. **PageBlueprint API changes:**

   - New optional `title` parameter
   - `loader` is now optional
   - `routeRef` accepts `SubRouteRef` in addition to `RouteRef`

2. **AppRoutes behavior:**

   - Automatically wraps all pages with Header component
   - Changes route structure for multi-page plugins

3. **Header styling:**
   - Removes default bottom margin on headers

## Migration Path

For existing plugins to adopt the new header architecture:

1. **Add display metadata to plugin:**

```typescript
display: {
  icon: 'plugin-icon',
  title: 'Plugin Name',
}
```

2. **Add titles to pages:**

```typescript
PageBlueprint.make({
  params: {
    title: 'Page Title',
    // ... other params
  },
});
```

3. **Optional - Add header actions:**

```typescript
HeaderActionBlueprint.make({
  params: {
    loader: () => <YourButton />,
  },
});
```

4. **Optional - Add sub-pages for tabbed navigation:**
   Create multiple pages at the same route path with different titles.

## Files Changed Summary

| File                                       | Lines Changed | Type of Change         |
| ------------------------------------------ | ------------- | ---------------------- |
| `header.md`                                | +43           | Documentation          |
| `HeaderActionBlueprint.tsx`                | +35           | New Blueprint          |
| `PageBlueprint.tsx`                        | +52/-12       | Enhancement            |
| `blueprints/index.ts`                      | +1            | Export                 |
| `Header.module.css`                        | +1/-1         | Styling                |
| `plugins/api-docs/src/alpha.tsx`           | +13/-1        | Example Implementation |
| `plugins/app-visualizer/src/plugin.tsx`    | +120/-1       | Example Implementation |
| `plugins/app/package.json`                 | +1            | Dependency             |
| `plugins/app/src/extensions/AppRoutes.tsx` | +77/-2        | Core Logic             |
| `plugins/catalog/src/alpha/plugin.tsx`     | +9/-1         | Display Metadata       |
| `yarn.lock`                                | +1            | Dependency             |

**Total: 11 files, ~354 insertions, ~20 deletions**

## Next Steps

1. **Complete SubPageBlueprint implementation** - Currently referenced but not fully exported
2. **Decide on naming** - HeaderActionBlueprint vs TopBarActionBlueprint
3. **Type-safe attachment points** - Consider TypeScript-based approach
4. **Migration guide** - Document for plugin authors
5. **Testing** - Comprehensive tests for new routing logic
6. **Figma alignment** - Ensure implementation matches design specs
7. **Plugin adoption** - Roll out to all core plugins
8. **API documentation** - Update API docs for new blueprints

## Architecture Benefits

1. **Consistency:** All pages have consistent header treatment
2. **Flexibility:** Supports both simple pages and complex tabbed interfaces
3. **Extensibility:** Header actions allow plugins to add controls
4. **Navigation:** Two-level navigation (page + sub-pages) is now native
5. **Declarative:** Uses extension system patterns for discoverability
6. **Centralized:** AppRoutes orchestrates header rendering for consistency

## Potential Concerns

1. **Complexity:** AppRoutes has increased complexity with conditional rendering
2. **Performance:** Multiple map operations on every render
3. **Breaking:** Changes existing PageBlueprint behavior
4. **Incomplete:** SubPageBlueprint appears incomplete
5. **Debugging:** Console.log statements present (need cleanup)
6. **Migration:** All existing plugins will need updates for full adoption
