---
'@backstage/frontend-plugin-api': patch
---

`PageBlueprint` and `SubPageBlueprint` now accept an optional `titleElement` param, alongside the existing `title` string. When provided, `titleElement` is used to render the page title, tab label, and breadcrumb entry instead of the plain string, and can be a React element that resolves its text at render time (for example via `useTranslationRef`), so the rendered title reacts to changes such as switching the app language.
