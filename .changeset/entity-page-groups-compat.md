---
'@backstage/core-compat-api': patch
---

Fixed `collectEntityPageContents` to preserve `EntityLayout.Group` information when converting legacy entity pages to the new frontend system. Routes inside groups now correctly receive the `group` parameter in the resulting `EntityContentBlueprint` extensions.
