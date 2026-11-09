---
id: engines
title: Documentation Engines
description: How TechDocs chooses the documentation engine that builds each site, and which engines are available
---

TechDocs turns Markdown into a documentation site with a _documentation
engine_. Every engine reads the same `mkdocs.yml` and `docs/` folder, so
switching engines does not require restructuring your documentation.

## Available engines

| Engine     | Package                                              | Status       |
| ---------- | ---------------------------------------------------- | ------------ |
| `mkdocs`   | Built into `@backstage/plugin-techdocs-backend`      | Default      |
| `zensical` | `@backstage/plugin-techdocs-backend-module-zensical` | Experimental |

The `mkdocs` engine runs [MkDocs](https://www.mkdocs.org/) with the
[`mkdocs-techdocs-core`](https://github.com/backstage/mkdocs-techdocs-core)
plugin. TechDocs has always used it, and it stays the default.

The `zensical` engine runs [Zensical](https://zensical.org), the successor to
Material for MkDocs. To set it up, see [Zensical Engine](./engines-zensical.md).

## How an engine is chosen

### In the TechDocs backend

For each entity, the backend uses:

1. The `backstage.io/techdocs-engine` annotation on the entity, if set.
2. Otherwise, `techdocs.generator.defaultEngine` from `app-config.yaml`.
3. Otherwise, `mkdocs`.

```yaml title="catalog-info.yaml"
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
    backstage.io/techdocs-engine: zensical
```

```yaml title="app-config.yaml"
techdocs:
  generator:
    defaultEngine: zensical
```

The engine has to be installed. If an entity or `defaultEngine` names an
engine with no registered generator, the build fails, and the error lists the
engines that are registered. The backend also logs a warning at startup when
`defaultEngine` isn't registered. You can write `techdocs` as an alias for
`mkdocs`.

### In the TechDocs CLI

`techdocs-cli generate`, `serve` and `serve:raw` use:

1. The `--engine` flag, if passed.
2. Otherwise, the `backstage.io/techdocs-engine` annotation in the
   `catalog-info.yaml` next to your docs.
3. Otherwise, `mkdocs`.

See [TechDocs CLI](./cli.md) for details.

## Which engine built a site

Each generated site records the engine in `techdocs_metadata.json`:

```json
{ "site_name": "My docs", "engine": "zensical", "...": "..." }
```

Sites published before engines were introduced have no `engine` field and
were built with MkDocs.

## Shared behavior

MkDocs and Zensical go through the same TechDocs pipeline, so the following
work the same way for both:

- Sources are prepared from the `backstage.io/techdocs-ref` annotation.
- `mkdocs.yml` is sanitized with the same allowlist. The
  `techdocs.generator.mkdocs.dangerouslyAllow*` options apply to both, so
  loosening the allowlist for one loosens it for the other.
- Sites are published to the configured storage, with a search index in the
  format the TechDocs search collator reads.
- The `techdocs.generator.runIn`, `pullImage` and `pullOptions` settings apply
  to both. Each engine has its own Docker image setting.
