---
'@backstage/plugin-catalog-import': minor
---

Add i18n support for catalog-import plugin

`ImportStepper` component now supports i18n, it's `generateStepper` prop now
accepts a third `t: TranslationFunction<typeof catalogImportTranslationRef.T>`
function from `@backstage/core-plugin-api/alpha` and uses it to translate the
stepper steps, checkout `catalogImportTranslationRef` from `@backstage/plugin-catalog-import/alpha`
for more details.
