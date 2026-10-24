---
'@backstage/ui': patch
---

Added an `external` prop to `Link`. External links show an external link icon after the link text and always open in a new tab with `rel="noopener noreferrer"`, regardless of any `target` passed. By default (`external="auto"`), links whose `href` starts with `http://` or `https://` are treated as external, while other schemes such as `mailto:` are not. Use `external="always"` (or `true`) to force the external behavior, and `external="no"` (or `false`) to opt out of it, for example for `https://` links that should stay plain.

**Affected components:** Link
