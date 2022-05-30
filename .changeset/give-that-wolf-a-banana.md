---
'@backstage/create-app': patch
---

Use of `SidebarContext` has been deprecated and will be removed in a future release. Instead, `useSidebarOpenState()` should be used to consume the context and `<SidebarOpenStateProvider>` should be used to provide it.

To prepare your app, update `packages/app/src/components/Root/Root.tsx` as follows:

```diff
import {
  Sidebar,
  sidebarConfig,
- SidebarContext
  SidebarDivider,
  // ...
  SidebarSpace,
+ useSidebarOpenState,
} from '@backstage/core-components';

// ...

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
- const { isOpen } = useContext(SidebarContext);
+ const { isOpen } = useSidebarOpenState();

  // ...
};
```
