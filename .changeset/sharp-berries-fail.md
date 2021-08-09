---
'@backstage/create-app': patch
---

Add a complete prettier setup to the created project. Prettier used to only be added as a dependency to create apps, but there wasn't a complete setup included that makes it easy to run prettier. That has now changed, and the new `prettier:check` command can be used to check the formatting of the files in your created project.

To apply this change to an existing app, a couple of changes need to be made.

Create a `.prettierignore` file at the root of your repository with the following contents:

```
dist
dist-types
coverage
.vscode
```

Next update the root `package.json` by bumping the prettier version and adding the new `prettier:check` command:

```diff
   "scripts": {
     ...
+    "prettier:check": "prettier --check .",
     ...
   },
   ...
   "dependencies": {
     ...
-    "prettier": "^1.19.1"
+    "prettier": "^2.3.2"
   }
```

Finally run `yarn prettier --write .` on your project to update the existing formatting.
