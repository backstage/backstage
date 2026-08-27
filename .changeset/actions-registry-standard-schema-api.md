---
'@backstage/backend-plugin-api': minor
---

**BREAKING**: The alpha Actions Registry authoring API now accepts direct schemas that implement both Standard Schema and Standard JSON Schema instead of Zod v3 factory callbacks. Action input and secrets are typed after validation, action output is typed before validation, and examples represent wire input and observable output. Schemas may validate asynchronously.

Install a compatible schema library, such as Zod 4, and migrate registrations to the direct form:

```ts
import { z } from 'zod';

actionsRegistry.register({
  // ...
  schema: {
    input: z.object({ name: z.string() }),
    output: z.object({ greeting: z.string() }),
  },
});
```
