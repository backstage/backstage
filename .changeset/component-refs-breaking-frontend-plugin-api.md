---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The component system has been overhauled to use `SwappableComponent` instead of `ComponentRef`. Several APIs have been removed and replaced:

- Removed: `createComponentRef`, `createComponentExtension`, `ComponentRef`, `ComponentsApi`, `componentsApiRef`, `useComponentRef`, `coreComponentRefs`
- Added: `createSwappableComponent`, `SwappableComponentBlueprint`, `SwappableComponentRef`, `SwappableComponentsApi`, `swappableComponentsApiRef`

**BREAKING**: The default `componentRefs` and exported `Core*Props` have been removed and have replacement `SwappableComponents` and revised type names instead.

- The `errorBoundaryFallback` component and `CoreErrorBoundaryFallbackProps` type have been replaced with `ErrorDisplay` swappable component and `CoreErrorDisplayProps` respectively.
- The `progress` component and `CoreProgressProps` type have been replaced with `Progress` swappable component and `ProgressProps` respectively.
- The `notFoundErrorPage` component and `CoreNotFoundErrorPageProps` type have been replaced with `NotFoundErrorPage` swappable component and `NotFoundErrorPageProps` respectively.

**Migration for creating swappable components:**

```tsx
// OLD: Using createComponentRef and createComponentExtension
import {
  createComponentRef,
  createComponentExtension,
} from '@backstage/frontend-plugin-api';

const myComponentRef = createComponentRef<{ title: string }>({
  id: 'my-plugin.my-component',
});

const myComponentExtension = createComponentExtension({
  ref: myComponentRef,
  loader: {
    lazy: () => import('./MyComponent').then(m => m.MyComponent),
  },
});

// NEW: Using createSwappableComponent and SwappableComponentBlueprint
import {
  createSwappableComponent,
  SwappableComponentBlueprint,
} from '@backstage/frontend-plugin-api';

const MySwappableComponent = createSwappableComponent({
  id: 'my-plugin.my-component',
  loader: () => import('./MyComponent').then(m => m.MyComponent),
});

const myComponentExtension = SwappableComponentBlueprint.make({
  name: 'my-component',
  params: {
    component: MySwappableComponent,
    loader: () => import('./MyComponent').then(m => m.MyComponent),
  },
});
```

**Migration for using components:**

```tsx
// OLD: Using ComponentsApi and useComponentRef
import {
  useComponentRef,
  componentsApiRef,
  useApi,
  coreComponentRefs,
} from '@backstage/frontend-plugin-api';

const MyComponent = useComponentRef(myComponentRef);
const ProgressComponent = useComponentRef(coreComponentRefs.progress);


// NEW: Direct component usage
import { Progress } from '@backstage/frontend-plugin-api';

// Use directly as React Component
<Progress />
<MySwappableComponent title="Hello World" />
```

**Migration for core component references:**

```tsx
// OLD: Core component refs
import { coreComponentRefs } from '@backstage/frontend-plugin-api';

coreComponentRefs.progress
coreComponentRefs.notFoundErrorPage
coreComponentRefs.errorBoundaryFallback

// NEW: Direct swappable component imports
import { Progress, NotFoundErrorPage, ErrorDisplay } from '@backstage/frontend-plugin-api';

// Use directly as React components
<Progress />
<NotFoundErrorPage />
<ErrorDisplay plugin={plugin} error={error} resetError={resetError} />
```
