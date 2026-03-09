---
'@backstage/ui': minor
---

**BREAKING**: Removed deprecated types `ComponentDefinition`, `ClassNamesMap`, `DataAttributeValues`, and `DataAttributesMap` from the public API. These were internal styling infrastructure types that have been replaced by the `defineComponent` system.

**Migration:**

Remove any direct usage of these types. Component definitions now use `defineComponent()` and their shapes are not part of the public API contract.

```diff
- import type { ComponentDefinition, ClassNamesMap } from '@backstage/ui';
```

If you were reading `definition.dataAttributes`, use `definition.propDefs` instead — props with `dataAttribute: true` in `propDefs` are the equivalent.
