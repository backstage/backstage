---
'@backstage/backend-openapi-utils': minor
---

_BREAKING_: The `wrapInOpenApiTestServer` and `wrapServer` functions are now exported via `/tests` subpath. If you were importing these functions directly from the root of the package, you will need to update your imports to use the `/tests` subpath:

```diff
- import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils';
+ import { wrapInOpenApiTestServer } from '@backstage/backend-openapi-utils/tests';
```

or

```diff
- import { wrapServer } from '@backstage/backend-openapi-utils';
+ import { wrapServer } from '@backstage/backend-openapi-utils/tests';
```
