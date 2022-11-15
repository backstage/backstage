---
'@backstage/create-app': patch
---

The `build` script in the root `package.json` has been split into two separate scripts, `build:backend` and `build:all`. This is to more accurately reflect what is being built, to avoid confusion.

If you want to build the project for a production deployment, you will want to use `build:backend`, as this builds both the frontend and backend package. If you are not using the `app-backend` plugin you will want to add your own `build:frontend` script, to which you can pass additional configuration parameters if needed.

The `build:all` script is useful if you simply want to check that it is possible to build all packages in the project. This might be useful as a CI check, but is generally unnecessary.

If you want to publish the packages in your repository you can add a `build:packages` script that calls `backstage-cli repo build`. This will skip the frontend and backend packages builds, as those are quite time consuming.

To apply these changes to an existing project, make the following change to the root `package.json` file:

```diff
-    "build": "backstage-cli repo build --all",
+    "build:backend": "yarn workspace backend build",
+    "build:all": "backstage-cli repo build --all",
```

There are also a couple of places where documentation has been updated, see the [upgrade helper](https://backstage.github.io/upgrade-helper/?to=1.8.0) for a full list of changes.
