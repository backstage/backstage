---
'@backstage/plugin-scaffolder-common': minor
---

Added support for `if` conditions on parameter step entries. This allows template authors to conditionally show or hide wizard steps based on answers from earlier steps using the `${{ parameters.fieldName === 'value' }}` expression syntax.
