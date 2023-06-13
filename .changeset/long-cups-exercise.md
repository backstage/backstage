---
'@backstage/plugin-explore-backend': patch
---

Allow to provide explore tools through config instead of data in code.

```yaml title="app-config.yaml"
explore:
  tools:
    - title: New Relic
      description: Observability platform built to help engineers create and monitor their software
      url: /newrelic
      image: https://i.imgur.com/L37ikrX.jpg
      tags:
        - newrelic
        - performance
        - monitoring
        - errors
        - alerting
    - title: CircleCI
      description: Provides builds overview, detailed build info and retriggering functionality for CircleCI.
      url: /circleci
      image: https://miro.medium.com/max/1200/1*hkTBp22vLAqlIHkrkZHPnw.png
      tags:
        - circleci
        - ci
        - dev
    # [...]
```

```diff title="packages/backend/src/plugins/explore.ts"
- import { ExploreTool } from '@backstage/plugin-explore-common';
- const exploreTools: ExploreTool[] = [
-   {
-     title: 'New Relic',
-     description: 'Observability platform built to help engineers create and monitor their software',
-     url: '/newrelic',
-     image: 'https://i.imgur.com/L37ikrX.jpg',
-     tags: ['newrelic', 'performance', 'monitoring', 'errors', 'alerting'],
-   },
-   {
-     title: 'CircleCI',
-     description: 'Provides builds overview, detailed build info and retriggering functionality for CircleCI.',
-     url: '/circleci',
-     image: 'https://miro.medium.com/max/1200/1*hkTBp22vLAqlIHkrkZHPnw.png',
-     tags: ['circleci', 'ci', 'dev'],
-   },
- ];
-
- StaticExploreToolProvider.fromData(tools)
+ StaticExploreToolProvider.fromData(env.config)
```
