---
id: module-github
title: GitHub Module
description: CLI command for creating GitHub Apps for Backstage integration.
---

The GitHub module (`@backstage/cli-module-github`) provides a command for
creating GitHub Apps in your organization, as an alternative to token-based
GitHub integration.

## create-github-app

Creates a GitHub App in your GitHub organization. This is an alternative to
token-based [GitHub integration](../../integrations/github/locations.md). See
[GitHub Apps for Backstage Authentication](../../integrations/github/github-apps.md).

Launches a browser to create the App through GitHub and saves the result as a
YAML file that can be referenced in the GitHub integration configuration.

```text
Usage: backstage-cli create-github-app <github-org>
```
