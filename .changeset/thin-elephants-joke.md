---
'@backstage/cli': patch
---

The `package start` command now supports an experimental `EXPERIMENTAL_DEV_DB` env flag that can be set to enable the use of `embedded-postgres` as the database for local development, rather than SQLite. For this to work the desired version of the `embedded-postgres` package must be installed in your project, typically as a `devDependency`.
