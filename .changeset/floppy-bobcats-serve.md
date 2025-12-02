---
'@backstage/core-components': patch
---

Fixed bug in the `LogViewer` component where shift + click always opened a new window instead of just changing the selection.

In addition, improved the `LogViewer` component by a few usability enhancements:

- Added support for multiple selections using cmd/ctrl + click
- Improved the generated hash that is added to the URL to also support ranges & multiple selections
- Added an hover effect & info tooltip to the "Copy to clipboard" button to indicate its functionality
- Added some color and a separator to the line numbers to improve readability
