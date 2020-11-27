---
'@backstage/catalog-model': patch
---

Marked the field `spec.implementsApis` on `Component` entities for deprecation on Dec 14th, 2020.

Code that consumes these fields should remove those usages as soon as possible and migrate to using
relations instead. Producers should fill the field `spec.providesApis` instead, which has the same
semantic.

After Dec 14th, the fields will be removed from types and classes of the Backstage repository. At
the first release after that, they will not be present in released packages either.

If your catalog-info.yaml files still contain this field after the deletion, they will still be
valid and your ingestion will not break, but they won't be visible in the types for consuming code, and the expected relations will not be generated based on them either.
