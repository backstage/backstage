---
'@backstage/ui': patch
---

`BUIProvider` accepts optional `navigate` and `useHref` props, so a host app can route the navigation of all descendant BUI components through its own navigation authority instead of React Router. When `navigate` is set, a React Router context is no longer required.

`Link` now classifies any URL scheme as an external link, rather than only `http:`, `https:`, `mailto:` and `tel:`. Targets such as `javascript:`, `data:`, `ftp:` and custom application schemes were previously treated as app-internal and handed to the router, which could not resolve them; they are now rendered as plain external links. Scheme matching is also case-insensitive, so `MAILTO:` is recognised. Only the part of the target before any `?` or `#` is inspected, so a link like `/search?query=https://example.com` stays internal.

Links to the app root are also no longer dropped when React Router resolves the root to an empty path.

**Affected components:** Link, BUIProvider
