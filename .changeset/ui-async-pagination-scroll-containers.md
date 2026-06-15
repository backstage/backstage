---
'@backstage/ui': patch
---

Fixed async pagination in `Combobox` and `Select` popovers so additional pages load as users scroll instead of loading every page immediately. `Combobox` now uses `.bui-PopoverContent` as its scroll container, while all `Select` variants use the new `.bui-SelectResults` results container.

Searchable `Select` keeps its search field fixed while results scroll. The new public classes `.bui-SelectContent` and `.bui-SelectResults` expose this layout for theme customization.

**Affected components:** Combobox, Select
