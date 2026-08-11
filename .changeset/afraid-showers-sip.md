---
'@backstage/cli-module-catalog': minor
'@backstage/cli-module-scaffolder': minor
'@backstage/cli-module-search': minor
---

Add intent-based CLI modules for catalog, scaffolder, and search.

New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

- `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
- `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
- `@backstage/cli-module-search`: `search`, `docs search`
