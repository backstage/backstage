---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-extension-msgraph': patch
---

Move `MicrosoftGraphOrgReaderProcessor` from `@backstage/plugin-catalog-backend`
to `@backstage/plugin-catalog-backend-extension-msgraph`.

For now `MicrosoftGraphOrgReaderProcessor` is only deprecated in
`@backstage/plugin-catalog-backend`, but will be removed in the future. While it
is now registered by default, it has to be registered manually in the future.

TODO: Do we really want to deprecate the transformer before removing it?
It is actually pretty hard to switch to the new transformer as one has to call
`builder.replaceProcessors()` to replace ALL transformers.
As an alternative we can do a breaking change directly with the migration steps
(adding the dependency, adding an import and calling `builder.addProcessor()`).
