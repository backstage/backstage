---
'@backstage/plugin-app': minor
---

The app now provides the default page router for scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). A page with no router override renders with React Router v6, so `react-router-dom` usage inside plugin pages keeps working. A sub-page with no override inherits its page's router at page scope. Top level pages are selected from the app history rather than from a router component at the app root, the app shell keeps a React Router context so chrome components that rely on it are unaffected, and page header tabs and breadcrumbs resolve against the page that is currently mounted.

**BREAKING**: The new frontend system no longer accepts a root router extension. Remove plain `BrowserRouter` overrides, move global providers to `AppRootWrapperBlueprint`, and select alternate routers at the page or sub-page level with `PageRouterBlueprint`. The React Router v6 context the app shell keeps is a temporary compatibility layer for existing chrome, and it owns no browser history.

A page's sub-pages are now ordinary routes one level below the page, matched by the app rather than by a route tree inside the page. Any routing library can therefore host a page with tabs, not only React Router. The framework mounts one adapter around the active content, preferring an explicit sub-page override, then the page override, then the default React Router v6 adapter. Sibling sub-pages that do not override the page keep its adapter mounted and preserve its router state. An explicit sub-page adapter replaces the page adapter while that content is active rather than nesting inside it.

Because sub-pages are ordinary routes, a page's path can now collide with a sub-page route generated below another page. A path a page registers for itself always wins, whichever order the two were installed in, and the app logs a warning naming the collision. The page it shadowed still reaches its own tabs, since a page root sends the visitor to its first tab that is actually routed.

It also fixes two problems:

- Design system tabs, header navigation, menu items and button links now include the app's deploy base path in their href. Under a sub-path deployment, middle-clicking one, opening it in a new tab, copying its address, or letting a crawler follow it now lands on the right page instead of dropping the sub-path. A left click was unaffected.
- Page content is no longer torn down and rebuilt whenever the surrounding app shell re-renders. Moving between two URLs that the same page serves, for example from one entity to another, keeps the page mounted, so scroll position, open dialogs, in-progress form input and in-flight requests survive the navigation.
