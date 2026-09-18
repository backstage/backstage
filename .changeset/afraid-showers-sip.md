---
'@backstage/cli-module-catalog': minor
'@backstage/cli-module-scaffolder': minor
'@backstage/cli-module-search': minor
'@backstage/cli-node': patch
---

Add intent-based CLI modules for catalog, scaffolder, and search.

New modules provide domain-oriented subcommands that talk directly to the corresponding plugins' REST APIs:

- `@backstage/cli-module-catalog`: `catalog list`, `catalog get`, `catalog validate`, `catalog register`, `catalog unregister`
- `@backstage/cli-module-scaffolder`: `template list`, `template execute`, `template dry-run`
- `@backstage/cli-module-search`: `search`, `docs search`

The commands support human-readable and JSON output, positional entity and template references, repeatable `key=value` filters and inputs, comma-separated fields and search types, and file-based catalog entity and template input.

`@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.
