---
'@backstage/frontend-plugin-api': patch
---

Page and sub-page blueprints now accept typed translation message selections in their `title` parameter. Translated title groups wait for their first selected-language translations before rendering. Later language changes update each group together while retaining previous titles and page state. Messages requiring replacement values or plural counts are rejected by TypeScript.

`TranslationRef` values are now callable functions for selecting message keys. Treat refs as opaque values rather than checking for plain objects or cloning them. Resolved translations take precedence over configured title metadata in every language, including the default language.

Failed title loads retain previously resolved titles, or use the translation API's available fallback messages if the group has not resolved yet. Failures are reported without replacing the page with an error boundary.
