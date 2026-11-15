---
'@backstage/cli-module-new': patch
---

Template version hints are now treated as a minimum version within their caret range, that is the same major version, or the same minor version for `0.x` hints. When the lockfile already contains a range for a dependency that resolves to the hinted version or a newer compatible one, `backstage-cli new` reuses the highest such range instead of adding an older one, which avoids duplicate dependency versions.
