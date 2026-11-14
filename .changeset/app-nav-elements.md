---
'@backstage/plugin-app': patch
---

The app navigation can now render content that plugins add through `NavElementBlueprint`. List the elements to show in the new `elements` config of `app/nav`, under `start` (before the page links) or `end` (after them), in the order you want. Elements that aren't listed don't render.
