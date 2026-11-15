---
'@backstage/frontend-plugin-api': patch
---

Page and sub-page blueprints now accept typed translation message selections in their `title` parameter, using existing translation resources. Select a message by calling a translation ref, for example `myTranslationRef('page.title')`. TypeScript checks the key and rejects messages that require formatting values.

Resolved translations take precedence over configured titles in every language, including the default language. Titles wait for the selected language on first load and retain resolved values during later loads or failures, preserving page state.

`TranslationRef` values are now callable functions. Treat refs as opaque values rather than checking for plain objects or cloning them.
