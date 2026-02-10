---
'@backstage/plugin-catalog-react': minor
---

Added `createTestEntityPage` test utility for testing entity cards and content extensions in the new frontend system. This utility creates a test page extension that provides `EntityProvider` context and accepts entity extensions through input redirects:

```typescript
import { renderTestApp } from '@backstage/frontend-test-utils';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';

renderTestApp({
  extensions: [createTestEntityPage({ entity: myEntity }), myEntityCard],
});
```
