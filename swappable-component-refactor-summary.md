# Swappable Component Architecture Refactor

## Problem

The initial implementation had `@backstage/frontend-plugin-api` directly importing `Header` from `@backstage/ui`, which violated the package dependency architecture:

- `@backstage/frontend-plugin-api` is a low-level API package
- `@backstage/ui` is a higher-level UI component library
- API packages should not depend on UI libraries

## Solution

Implemented a **swappable component pattern** that:

1. Provides a default implementation using plain HTML elements in `@backstage/frontend-plugin-api`
2. Ships the `@backstage/ui` Header implementation via the `@backstage/plugin-app` plugin
3. Allows apps to override the component with custom implementations

This follows the same pattern used for other swappable components like `Progress`, `NotFoundErrorPage`, and `ErrorDisplay`.

## Architecture

### 1. Created PageWrapper Swappable Component

**Location:** `packages/frontend-plugin-api/src/components/PageWrapper.tsx`

```typescript
export interface PageWrapperProps {
  title?: string;
  tabs?: PageTab[];
  children?: ReactNode;
}

// Default implementation using plain HTML
function DefaultPageWrapper(props: PageWrapperProps): JSX.Element {
  // Uses plain <div>, <header>, <nav>, <a> elements
  // No dependency on @backstage/ui
}

// Swappable component that can be overridden
export const PageWrapper = createSwappableComponent<PageWrapperProps>({
  id: 'core.page-wrapper',
  loader: () => DefaultPageWrapper,
});
```

**Key Features:**

- ✅ No dependencies on `@backstage/ui`
- ✅ Uses only plain HTML elements in default implementation
- ✅ Provides basic styling for usability
- ✅ Can be overridden by apps

### 2. Updated PageBlueprint

**Location:** `packages/frontend-plugin-api/src/blueprints/PageBlueprint.tsx`

**Before:**

```typescript
import { Header } from '@backstage/ui'; // ❌ Direct dependency

<Header title={params.title} tabs={tabs} />;
```

**After:**

```typescript
import { PageWrapper } from '../components'; // ✅ Internal swappable component

<PageWrapper title={params.title} tabs={tabs}>
  {children}
</PageWrapper>;
```

### 3. Provided @backstage/ui Implementation

**Location:** `plugins/app/src/extensions/components.tsx`

```typescript
export const PageWrapper = SwappableComponentBlueprint.make({
  name: 'core-page-wrapper',
  params: define =>
    define({
      component: SwappablePageWrapper,
      loader: () => (props: PageWrapperProps) => {
        const { title, tabs, children } = props;
        return (
          <>
            <Header title={title} tabs={tabs} />
            {children}
          </>
        );
      },
    }),
});
```

**Registered in:** `plugins/app/src/plugin.ts`

The app plugin now provides the `@backstage/ui` Header implementation, which will be used instead of the default plain HTML version.

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ @backstage/frontend-plugin-api                              │
│                                                              │
│  PageWrapper (swappable component)                          │
│    ├─ Default: Plain HTML implementation                    │
│    └─ Interface: PageWrapperProps                           │
└─────────────────────────────────────────────────────────────┘
                        ▲
                        │ overrides
                        │
┌─────────────────────────────────────────────────────────────┐
│ @backstage/plugin-app                                       │
│                                                              │
│  PageWrapper extension                                      │
│    └─ Implementation: @backstage/ui Header                  │
└─────────────────────────────────────────────────────────────┘
```

## Default Implementation Details

The default `PageWrapper` implementation provides:

### Header Section

- Title display with basic typography
- Tab navigation with links
- Simple border and spacing

### Styling

- Uses inline styles (no external CSS dependencies)
- Minimal but functional design
- Ensures the component is usable without any UI library

### Example Output (Default)

```html
<div data-component="page-wrapper">
  <header style="...">
    <div style="...">{title}</div>
    <nav style="...">
      <a href="/tab1">Tab 1</a>
      <a href="/tab2">Tab 2</a>
    </nav>
  </header>
  {children}
</div>
```

## Benefits of This Approach

### 1. Clean Dependencies

- ✅ `@backstage/frontend-plugin-api` remains dependency-free
- ✅ No circular dependencies
- ✅ Clear separation of concerns

### 2. Flexibility

- Apps can use the default HTML implementation
- Apps can use the `@backstage/ui` implementation (via plugin-app)
- Apps can provide completely custom implementations

### 3. Testability

- Default implementation can be tested without UI library dependencies
- Easy to test in isolation
- No need to mock UI components

### 4. Progressive Enhancement

- Works out of the box with plain HTML
- Enhanced with better UI when `@backstage/plugin-app` is installed
- Graceful degradation if UI library is not available

## How to Override PageWrapper

Apps can provide their own implementation:

```typescript
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { PageWrapper as SwappablePageWrapper } from '@backstage/frontend-plugin-api';
import { MyCustomHeader } from './components';

const CustomPageWrapper = SwappableComponentBlueprint.make({
  name: 'custom-page-wrapper',
  params: define =>
    define({
      component: SwappablePageWrapper,
      loader: () => props =>
        <MyCustomHeader {...props}>{props.children}</MyCustomHeader>,
    }),
});

// Add to app plugin extensions
```

## Files Modified

### Created

1. `packages/frontend-plugin-api/src/components/PageWrapper.tsx` - Swappable component

### Modified

2. `packages/frontend-plugin-api/src/components/index.ts` - Export PageWrapper
3. `packages/frontend-plugin-api/src/blueprints/PageBlueprint.tsx` - Use PageWrapper instead of Header
4. `plugins/app/src/extensions/components.tsx` - Provide @backstage/ui implementation
5. `plugins/app/src/extensions/index.ts` - Export PageWrapper extension
6. `plugins/app/src/plugin.ts` - Register PageWrapper extension

## API Surface

### PageTab Interface

```typescript
export interface PageTab {
  id: string;
  label: string;
  href: string;
  matchStrategy?: 'prefix' | 'exact';
}
```

### PageWrapperProps Interface

```typescript
export interface PageWrapperProps {
  title?: string;
  tabs?: PageTab[];
  children?: ReactNode;
}
```

### PageWrapper Component

```typescript
export const PageWrapper: {
  (props: PageWrapperProps): JSX.Element | null;
  ref: SwappableComponentRef<PageWrapperProps>;
};
```

## Testing Strategy

### Unit Tests

- Test default PageWrapper implementation
- Test PageWrapper with various prop combinations
- Test tab rendering
- Test children rendering

### Integration Tests

- Test PageBlueprint using PageWrapper
- Test swapping PageWrapper implementation
- Test @backstage/ui Header integration via plugin-app

### Visual Tests

- Compare default vs @backstage/ui implementations
- Verify styling consistency
- Test responsive behavior

## Migration Impact

### For Core Backstage

- ✅ No breaking changes
- ✅ Existing apps automatically get @backstage/ui Header via plugin-app
- ✅ New architecture is more maintainable

### For Plugin Authors

- ✅ No changes required
- ✅ PageBlueprint API remains the same
- ✅ SubPageBlueprint API remains the same

### For App Developers

- ✅ Can continue using default setup
- ✅ Can customize PageWrapper if desired
- ✅ Can disable @backstage/ui implementation if needed

## Future Enhancements

### Potential Additions

1. **Breadcrumbs Support**: Add breadcrumbs to PageWrapperProps
2. **Actions Support**: Add header actions to PageWrapperProps
3. **Themes**: Support for theme-aware default styling
4. **Layouts**: Different layout modes (full-width, centered, etc.)

### API Evolution

The swappable component pattern makes it easy to evolve the API:

- Add new optional props without breaking changes
- Provide richer default implementations over time
- Support multiple variants (e.g., PageWrapperCompact, PageWrapperExpanded)

## Comparison to Previous Implementation

### Before

```
PageBlueprint
  └─> Directly imports @backstage/ui Header ❌
        └─> Creates dependency violation
```

### After

```
PageBlueprint
  └─> Uses PageWrapper (swappable) ✅
        ├─> Default: Plain HTML
        └─> App Plugin: @backstage/ui Header
```

## Conclusion

This refactor successfully:

- ✅ Removes the invalid dependency from `@backstage/frontend-plugin-api` to `@backstage/ui`
- ✅ Provides a functional default implementation using plain HTML
- ✅ Maintains the ability to use the rich `@backstage/ui` Header via plugin-app
- ✅ Follows established Backstage patterns for swappable components
- ✅ Enables future customization and extensibility
- ✅ Passes all type checks

The architecture is now cleaner, more flexible, and follows Backstage best practices.
