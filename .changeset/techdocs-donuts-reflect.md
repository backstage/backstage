---
'@backstage/plugin-techdocs-react': patch
---

Add a shared context for the `TechDocsReaderPageContent`, it was extracted from `@backstage/plugin-techdocs` package to be used by `mkdocs` packages and future new `renderers`, (e.g. `mdx`).

Decouple core `techdocs` packages from `mkdocs` implementation:

- The `useShadowRoot` was deprecated, we now recommend get or set `shadowRoot` using `useMkdocsReaderPage` exported by `@backstage/plugin-techdocs-mkdocs-react`;
- The `useShadowRootElements` was deprecated, we now recommend to use `useTechDocsShadowRootElements` which receives the `shadowRoot` as second parameter;
- The `useShadowRootSelection` was deprecated, we now recommend to use `useTechDocsShadowRootSelection` which receives the `shadowRoot` as second parameter.

This function and variable have been renamed, so their previous names are deprecated:

- `useTechDocsShadowDomStylesLoading` instead of `useShadowDomStylesLoading`;
- `TECHDOCS_SHADOW_DOM_STYLE_LOAD_EVENT` instead of `SHADOW_DOM_STYLE_LOAD_EVENT`.
