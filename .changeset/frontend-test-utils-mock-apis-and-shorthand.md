---
'@backstage/frontend-test-utils': patch
---

Added a new `mockApis` namespace with mock implementations of many core APIs. Mock API instances can be passed directly to `TestApiProvider`, `renderInTestApp`, and `renderTestApp` without needing `[apiRef, impl]` tuples.

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
