---
'@backstage/plugin-search-react': minor
---

**BREAKING**: `SearchContextProviderForStorybook` and `SearchApiProviderForStorybook` has been deleted. New mock implementation of the `SearchApi` introduced. If you need to mock the api we recommend you to do the following:

```tsx
import {
  searchApiRef,
  MockSearchApi,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { TestApiProvider } from '@backstage/test-utils';

<TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
  <SearchContextProvider>
    <Component />
  </SearchContextProvider>
</TestApiProvider>;
```
