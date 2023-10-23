---
'@backstage/core-components': patch
---

Fixed compatibility with Safari <16.3 by eliminating RegEx lookbehind in `extractInitials`.

This PR also changed how initials are generated resulting in _John Jonathan Doe_ => _JD_ instead of _JJ_.
