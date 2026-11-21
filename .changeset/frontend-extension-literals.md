---
'@backstage/frontend-plugin-api': minor
---

Extensions made with the `make` method of a blueprint, and plugins created with `createFrontendPlugin`, now record the literal values that they were created with in a type-only `literals` property, described by the new `ExtensionDefinitionLiterals` and `FrontendPluginLiterals` types. This includes the literal params and the names of all params of an extension, its `attachTo`, `disabled` and `if` options, the blueprint it was made with for `PageBlueprint`, `SubPageBlueprint` and `ApiBlueprint`, and the ID, title and extension IDs of a plugin. For `ApiBlueprint`, the IDs of the API ref and its dependencies are recorded, along with whether the ref declares the API as a promise. The property never exists at runtime. It lets tools read what a plugin declares from its emitted type declarations, without running the plugin code.

`createRouteRef` now accepts an optional `id`, which is recorded in the type of the route ref. When a route ref that was created with an ID is passed to a page or sub-page, the ID is recorded in the literals of the extension, so that tools can tell which route of a plugin a page uses. Use an ID that is unique among the routes of the plugin.
