---
'@backstage/plugin-search-react': minor
'@backstage/plugin-search': minor
---

Add close button & improve search input.

MUI's Paper wrapping the SearchBar in the SearchPage was removed, we recommend users update their apps accordingly.

SearchBarBase's TextField's placeholder was changed into a label, tests relying on the placeholder should be updated to query for the label instead.
