---
'@backstage/create-app': patch
---

Due to a package name change from `@kyma-project/asyncapi-react` to
`@asyncapi/react-component` the jest configuration in the root `package.json`
has to be updated:

```diff
   "jest": {
     "transformModules": [
-      "@kyma-project/asyncapi-react
+      "@asyncapi/react-component"
     ]
   }
```
