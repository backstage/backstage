---
'@backstage/plugin-scaffolder': patch
---

Fixed that adding more than one `allowedOwner` or `allowedRepo` in the template config will now still set the first value as default in the initial form state of `RepoUrlPicker`.
