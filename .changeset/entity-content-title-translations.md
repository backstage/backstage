---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added translation message references to the `EntityContentBlueprint` title parameter. Entity content titles update with the selected language in both catalog layouts, including tab labels, grouped tab ordering, and the active document title, while preserving page state. Title groups wait for the initial selected-language translations, then retain their resolved titles while later languages load, including during entity refreshes. Plain title strings remain supported and configured titles continue to supply plain title metadata.
