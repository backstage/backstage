---
'@backstage/plugin-scaffolder-common': minor
---

Added support for `when` conditions on parameter steps, allowing templates to show or hide wizard steps based on earlier answers, for example `${{ parameters.cloudProvider === 'AWS' }}`. Also added the alpha `resolveParameterSteps` and `filterHiddenStepValues` helpers for working out which steps are visible and removing values from hidden steps.
