---
'@backstage/cli-module-config': patch
'@backstage/cli-module-github': patch
'@techdocs/cli': patch
---

Removed the dependency on the unmaintained `react-dev-utils` package. Opening the browser now honors the `BROWSER` and `BROWSER_ARGS` environment variables.
