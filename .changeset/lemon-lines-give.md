---
'@backstage/integration': minor
---

The AzureUrl class in the @backstage/integration package is now able to process BOTH git branches and git tags. Initially this class only processed git branches and threw an error when non-branch Azure URLs were passed in.
