---
'@backstage/ui': patch
---

Fixed `Header` so its title and `customActions` stay aligned with the page edges on very wide viewports. Previously, on screens wider than 1920px the header content was centered with empty gutters on either side, making it appear shifted inward relative to the page body below.
