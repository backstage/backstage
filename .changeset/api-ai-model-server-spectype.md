---
'@backstage/catalog-model': minor
---

Added `spec.type: 'ai-model-server'` as a structured subtype of the `API` kind under `v1alpha1`/`v1beta1`. AI model server entities use purpose-built fields (`serverType`, `serverUrl`, optional `requiresApiKey`, `apiEntityRef`, and `models`) instead of a string `definition`, for representing AI model server inference endpoints in the catalog. See RFC [#33060](https://github.com/backstage/backstage/issues/33060). New alpha exports: `AiModelServerApiEntity`, `aiModelServerApiEntityValidator`, and `isAiModelServerApiEntity`.
