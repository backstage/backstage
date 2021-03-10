---
'@backstage/create-app': patch
---

Adds "yarn dev" command to simplify local development.

To add the command to an existing application, first add it to the `scripts`
section of your monorepo root `package.json` like so:

```diff
 "scripts": {
+    "dev": "concurrently \"yarn start\" \"yarn start-backend\"",
     "start": "yarn workspace app start",
     "start-backend": "yarn workspace backend start",
```

And then add the `concurrently` package to your monorepo, like so:

```sh
yarn add concurrently@6.0.0 --dev -W
```

Notes:

- This needs to be done to the monorepo root, not your frontend or backend package.
- The `--dev -W` will add it only to `devDependencies`, and force it to the monorepo main root.

You can then run `yarn dev` which will start both the Backstage frontend and backend in a single window.
