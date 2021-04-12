---
'@backstage/create-app': patch
---

Fixing dependency resolution for problematic library `graphql-language-service-interface`.

This change might not have to be applied to your local installation, however if you run into this error:

```
Error: Failed to compile.
/tmp/backstage-e2e-uMeycm/test-app/node_modules/graphql-language-service-interface/esm/GraphQLLanguageService.js 100:23
Module parse failed: Unexpected token (100:23)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|         }
|         let customRules = null;
>         if (extensions?.customValidationRules &&
|             typeof extensions.customValidationRules === 'function') {
|             customRules = extensions.customValidationRules(this._graphQLConfig);
```

You can fix it by adding the following to the root `package.json`.

```json
...
"resolutions": {
  "graphql-language-service-interface": "2.8.2",
  "graphql-language-service-parser": "1.9.0"
 },
...
```
