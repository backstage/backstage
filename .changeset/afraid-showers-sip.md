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

The commands take their main input as a positional argument: an entity or template reference, a file path (or `-` for standard input) for `catalog validate` and `template dry-run`, a URL for `catalog register`, and the search terms for `search` and `docs search`. Repeatable `key=value` flags are used for filters, template values, and secrets, and comma-separated lists for `--fields`. Unknown flags are rejected.

The commands that list results, `catalog list`, `template list`, `search`, and `docs search`, support `--output human` (the default) or `--output json`, along with `--limit` and `--cursor` for paging. Each command prints a single page. Human output shows how many results were shown and, when more are available, prints the `--cursor` value to continue from. All other commands always print JSON. `catalog validate` checks every entity in a multi-document YAML file and prints a JSON array with one result per entity. `catalog validate` and `template dry-run` exit with a non-zero code when the input is invalid, while connection and authentication problems are reported as errors.

`@backstage/cli-node` now provides shared parsers for repeatable `key=value` inputs and comma-separated lists.
