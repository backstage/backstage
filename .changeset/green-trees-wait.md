---
'@backstage/create-app': patch
---

imports `useSearch` hook from new `@backstage/plugin-search-react` package.

To upgrade existing Apps:

1. Change the import to the following:

`packages/app/src/components/search/SearchPage.tsx`

```diff
import {
...
SearchType,
- useSearch,
} from '@backstage/plugin-search';
+import { useSearch } from '@backstage/plugin-search-react';
```

2. Add `@backstage/plugin-search-react` as a dependency to the app.
