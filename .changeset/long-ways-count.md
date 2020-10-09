---
'@backstage/plugin-techdocs-backend': minor
'@backstage/create-app': patch
---

Updated naming of environment variables. New pattern [NAME]\_TOKEN for Github, Gitlab, Azure & Github enterprise access tokens.

### Detail:

- Previously we have to export same token for both, catalog & scaffolder

```bash
export GITHUB_ACCESS_TOKEN=foo
export GITHUB_PRIVATE_TOKEN=foo
```

with latest changes, only single export is sufficient.

```bash
export GITHUB_TOKEN=foo
export GITLAB_TOKEN=foo
export GHE_TOKEN=foo
export AZURE_TOKEN=foo
```

### list:

<table>
  <tr>
    <th>Old name</th>
    <th>New name</th>
  </tr>
  <tr>
    <td>GITHUB_ACCESS_TOKEN</td>
    <td>GITHUB_TOKEN</td>
  </tr>
  <tr>
    <td>GITHUB_PRIVATE_TOKEN</td>
    <td>GITHUB_TOKEN</td>
  </tr>
  <tr>
    <td>GITLAB_ACCESS_TOKEN</td>
    <td>GITLAB_TOKEN</td>
  </tr>
  <tr>
    <td>GITLAB_PRIVATE_TOKEN</td>
    <td>GITLAB_TOKEN</td>
  </tr>
  <tr>
    <td>AZURE_PRIVATE_TOKEN</td>
    <td>AZURE_TOKEN</td>
  </tr>
  <tr>
    <td>GHE_PRIVATE_TOKEN</td>
    <td>GHE_TOKEN</td>
  </tr>
</table>
