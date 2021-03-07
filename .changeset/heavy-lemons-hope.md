---
'@backstage/core-api': patch
---

Add `SubRouteRef`s, which can be used to create a route ref with a fixed path relative to an absolute `RouteRef`. They are useful if you for example have a page that is mounted at a sub route of a routable extension component, and you want other plugins to be able to route to that page.

For example:

```tsx
// routes.ts
const rootRouteRef = createRouteRef({ id: 'root' });
const detailsRouteRef = createSubRouteRef({
  id: 'root-sub',
  parent: rootRouteRef,
  path: '/details',
});

// plugin.ts
export const myPlugin = createPlugin({
  routes: {
    root: rootRouteRef,
    details: detailsRouteRef,
  }
})

export const MyPage = plugin.provide(createRoutableExtension({
  component: () => import('./components/MyPage').then(m => m.MyPage),
  mountPoint: rootRouteRef,
}))

// components/MyPage.tsx
const MyPage = () => (
  <Routes>
    {/* myPlugin.routes.root will take the user to this page */}
    <Route path='/' element={<IndexPage />}>

    {/* myPlugin.routes.details will take the user to this page */}
    <Route path='/details' element={<DetailsPage />}>
  </Routes>
)
```
