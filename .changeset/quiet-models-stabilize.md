---
'@backstage/catalog-model': patch
---

Fixed several issues in the alpha catalog model layer system. Schema updates now preserve sibling field validation when changing a property named `type`, support deleting inherited fields and constraints, and retain literal JSON values in `const` and `default`. Kind schemas without an explicit root type retain their fields, and invalid combined schemas are rejected during model compilation. Empty kind descriptions and reverse relation titles are now applied correctly.
