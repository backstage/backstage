---
'@backstage/plugin-scaffolder-common': minor
---

Added support for `when` conditions on parameter step entries. This allows template authors to conditionally show or hide wizard steps based on answers from earlier steps using the `${{ parameters.fieldName === 'value' }}` expression syntax. Conditions use Nunjitsu 0.7.0 in both the frontend and backend, including built-in filters, comparisons, and the `not` keyword. Invalid conditions keep the step visible so its parameters are still validated.

Added the alpha `filterHiddenStepValues` helper to exclude values owned only by hidden parameter steps. Filtering supports nested fields, array items, and local schema references while preserving shared fields and the original form data.
