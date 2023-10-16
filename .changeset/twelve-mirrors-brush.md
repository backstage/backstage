---
'@backstage/cli': patch
---

The experimental package discovery will now always use the package name for include and exclude filtering, rather than the full module id. Entries pointing to a subpath export will now instead have an `export` field specifying the subpath that the import is from.
