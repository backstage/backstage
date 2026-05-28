---
'@backstage/core-components': patch
---

Added the correctly-spelled `'header'` literal to the `TableFiltersClassKey` union type and deprecated the previous typoed `'heder'` literal. The generated CSS class with the old key is preserved for backwards compatibility; switch to `'header'` to avoid future removal.
