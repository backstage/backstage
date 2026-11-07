---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added translation message references to the `EntityContentBlueprint` title parameter. Entity content titles update with the selected language in both catalog layouts, including tab labels, grouped tab ordering, and the active document title, while preserving page state. Groups of titles update together once their required translation resources are ready. Plain title strings remain supported and configured titles provide a fallback until translations resolve.
