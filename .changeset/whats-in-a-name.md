---
'@backstage/codemods': patch
---

Added an `extension-names` codemod, which adds a `name` key to all extensions
provided by plugins. Extension names are used to provide richer context to
events captured by the new Analytics API, and may also appear in debug output
and other situations.

To apply this codemod, run `npx @backstage/codemods apply extension-names` in
the root of your Backstage monorepo.
