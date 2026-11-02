---
id: engines-zensical
title: Zensical Engine
description: Build TechDocs sites with Zensical using the techdocs-backend-module-zensical module
---

:::note Experimental

The Zensical engine is new and may change in minor releases. MkDocs remains
the default engine.

:::

[Zensical](https://zensical.org) is a documentation engine from the team
behind Material for MkDocs. It reads the same `mkdocs.yml` and `docs/` folder
as MkDocs, so existing TechDocs projects can switch engines without
restructuring. See [Documentation Engines](./engines.md) for how TechDocs
picks an engine.

## Install the module

Add the module to your backend:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-techdocs-backend-module-zensical
```

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-techdocs-backend'));
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-techdocs-backend-module-zensical'));
```

## Use Zensical for an entity

Annotate the entity:

```yaml title="catalog-info.yaml"
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
    # highlight-add-next-line
    backstage.io/techdocs-engine: zensical
```

Or make Zensical the default for every entity without an annotation:

```yaml title="app-config.yaml"
techdocs:
  generator:
    defaultEngine: zensical
```

Entities annotated with `backstage.io/techdocs-engine: mkdocs` keep using
MkDocs either way.

## Configuration

```yaml title="app-config.yaml"
techdocs:
  generator:
    runIn: docker # or 'local'
    zensical:
      dockerImage: ghcr.io/backstage/techdocs-zensical:<tag>
```

### Docker image

`techdocs.generator.zensical.dockerImage`

(Optional) The image used when `runIn` is `docker`. Defaults to a pinned
release of `ghcr.io/backstage/techdocs-zensical`. If you set it, pin a release
tag rather than `latest`, so builds don't change when a new image is
published. TechDocs always runs the `zensical` command in the container,
regardless of the image's entrypoint.

Zensical builds ignore `techdocs.generator.dockerImage`, because that setting
is for the MkDocs image. If you use a custom MkDocs image, set
`zensical.dockerImage` separately.

### Running locally

With `runIn: local`, TechDocs runs `zensical` from the backend's `PATH`.
Install Zensical and the Markdown extensions TechDocs enables:

```bash
pip install zensical plantuml-markdown markdown-graphviz-inline mdx_truly_sane_lists
```

### Other settings

These generator settings also apply to Zensical builds:

- `techdocs.generator.pullImage` and `pullOptions`
- `techdocs.generator.mkdocs.legacyCopyReadmeMdToIndexMd`
- `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` and
  `dangerouslyAllowAdditionalPlugins`

These only affect MkDocs, and Zensical builds ignore them:
`omitTechdocsCorePlugin`, `defaultPlugins` and `disableExternalFonts`.

:::caution Shared allowlist

Zensical builds sanitize `mkdocs.yml` with the same allowlist as MkDocs. The
`dangerouslyAllowAdditionalKeys` and `dangerouslyAllowAdditionalPlugins`
settings live under `techdocs.generator.mkdocs` but apply to both engines, so
loosening the allowlist for one loosens it for the other.

:::

## How builds differ from MkDocs

MkDocs builds rely on the `techdocs-core` plugin, which Zensical can't load.
Instead, TechDocs writes the Zensical-specific changes below to a temporary
copy of `mkdocs.yml` for each build and removes it afterwards.

- TechDocs adds the Markdown extensions `techdocs-core` would have enabled,
  such as admonitions, tabs, snippets and PlantUML. If you configure one of
  them yourself, your options win, except for `pymdownx.snippets`: TechDocs
  ignores your snippets options and always sets `restrict_base_path: true`,
  so snippets can't include files from outside the project.
- TechDocs sets the theme to Material and keeps your other `theme` settings,
  except `palette` and `custom_dir`, which it removes so the TechDocs frontend
  can control light and dark mode. It keeps your `theme.features` and adds
  `navigation.footer`.
- TechDocs removes `techdocs-core` from `plugins` and keeps the rest.
- TechDocs converts Zensical's search output to the format the TechDocs
  search collator reads, so search works without changes.
- The "Edit this page" button doesn't work yet, because TechDocs doesn't set
  `repo_url` or `edit_uri` for Zensical builds.

## Preview locally with the CLI

The [TechDocs CLI](./cli.md) picks up the same annotation, or you can pass
`--engine`:

```bash
techdocs-cli serve --engine zensical
techdocs-cli generate --engine zensical
```

Without Docker, the CLI needs Zensical installed as described in
[Running locally](#running-locally).
