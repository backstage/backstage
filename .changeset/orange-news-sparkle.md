---
'@backstage/integration': patch
'@backstage/plugin-catalog-backend': patch
---

Support ingesting multiple GitHub organizations via a new `GithubMultiOrgReaderProcessor`.

This new processor handles namespacing created groups according to the org of the associated GitHub team to prevent potential name clashes between organizations. Be aware that this processor is considered alpha and may not be compatible with future org structures in the catalog.

NOTE: This processor only fully supports auth via GitHub Apps

To install this processor, import and add it as follows:

```typescript
// Typically in packages/backend/src/plugins/catalog.ts
import { GithubMultiOrgReaderProcessor } from '@backstage/plugin-catalog-backend';
// ...
export default async function createPlugin(env: PluginEnvironment) {
  const builder = new CatalogBuilder(env);
  builder.addProcessor(
    GithubMultiOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
    }),
  );
  // ...
}
```

Configure in your `app-config.yaml` by pointing to your GitHub instance and optionally list which GitHub organizations you wish to import. You can also configure what namespace you want to set for teams from each org. If unspecified, the org name will be used as the namespace. If no organizations are listed, by default this processor will import from all organizations accessible by all configured GitHub Apps:

```yaml
catalog:
  locations:
    - type: github-multi-org
      target: https://github.myorg.com

  processors:
    githubMultiOrg:
      orgs:
        - name: fooOrg
          groupNamespace: foo
        - name: barOrg
          groupNamespace: bar
        - name: awesomeOrg
        - name: anotherOrg
```
