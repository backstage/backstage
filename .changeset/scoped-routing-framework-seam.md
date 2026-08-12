---
'@backstage/frontend-plugin-api': patch
---

Added an app navigation surface for scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). The app itself now owns browser history in the new frontend system, rather than a router component at the app root, and each page decides which router library renders its own content.

- `appHistoryApiRef` and `AppHistoryApi` expose the app's `navigate`, `location`, `location$` and `createHref`, along with the `AppLocation` and `AppNavigateOptions` types. `navigate` also takes a numeric history delta for back and forward traversal. `createHref` applies the app's deploy base path, and returns targets that are not app-relative, such as absolute URLs, protocol-relative URLs and `mailto:`, unchanged. `navigate` rejects those instead.
- `useAppNavigate` and `useHref` are the navigate and href pair for plugin code. They use the app history where one is available and fall back to React Router where it is not, so the same plugin works in both the new and the old frontend system. `useHref` resolves a target against the page it is written in rather than against the app root, so a fragment-only target such as `#section` or a query-only one such as `?tab=readme` stays on the current page, and each leading `..` climbs one route rather than one path segment. That is the answer React Router gives and the one the old frontend system already gave: from a sub-page to the page it belongs to, and from a page to whatever is above it. A page registered at a path with parameters, such as an entity page at `/catalog/:namespace/:kind/:name`, counts as one route however many segments its address has, so one `..` written on it leads off the page rather than into a path no page is registered at. `useHref` also renders in an app that has no router at all, which is a supported setup. A target whose scheme a browser executes rather than navigates to, meaning `javascript:`, `data:` or `vbscript:` however it is spelled, comes back as an inert `about:blank` href together with a console warning, so an href built from a value the app does not author, such as a catalog annotation, cannot run on click. Every other scheme, `mailto:` and `tel:` included, is returned unchanged.
- `RouteLink` and `useNavigateRouteRef` link to and navigate to route refs without resolving absolute paths by hand.
- `PageRouterBlueprint` and `pageRouterApiRef` select which router library renders active page content. The framework mounts one adapter, preferring an explicit sub-page override, then the page override, then the app default, React Router v6. A sub-page without an override inherits the page adapter at page scope, preserving router state across sibling tabs. An explicit sub-page override replaces the page adapter around its content rather than nesting inside it. `PageBlueprint` and `SubPageBlueprint` keep their optional `router` inputs so the framework can make this choice before rendering the content; a wrapper inside the content cannot remove a default adapter that is already mounted.

Plugins that only navigate within their own page can keep using
`react-router-dom` as before. Content from a `SubPageBlueprint` that inherits
its page router runs in that page-scoped routing context. Native React Router
relative targets and nested `<Routes>` therefore resolve from the page route,
not from the selected sub-page. Use the framework `useHref` or `RouteLink` for
sub-page-relative links, include the sub-page path in native nested routes, or
attach an explicit router to the sub-page when its native router APIs need a
sub-page-scoped root. See
[Scoped Plugin Routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
for guidance on absolute and cross-plugin navigation.
