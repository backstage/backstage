---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
---

Deprecate the `.render` method of the `createExtensionTester` in favour of using `renderInTestApp` directly.

```tsx
import { renderInTestApp, createExtensionTester } from '@backstage/frontend-test-utils';

const tester = createExtensionTester(extension);

const { getByTestId } = renderInTestApp(tester.element());

// or if you're not using `coreExtensionData.reactElement` as the output ref
const { getByTestId } = renderInTestApp(tester.data(myComponentRef))'
```
