---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: The `mockApis` namespace is no longer a re-export from `@backstage/test-utils`. It's now a standalone namespace with mock implementations of most core APIs. Mock API instances can be passed directly to `TestApiProvider`, `renderInTestApp`, and `renderTestApp` without needing `[apiRef, impl]` tuples. As part of this change, the `.factory()` method on some mocks has been removed, since it's now redundant.

```tsx
// Before
import { mockApis } from '@backstage/frontend-test-utils';

renderInTestApp(<MyComponent />, {
  apis: [[identityApiRef, mockApis.identity()]],
});

// After - mock APIs can be passed directly
renderInTestApp(<MyComponent />, {
  apis: [mockApis.identity()],
});
```

This change also adds `createApiMock`, a public utility for creating mock API factories, intended for plugin authors to create their own `.mock()` variants.
