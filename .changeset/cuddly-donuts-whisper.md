---
'@backstage/plugin-explore': patch
---

Refactors the explore plugin to be more customizable. This includes the following non-breaking changes:

- Introduce new `ExploreLayout` page which can be used to create a custom `ExplorePage`
- Refactor `ExplorePage` to use a new `ExploreLayout` component
- Exports existing `DomainExplorerContent`, `GroupsExplorerContent`, & `ToolExplorerContent` components
- Allows `title` props to be customized

Create a custom explore page in `packages/app/src/components/explore/ExplorePage.tsx`.

```tsx
import {
  DomainExplorerContent,
  ExploreLayout,
} from '@backstage/plugin-explore';
import React from 'react';
import { InnserSourceExplorerContent } from './InnserSourceExplorerContent';

export const ExplorePage = () => {
  return (
    <ExploreLayout
      title="Explore the ACME corp ecosystem"
      subtitle="Browse our ecosystem"
    >
      <ExploreLayout.Route path="domains" title="Domains">
        <DomainExplorerContent />
      </ExploreLayout.Route>
      <ExploreLayout.Route path="inner-source" title="InnerSource">
        <AcmeInnserSourceExplorerContent />
      </ExploreLayout.Route>
    </ExploreLayout>
  );
};

export const explorePage = <ExplorePage />;
```

Now register the new explore page in `packages/app/src/App.tsx`.

```diff
+ import { explorePage } from './components/explore/ExplorePage';

const routes = (
  <FlatRoutes>
-    <Route path="/explore" element={<ExplorePage />} />
+    <Route path="/explore" element={<ExplorePage />}>
+      {explorePage}
+    </Route>
  </FlatRoutes>
);
```
