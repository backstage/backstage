---
'@backstage/backend-test-utils': minor
---

Added an `actionsRegistryServiceMock` and `actionsServiceMock` to `/alpha` export for the experimental services.

This allows you to write tests for your actions by doing something similar to the following:

```ts
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha`;

const mockActionsRegistry = actionsRegistryServiceMock();
const mockCatalog = catalogServiceMock({
  entities: [
   ...
  ],
});

createGetCatalogEntityAction({
  catalog: mockCatalog,
  actionsRegistry: mockActionsRegistry,
});

await expect(
  mockActionsRegistry.invoke({
    id: 'test:get-catalog-entity',
    input: { name: 'test' },
  }),
).resolves.toEqual(...)
```
