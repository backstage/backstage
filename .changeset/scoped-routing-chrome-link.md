---
'@backstage/core-components': patch
---

`Link`, `Sidebar` and `ErrorPage` now use the app's own navigation where one is available. In apps built with the old frontend system there is no app navigation and behavior is unchanged.

In the new frontend system:

- Relative links inside a page that is rendered by a routing library other than the app default now stay inside that page, instead of resolving against the app root and navigating out of it. This holds for a tab or other sub-page that brings its own routing library too, including targets that climb a level, such as `to="../overview"`, which now land on the sibling tab rather than leaving the page.
- Links to absolute or cross-plugin paths, and the error page "go back" link, keep working from inside a page that has its own router.
- `Link` renders a plain anchor, rather than failing to render, in an app that has neither app navigation nor React Router, such as one whose router component is a passthrough. The href still picks up the app's deploy base path where the app provides one. A plain anchor cannot honor the props that only a router implements, so `replace`, `state`, `relative`, `preventScrollReset` and `reloadDocument` are dropped there, and each one that was passed is named in a console warning during development.

`Link` also classifies external targets more accurately, and does so the same way on every render path. Protocol-relative `//` URLs are now treated as external, as are targets whose scheme is upper or mixed case, such as `MAILTO:` or `HTTPS://`, or contains digits, such as `s3://`. Targets that begin with a backslash or with whitespace are read the way a browser reads them, so a target such as `\/example.com`, which a browser resolves to another site, is no longer treated as a path inside the app. All of these were previously resolved as in-app paths.

`Link` no longer emits its `to` value as an attribute on the rendered anchor.
