---
'@backstage/catalog-model': patch
---

Added `alpha` release stage type declarations, accessible via `@backstage/catalog-model/alpha`.

**BREAKING**: The experimental entity `status` field was removed from the base `Entity` type and is now only available on the `AlphaEntity` type from the alpha release stage, along with all accompanying types that were previously marked as `UNSTABLE_`.

For example, the following import:

```ts
import { UNSTABLE_EntityStatusItem } from '@backstage/catalog-model';
```

Becomes this:

```ts
import { EntityStatusItem } from '@backstage/catalog-model/alpha';
```

Note that exports that are only available from the alpha release stage are considered unstable and do not adhere to the semantic versioning of the package.
