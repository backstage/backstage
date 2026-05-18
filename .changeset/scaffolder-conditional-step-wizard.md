---
'@backstage/plugin-scaffolder-react': minor
---

Added conditional step visibility in the scaffolder wizard. Parameter steps with a `when` field are now shown or hidden based on the current form state. When a step is hidden, its field values are excluded from the submitted parameters. Supports `${{ parameters.fieldName === 'value' }}` expression syntax, boolean values, and simple truthiness checks.
