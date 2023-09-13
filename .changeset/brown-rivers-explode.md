---
'@backstage/create-app': patch
---

Added setting the global `TextEncoder` to `setupTests.ts` to get the `App.test.tsx` test to pass when using the Kubernetes plugin. For those who have an existing Backstage instance just add the following to your to `setupTests.ts` file:

```ts
// Do not remove, patching jsdom environment to support TextEncoder, refer to https://github.com/jsdom/jsdom/issues/2524
// eslint-disable-next-line no-restricted-imports
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
```
