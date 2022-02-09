---
'@backstage/create-app': patch
---

Remove SearchContextProvider from `<Root />`

The `SidebarSearchModal` exported from `plugin-search` internally renders `SearchContextProvider`, so it can be removed from `Root.tsx`:

```diff
-import {
-  SidebarSearchModal,
-  SearchContextProvider,
-} from '@backstage/plugin-search';
+import { SidebarSearchModal } from '@backstage/plugin-search';

... omitted ...

       <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
-        <SearchContextProvider>
-          <SidebarSearchModal />
-        </SearchContextProvider>
+        <SidebarSearchModal />
       </SidebarGroup>
```
