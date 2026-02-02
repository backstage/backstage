---
'@backstage/frontend-test-utils': patch
---

Added an `apis` option to `createExtensionTester`, `renderInTestApp`, and `renderTestApp` to override APIs when testing extensions. Use the `mockApis` helpers to create mock implementations:

```typescript
import { identityApiRef } from '@backstage/frontend-plugin-api';
import { mockApis } from '@backstage/frontend-test-utils';

// Override APIs in createExtensionTester
const tester = createExtensionTester(myExtension, {
  apis: [
    [
      identityApiRef,
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
    ],
  ],
});

// Override APIs in renderInTestApp
renderInTestApp(<MyComponent />, {
  apis: [
    [
      identityApiRef,
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
    ],
  ],
});

// Override APIs in renderTestApp
renderTestApp({
  extensions: [myExtension],
  apis: [
    [
      identityApiRef,
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
    ],
  ],
});
```
