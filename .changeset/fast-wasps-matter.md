---
'@backstage/create-app': patch
---

Updated the search configuration class to use the static `fromConfig`-based constructor for the `DefaultCatalogCollator`.

To apply this change to an existing app, replace the following line in `search.ts`:

```diff
-collator: new DefaultCatalogCollator({ discovery })
+collator: DefaultCatalogCollator.fromConfig(config, { discovery })
```

The `config` parameter was not needed before, so make sure you also add that in the signature of `createPlugin`
in `search.ts`:

```diff
export default async function createPlugin({
  logger,
  discovery,
+  config,
}: PluginEnvironment) {
```
