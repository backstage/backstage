---
'@backstage/core-components': patch
---

`Link`, `Sidebar` and `ErrorPage` now use the app history when one is available, so sidebar highlighting, the error page "go back" link, and links to absolute or cross-plugin paths keep working under scoped plugin routing. In apps built with the old frontend system there is no app history and behavior is unchanged.

`Link` now also treats protocol-relative `//` URLs as external links.
