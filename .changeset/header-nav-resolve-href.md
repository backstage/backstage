---
'@backstage/ui': minor
---

**BREAKING**: Tab `href` values in the Header component are now resolved through the router context instead of being passed raw to the `<a>` tag. This means relative `href` values (e.g. `sub3`, `./sub4`, `../catalog`) are now resolved against the current route, and absolute `href` values may be affected by the router's `basename` configuration.

**Migration:**

Tab navigation should work the same for absolute `href` values in most setups. If you use relative `href` values in tabs, verify they resolve as expected. If your app configures a router `basename`, check that absolute tab `href` values still navigate correctly.

**Affected components:** Header
