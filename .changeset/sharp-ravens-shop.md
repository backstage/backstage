---
'@backstage/integration': major
---

**BREAKING** Removed deprecated Azure DevOps, Bitbucket, Gerrit and GitHub code:

- For Azure Devops, the long deprecated `token` string and `credential` object have been removed from the `config.d.ts`. Use the `credentials` array object instead.
- For Bitbucket, the long deprecated `bitbucket` object has been removed from the `config.d.ts`. Use the `bitbucketCloud` or `bitbucketServer` objects instead.
- For Gerrit, the `parseGerritGitilesUrl` function has been removed, use `parseGitilesUrlRef` instead. The `buildGerritGitilesArchiveUrl` function has also been removed, use `buildGerritGitilesArchiveUrlFromLocation` instead.
- For GitHub, the `getGitHubRequestOptions` function has been removed.
