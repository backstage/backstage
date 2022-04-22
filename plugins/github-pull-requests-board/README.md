# github-pull-requests-board

Welcome to the github-pull-requests-board plugin!

This plugin will help you and your team stay on top of open pull requests, hopefully reducing the time from open to merged. It's particularly useful when your team deals with many repositories.

## Getting started

The plugin exports the **TeamPullRequestsTable** component which should be added into the Team page level, so it can consume the backstage **"team"** entity.

```javascript
import { TeamPullRequestsTable } from '@backstage/plugin-github-pull-requests-board';

<TeamPullRequestsTable />;
```
