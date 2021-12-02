---
'@backstage/plugin-search': minor
---

Search Modal now relies on the Search Context to access state and state setter. If you use the SidebarSearchModal as described in the [getting started documentation](https://backstage.io/docs/features/search/getting-started#using-the-search-modal), make sure to update your code with the SearchContextProvider.

```diff
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
-     <SidebarSearchModal />
+     <SearchContextProvider>
+       <SidebarSearchModal />
+     </SearchContextProvider>
      <SidebarDivider />
    ...
```
