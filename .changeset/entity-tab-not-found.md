---
'@backstage/plugin-catalog': patch
---

Fixed an issue where navigating to an unknown sub-path on an entity page (for example `/catalog/default/component/foo/blob`) would silently render the first available route. Unknown paths now show a "Route not found" panel instead.
