---
'@backstage/core-components': patch
---

`Link`, `Sidebar` and `ErrorPage` now use the app's own navigation when one is available, which fixes several problems in the new frontend system. In apps built with the old frontend system there is no app navigation and behavior is unchanged.

- Sidebar items with a relative target, such as `to="catalog"`, highlight correctly again. They previously stopped highlighting altogether once the user navigated below the top level, which affected every app created from the default template.
- Sidebar items whose target carries a query string, such as `to="/catalog?kind=component"`, match the current location again, so the item the user is actually on is the one that is highlighted.
- Link hrefs now include the app's deploy basename. Under a sub-path deployment, opening a link in a new tab, copying its address, or letting a crawler follow it now lands on the right page instead of dropping the sub-path.
- Relative links inside a page that is rendered by a routing library other than the app default now stay inside that page, instead of resolving against the app root and navigating out of it. This holds for a tab or other sub-page that brings its own routing library too, including targets that climb a level, such as `to="../overview"`, which now land on the sibling tab rather than leaving the page.
- Links to absolute or cross-plugin paths, and the error page "go back" link, keep working from inside a page that has its own router.
- `Link` renders a plain anchor, rather than failing to render, in an app that has neither app navigation nor React Router — an app whose router component is a passthrough, for example. The href still picks up the app's deploy basename where the app provides one. A plain anchor cannot honor the props that only a router implements, so `replace`, `state`, `relative`, `preventScrollReset` and `reloadDocument` are dropped there, and each one that was passed is named in a console warning during development.

`Link` also classifies external targets more accurately. Protocol-relative `//` URLs are now treated as external, as are targets whose scheme is upper- or mixed-case, such as `MAILTO:` or `HTTPS://`, or contains digits, such as `s3://`. These were previously resolved as in-app paths.
