---
'@backstage/plugin-catalog-import': minor
---

Make filename, branch name and examples URLs used in catalog import customizable.

Catalog backend ingestion loop can be already configured to fetch targets with custom catalog filename (other than `catalog-info.yaml`). It's now possible to customize said filename and branch name used in pull requests created by catalog import flow too. This allows organizations to further customize Backstage experience and to better reflect their branding.

Filename (default: `catalog-info.yaml`) and branch name (default: `backstage-integration`) used in pull requests can be configured in `app-config.yaml` as follows:

```yaml
// app-config.yaml

catalog:
  import:
    entityFilename: anvil.yaml
    pullRequestBranchName: anvil-integration
```

Following React components have also been updated to accept optional props for providing example entity and repository paths:

```tsx
<StepInitAnalyzeUrl
  ...
  exampleLocationUrl="https://github.com/acme-corp/our-awesome-api/blob/main/anvil.yaml"
/>
```

```tsx
<ImportInfoCard
  exampleLocationUrl="https://github.com/acme-corp/our-awesome-api/blob/main/anvil.yaml"
  exampleRepositoryUrl="https://github.com/acme-corp/our-awesome-api"
/>
```
