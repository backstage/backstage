---
'@backstage/plugin-catalog': patch
---

Fixed a React rules of hooks violation in the About card's icon link rendering. The `useProps()` hook for each `EntityIconLinkBlueprint` is now always called regardless of the filter result, preventing crashes when navigating between entities with different filter outcomes.
