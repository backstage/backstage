---
'@backstage/plugin-search': minor
'example-app': patch
'@backstage/create-app': patch
---

Search Modal now relies on the Search Context to access state and state setter. If you use the SidebarSearchModal as described in the [getting started documentation](https://backstage.io/docs/features/search/getting-started#using-the-search-modal), make sure to update your code with the SearchContextProvider.

Before:

```tsx
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSearchModal />
      <SidebarDivider />
    ...
```

Now:

```tsx
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
        <SidebarLogo />
        <SearchContextProvider>
            <SidebarSearchModal />
        </SearchContextProvider>
        <SidebarDivider />
    ...
```
