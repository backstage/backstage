# @backstage/plugin-techdocs-backend-module-zensical

A module for the TechDocs backend that adds [Zensical](https://zensical.org) as a documentation engine alongside MkDocs.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-techdocs-backend-module-zensical
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@backstage/plugin-techdocs-backend-module-zensical'));
```

## Usage

Opt an entity in with an annotation:

```yaml
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
    backstage.io/techdocs-engine: zensical
```

Or make Zensical the default for all entities without an annotation:

```yaml
techdocs:
  generator:
    defaultEngine: zensical
```

## Configuration

```yaml
techdocs:
  generator:
    runIn: docker # or 'local' to use a zensical binary on the PATH
    zensical:
      # Defaults to ghcr.io/backstage/techdocs-zensical
      dockerImage: ghcr.io/backstage/techdocs-zensical:latest
```

Zensical reads the same `mkdocs.yml` as MkDocs. It is sanitized with the same allowlist as the MkDocs engine, and `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` / `dangerouslyAllowAdditionalPlugins` apply to both.
