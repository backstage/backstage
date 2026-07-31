---
'@backstage/frontend-plugin-api': patch
---

Added a framework navigation surface for scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). Browser history in the new frontend system is now owned by the app itself rather than by a router component at the app root, and each page decides which router library renders its own content.

- `appHistoryApiRef` / `AppHistoryApi` expose the app's `navigate`, `location$` and `createHref`, along with the `FrameworkLocation` and `FrameworkNavigateOptions` types.
- `useAppNavigate` and `useHref` are the navigate and href pair for plugin code. They use the app history when one is available and fall back to React Router when it is not, so the same plugin works in both the new and the old frontend system.
- `RouteLink` and `useNavigateRouteRef` link to and navigate to route refs without resolving absolute paths by hand.
- `PageRouterBlueprint`, `pageRouterApiRef` and `PageRouterApi` let a page render its content with a different router library. A page router component receives the page's `basePath`, `routePattern` and `appBasename`. `PageBlueprint` and `SubPageBlueprint` accept the adapter through a new optional `router` input; leaving it empty keeps the app default, which is React Router v6.
- `AppRouteSwitch` and `RouteTable` match and render top level pages for apps that assemble their own app root.

Plugins that only navigate within their own page can keep using `react-router-dom` as before. See [Scoped Plugin Routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing) for guidance on absolute and cross-plugin navigation.
