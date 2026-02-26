---
'@backstage/cli': patch
---

Added support for CSS exports in package builds. When a package declares a CSS file in its `exports` field (e.g., `"./styles.css": "./src/styles.css"`), the CLI will automatically bundle it during `backstage-cli package build`, resolving any `@import` statements. The export path is rewritten from `src/` to `dist/` at publish time.

Fixed `backstage-cli repo fix` to not add `typesVersions` entries for non-script exports like CSS files.
