---
'@backstage/plugin-catalog-react': patch
---

Fixed a performance issue where all components reading the entity context on an entity page would rerender unnecessarily whenever the page rendered again without the entity data having changed, for example when a URL query parameter changed. This was particularly noticeable when switching tabs in the entity inspector dialog, which caused the entire underlying page to rerender.
