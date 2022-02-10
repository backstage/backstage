---
'@backstage/catalog-client': minor
---

Fixed the return type of the catalog API `getEntityAncestors`, to match the
actual server response shape.

While this technically is a breaking change, the old shape has never worked at
all if you tried to use it - so treating this as an immediately-shipped breaking
bug fix.
