---
id: add-to-directory
title: Add to Directory
description: Documentation on Adding Plugin to Plugin Directory
---

:::caution Legacy Documentation

This section is part of the legacy plugins documentation. The process for
adding plugins to the directory described here is still current.

:::

## Add a plugin to the directory

To add a plugin to the [plugin directory](https://backstage.io/plugins), create
a manifest in
[`microsite/data/plugins`](https://github.com/backstage/backstage/tree/master/microsite/data/plugins).

### Create the manifest

1. Name the file `<plugin-slug>.yaml`. New filenames must use lowercase
   kebab-case, for example `example-monitoring.yaml`. The directory derives the
   plugin detail route from the filename, so this example is available at
   `/plugins/example-monitoring`. Do not add a `slug` key to the manifest.

1. Add the required contributor-owned fields:

   ```yaml
   ---
   title: Example Monitoring
   author: Example Inc.
   authorUrl: https://example.com
   category: Monitoring
   description: Shows service health and deployment activity.
   documentation: https://example.com/docs/backstage
   npmPackageName: '@example/backstage-plugin-monitoring'
   addedDate: '2026-08-03'
   status: active
   ```

   Set `status` to `active` for a new entry. The audit owns later changes to
   `status`.

1. Add any optional contributor-owned fields:

   | Field          | Type         | Description                                                                                                                                                                                 |
   | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `iconUrl`      | string       | An external URL or a path relative to `microsite/static`, such as `/img/example.svg`. The default is `/img/logo-gradient-on-dark.svg`. Use only an icon that you have the right to publish. |
   | `order`        | number       | The sort priority used by the directory.                                                                                                                                                    |
   | `capabilities` | string array | The plugin capabilities from the fixed vocabulary in [Declare capabilities](#declare-capabilities).                                                                                         |

1. Do not add or edit the audit-owned `staleSince` or `snapshot` keys. A new
   entry may omit `snapshot`. The audit populates it after the manifest is
   accepted. The audit also maintains `status` after its initial `active`
   value. See [Plugin Directory Audit](./plugin-directory-audit.md) for the
   generated field contract.

### Declare capabilities

Each `capabilities` entry must be one of these values:

- `entity-card`
- `entity-content`
- `standalone-page`
- `home-page`
- `search-result`
- `techdocs-addon`
- `catalog-processor`
- `catalog-provider`
- `scaffolder-actions`
- `search-collator`
- `backend-module`
- `permissions`
- `signals`

Unknown values fail manifest validation.

### Validation rules

The verifier rejects a manifest in these cases:

- **Unknown keys.** Every manifest object is strict, so a misspelled or extra
  key fails validation instead of being ignored.
- **Empty strings.** Required text fields, such as `title`, `description` and
  `npmPackageName`, must not be empty.
- **Invalid filenames.** The filename must be lowercase kebab-case with a
  `.yaml` extension, for example `example-monitoring.yaml`. The only exceptions
  are the legacy filenames `digital.ai-deploy.yaml`, `digital.ai-release.yaml`
  and `sds_workspace.yaml`. Do not add to this list.
- **Invalid dates.** `addedDate` must be a calendar date in `YYYY-MM-DD` form.
  You can write it with or without quotes, so `addedDate: 2026-08-03` and
  `addedDate: '2026-08-03'` are equivalent.

The verifier checks every manifest and reports all of the problems in one run.

### Validate the manifest

From the repository root, install dependencies and validate every manifest:

```shell
yarn install
node --require @backstage/cli/config/nodeTransform.cjs scripts/plugin-directory/verify.ts
```

The verifier reports the filename and field path for every invalid manifest. The
same command runs in continuous integration (CI).

## Submission tips

- Publish the package publicly on npm before you submit the manifest.
- Link the npm package to its source repository.
- Use an npm scope that matches the author organization or user when possible.
- If a plugin has frontend and backend packages, link `documentation` to the
  primary plugin guide.
- Include a product screenshot in the plugin documentation when available.
