---
'@backstage/ui': minor
---

`BUIProvider` accepts an optional atomic `router` capability containing navigation, href resolution, and reactive location. A host app can therefore route every descendant BUI component through one navigation authority without requiring an ambient React Router context. When omitted, standalone and old frontend system usage continues to adapt the surrounding React Router v6 context.

The capability's href resolver receives targets as written. A target written inside a page — `#tab`, `?tab=readme`, or a relative path — therefore reaches the host app intact and is resolved against that page. Header navigation, tabs, and links read active location from the same capability, so rendering and navigation cannot be configured from different routers.

`Link` now classifies any URL scheme as an external link, rather than only `http:`, `https:`, `mailto:` and `tel:`. Targets such as `ftp:` and custom application schemes were previously treated as app-internal and handed to the router, which could not resolve them; they are now rendered as plain external links. A scheme is recognized however it is spelled, so an upper- or mixed-case one such as `MAILTO:` or `HTTPS://`, and one containing digits such as `s3://`, are now external as well. Only the part of the target before any `?` or `#` is inspected, so a link like `/search?query=https://example.com` stays internal.

**BREAKING**: Every component that takes an `href` now renders an inert `about:blank` href, together with a console warning, when the target's scheme is one a browser executes rather than navigates to: `javascript:`, `data:` and `vbscript:`. Every other scheme is passed through exactly as given. This changes existing behavior for `data:` targets, which previously rendered as a working link in some setups, and it applies wherever an href reaches a component — including hrefs that come from data the app does not author, such as a catalog annotation or an entity's links.

Links to the app root are also no longer dropped when React Router resolves the root to an empty path.

**Migration:**

If you render a `data:` URL as a link — an inline image, a generated file to download — pass the content to the component that displays it instead, or turn it into a blob URL and link to that. `javascript:` targets should be replaced with an `onClick` handler.

**Affected components:** BUIProvider, Link, ButtonLink, Tabs, Menu, Header, PluginHeader, Card, TagGroup, Table
