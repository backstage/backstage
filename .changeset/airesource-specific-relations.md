---
'@backstage/catalog-model': minor
---

Updated the alpha `AiResource` model to use distinct `hasSkill`/`skillOf` and `hasPlugin`/`pluginOf` relations for plugin and marketplace membership. The standard `partOf`/`hasPart` relations are now reserved for `spec.system`, allowing relation consumers to determine the meaning of an edge without fetching related entities.
