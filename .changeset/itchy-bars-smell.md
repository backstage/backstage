---
'@backstage/ui': minor
---

Fixing styles on SearchField in Backstage UI after migration to CSS modules. `SearchField` has now its own set of class names. We previously used class names from `TextField` but this approach was creating some confusion so going forward in your theme you'll be able to theme `TextField` and `SearchField` separatly.
