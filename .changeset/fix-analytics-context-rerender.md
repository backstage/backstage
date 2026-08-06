---
'@backstage/core-plugin-api': patch
---

Fixed a performance issue where all components using analytics, including every link, would rerender unnecessarily whenever a surrounding analytics context rendered again without its attributes having changed, for example when a URL query parameter changed on an entity page.
