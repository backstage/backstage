---
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-home': patch
---

Added missing exports to surface recently added plugin changes as follows:
`@backstage/plugin-scaffolder-react`

- add exports needed to override template styles for `BackstageTemplateStepper` and `ScaffolderReactTemplateCategoryPicker`

`@backstage/plugin-home`

- add exports needed to have a valid `import { QuickStartCard } from '@backstage/plugin-home';`
