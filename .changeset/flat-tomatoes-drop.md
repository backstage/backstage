---
'@backstage/create-app': patch
---

Integrated `SidebarSearchModal` component into default-app to use the `SearchModal`.

The `SidebarSearchModal` component can also be used in other generated apps:

```diff
import {
-  SidebarSearch,
+  SidebarSearchModal
} from '@backstage/plugin-search';
...
 <SidebarPage>
    <Sidebar>
      <SidebarLogo />
-     <SidebarSearch />
+     <SidebarSearchModal />
      <SidebarDivider />
...
```

If you only want to use the `SearchModal` you can import it from `'@backstage/plugin-search'`:

```js
import { SearchModal } from '@backstage/plugin-search';
```
