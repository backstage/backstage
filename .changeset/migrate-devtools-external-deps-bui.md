---
'@backstage/plugin-devtools': patch
---

Migrated the `ExternalDependenciesContent` component to use BUI components. The table now uses BUI `Table` instead of the `Table` from `@backstage/core-components`, and layout elements use BUI `Box`, `Card`, `Flex`, and `Text` instead of Material UI equivalents. Status icons from `@backstage/core-components` are preserved.
