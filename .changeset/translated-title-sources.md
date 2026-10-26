---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Added runtime title sources for page headers, navigation, tabs, and breadcrumbs. Translation refs are now callable message selectors with type-checked keys. Page and sub-page blueprints accept the resulting `TranslationRefTuple` object in their `title` parameter, using existing translation resources. The plain title remains a static fallback, while participating consumers follow the optional `coreExtensionData.titleSource`. Resolved translations take precedence over configured titles, and language changes preserve page state.
