---
'@backstage/plugin-search': patch
---

Fixes `SearchModal` and `HomePageSearchBar` components to use search bar reference value when "enter" is pressed, avoiding waiting for query state debounce.
