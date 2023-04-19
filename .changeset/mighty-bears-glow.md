---
'@backstage/plugin-search-react': minor
'@backstage/plugin-search': minor
---

Add close button & improve search input.

MUI's Paper wrapping the SearchBar in the SearchPage was removed, we recommend users update their apps accordingly.

SearchBarBase's TextField's label support added & aria-label uses label string if present, tests relying on the default placeholder value should still work unless custom placeholder was given.
