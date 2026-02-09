---
'@backstage/cli': minor
---

Added support for CSS exports in package builds. When a package declares a CSS file in its `exports` field, the CLI will now automatically bundle it during `backstage-cli package build` using postcss-import, and rewrite the export path from `src/` to `dist/` at publish time. This allows packages to include standalone CSS files without custom build scripts.
