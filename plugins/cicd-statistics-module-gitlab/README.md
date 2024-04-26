# cicd-statistics-module-gitlab

This is an extension module to the `cicd-statistics` plugin, providing a `CicdStatisticsApiGitlab` that you can use to extract the CI/CD statistics from your Gitlab repository.

## Getting started

1. Install the `cicd-statistics` and `cicd-statistics-module-gitlab` plugins in the `app` package.

2. Configure your ApiFactory:
   - You can optionally pass in a second argument to `CicdStatisticsApiGitlab` of type [CicdDefaults](https://github.com/backstage/backstage/blob/2881c53cb383bf127c150f837f37fe535d8cf97b/plugins/cicd-statistics/src/apis/types.ts#L179) to alter the default CICD UI configuration

```tsx
// packages/app/src/apis.ts
import { gitlabAuthApiRef } from '@backstage/core-plugin-api';

import { cicdStatisticsApiRef } from '@backstage/plugin-cicd-statistics';
import { CicdStatisticsApiGitlab } from '@backstage/plugin-cicd-statistics-module-gitlab';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: cicdStatisticsApiRef,
    deps: { gitlabAuthApi: gitlabAuthApiRef },
    factory({ gitlabAuthApi }) {
      return new CicdStatisticsApiGitlab(gitlabAuthApi);
    },
  }),
];
```

3. Add the component to your EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityCicdStatisticsContent } from '@backstage/plugin-cicd-statistics';

<EntityLayout.Route path="/ci-cd-statistics" title="CI/CD Statistics">
  <EntityCicdStatisticsContent />
</EntityLayout.Route>;
```
