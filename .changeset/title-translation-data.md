---
'@backstage/frontend-plugin-api': patch
---

Added `coreExtensionData.titleTranslation` for extensions to provide a translation message selection alongside their static title. Its `TranslationRefTuple<undefined>` type rejects messages that require formatting values. UI consumers can opt in to translating the selection through the app translation API.
