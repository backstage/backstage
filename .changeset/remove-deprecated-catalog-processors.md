---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Removed the deprecated `CodeOwnersProcessor` and `AnnotateScmSlugEntityProcessor` exports. To retain their behavior, install and register the corresponding community backend module:

- `CodeOwnersProcessor`: [`@backstage-community/plugin-catalog-backend-module-codeowners`](https://github.com/backstage/community-plugins/tree/main/workspaces/catalog/plugins/catalog-backend-module-codeowners)
- `AnnotateScmSlugEntityProcessor`: [`@backstage-community/plugin-catalog-backend-module-annotate-scm-slug`](https://github.com/backstage/community-plugins/tree/main/workspaces/catalog/plugins/catalog-backend-module-annotate-scm-slug)

Add the module to your backend with `backend.add(import('<module-package>'))` and remove the custom registration of the old processor. For explicit processor configuration, follow the replacement module's documentation.
