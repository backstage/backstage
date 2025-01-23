---
'@backstage/backend-openapi-utils': minor
---

**BREAKING**: The `wrapInOpenApiTestServer` and `wrapServer` functions are now exported via `/testUtils` subpath. If you were importing these functions directly from the root of the package, you will need to update your imports to use the `/testUtils` subpath:

```diff
- import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils';
+ import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils/testUtils';
```

or

```diff
- import { wrapServer } from '@backstage/backend-openapi-utils';
+ import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
```
