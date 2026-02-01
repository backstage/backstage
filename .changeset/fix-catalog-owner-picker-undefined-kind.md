---
'@backstage/plugin-catalog-react': patch
---

Fixed `EntityOwnerPicker` crash when owner entity references have undefined kind. The `humanizeEntityRef` function now gracefully handles undefined kind values instead of throwing a TypeError.
