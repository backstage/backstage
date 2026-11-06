---
'@backstage/repo-tools': patch
---

A failure to format an API or SQL report is now logged as a warning instead of being silently ignored. The report is still written, without formatting. The `package schema openapi generate` command now formats generated code through the Prettier API, so it no longer needs a Prettier executable in the root `node_modules/.bin` folder.
