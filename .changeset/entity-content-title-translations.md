---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added translation message references to the `EntityContentBlueprint` title parameter. Entity content titles update with the selected language in both catalog layouts, including tab labels, grouped tab ordering, and the active document title, while preserving page state. Title groups wait for the initial selected-language translations, then retain their resolved titles while later languages load, including during entity refreshes. Existing visible content and form state stay intact while newly visible translated tabs wait for their title group. Direct navigation to a pending tab shows loading. Plain title strings remain supported and configured titles continue to supply plain title metadata. Resolved API translations win over configured title metadata in every language, including the default language. Title-resource failures preserve resolved titles, using the API fallback if a group has not yet resolved.
