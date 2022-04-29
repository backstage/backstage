---
'@backstage/plugin-search-react': minor
---

`SearchContextProviderForStorybook` and `SearchApiProviderForStorybook` has been deleted. New mock implementation of the `SearchApi` introduced. If you need to mock the api we recommend you to do the following:

```tsx
import {
  searchApiRef,
  MockSearchApi,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry } from '@backstage/test-utils';

<ApiProvider apis={TestApiRegistry.from([searchApiRef, new MockSearchApi()])}>
  <SearchContextProvider>
    <Component />
  </SearchContextProvider>
</ApiProvider>;
```
