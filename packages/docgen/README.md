# DocGen - API Reference Documentation Generator

The docgen package provides a CLI to generate markdown documentation for all exported ApiRefs in `@backstage/core`. The documentation is generated based on exported `ApiRef` instances and their type parameters.

The CLI supports generating both TechDocs and GitHub Markdown, where the TechDocs one provides some better linking and syntax highlighting.

## Usage

To generate markdown documentation in the top-level `docs/` directory, run the following:

```bash
yarn docgen
```

## TODO

This package was lifted out from the Spotify internal Backstage project and could use some further work:

- Use a higher-level TypeScript compiler library, e.g. `ts-morph`.
- Support for generating docs for any package or multiple packages.
- Better handling of self-referencing types in APIs, e.g. ConfigApi.
