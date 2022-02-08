---
'@backstage/cli': patch
---

Rather than calling `yarn pack`, the `build-workspace` and `backend-bundle` commands now move files directly whenever possible. This cuts out several `yarn` invocations and speeds the packing process up by several orders of magnitude.
