---
'@backstage/e2e-test-utils': patch
---

Added optional `channel` option to `generateProjects()` to allow customizing the Playwright browser channel for testing against different browsers variants. When not provided, the function defaults to 'chrome' to maintain backward compatibility.

Example usage:

```ts
import { generateProjects } from '@backstage/e2e-test-utils';

export default defineConfig({
  projects: generateProjects({ channel: 'msedge' }),
});
```
