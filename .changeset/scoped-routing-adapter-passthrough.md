---
'@backstage/plugin-app-react-router-v6': patch
'@backstage/plugin-app-react-router-v7': patch
'@backstage/plugin-app-tanstack-router': patch
---

Fixed the page router adapters throwing where they were meant to pass through.

Scoping a routing library to a page needs two things: a page mount, saying which part of the URL belongs to the page, and a registered `AppHistoryApi` to project a location from. Each adapter already checked for the mount and rendered its `children` untouched when there was none — but it read the app history first, with `useApi`, which throws when nothing has registered one. The passthrough was therefore unreachable in exactly the places it exists for.

The app history is now read optionally, and a missing one is treated the same as a missing mount. All three adapters are inert unless both halves are present: `children` are rendered as given, no routing context is added, and nothing is demanded of the surrounding app — no API provider, no framework context.

This is what makes the adapter safe in a package that ships for both frontend systems. The component that wraps itself in an adapter for the new frontend system is very often the same component the old one renders, and there is no page mount and no app history there, so the wrap has to be invisible rather than a crash. The same applies to a plugin's own `render()` unit tests, which have no app around them at all.

`TanStackPageRouter` was already inert without a page mount, since the mount is checked before its host is built. The missing half was the other one: with a mount but no app history it reached `TanStackRouterHost` and threw there instead. That check now lives with the host, so neither half is assumed by the other.

Behavior where both are present is unchanged, including the memoization that keeps a page's router mount-stable across navigation within the page.
