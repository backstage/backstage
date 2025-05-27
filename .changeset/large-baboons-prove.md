---
'@backstage/plugin-catalog': minor
---

Add support to customize the about card icon links via `EntityIconLinkBlueprint` and provide a default catalog view catalog source, launch scaffolder template and read techdocs docs icon links extensions.

**BREAKING**

The `Scaffolder` launch template and `TechDocs` read documentation icons have been extracted from the default `Catalog` about card links and are now provided respectively by the `Scaffolder` and `TechDocs` plugins in the new frontend system. If you are trying out the new frontend system and are using a translation for these link titles other than the default, you should now translate them using the scaffolder translation reference or the TechDocs translation reference (the translation keys are still the same, `aboutCard.viewTechdocs` and `aboutCard.launchTemplate`).
