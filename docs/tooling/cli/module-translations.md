---
id: module-translations
title: Translations Module
description: CLI commands for managing translation messages.
---

The translations module (`@backstage/cli-module-translations`) provides commands
for exporting and importing translation messages, supporting the
internationalization workflow for Backstage apps. For more details on the
translation workflow, see the
[Internationalization](../../plugins/internationalization.md) documentation.

## translations export

Export translation messages from an app and all of its frontend plugins to JSON
files. This command must be run from within a package directory (for example
`packages/app`), not from the repository root.

The command discovers all `TranslationRef` definitions in the dependency tree,
extracts their default messages using the TypeScript type system, and writes
them as JSON files along with a manifest.

```text
Usage: backstage-cli translations export [options]

Options:
  --output <dir>       Output directory for exported messages and manifest (default: "translations")
  --pattern <pattern>  File path pattern for message files relative to the output
                       directory, with {id} and {lang} placeholders
                       (default: "messages/{id}.{lang}.json")
  -h, --help           display help for command
```

### Examples

Export translations with default settings:

```bash
cd packages/app
yarn backstage-cli translations export
```

Export with language-based directory grouping:

```bash
yarn backstage-cli translations export --pattern '{lang}/{id}.json'
```

## translations import

Generate translation resource wiring code from translated JSON files. Reads the
manifest and translated message files produced by `translations export`, and
generates a TypeScript module that creates `TranslationResource` objects for each
translated ref.

The file pattern used during export is stored in the manifest and automatically
used by the import command.

```text
Usage: backstage-cli translations import [options]

Options:
  --input <dir>    Input directory containing the manifest and translated message files (default: "translations")
  --output <path>  Output path for the generated wiring module (default: "src/translations/resources.ts")
  -h, --help       display help for command
```

### Examples

Generate wiring code with default settings:

```bash
cd packages/app
yarn backstage-cli translations import
```
