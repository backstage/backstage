---
'@backstage/cli-module-new': patch
---

Template version hints are now treated as a minimum version. When the lockfile already contains a range for a dependency that resolves to the hinted version or newer, `backstage-cli new` reuses the highest such range instead of adding an older one, which avoids duplicate dependency versions.
