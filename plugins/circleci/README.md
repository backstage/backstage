# CircleCI Plugin

Website: [https://circleci.com/](https://circleci.com/)

<img src="./src/assets/screenshot-1.png" />
<img src="./src/assets/screenshot-2.png" />

## Setup

0. If you have standalone app (you didn't clone this repo), then do

```bash
yarn add @backstage/plugin-circleci
```

1. Add plugin API to your Backstage instance:

```js
// packages/app/src/api.ts
import { ApiHolder } from '@backstage/core';
import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';

const builder = ApiRegistry.builder();
builder.add(circleCIApiRef, new CircleCIApi(/* optional custom url for your own CircleCI instance */));

export default builder.build() as ApiHolder;
```

2. Add plugin itself:

```js
// packages/app/src/plugins.ts
export { plugin as Circleci } from '@backstage/plugin-circleci';
```

3. Register the plugin router:

```jsx
// packages/app/src/components/catalog/EntityPage.tsx

import { Router as CircleCIRouter } from '@backstage/plugin-circleci';

// Then somewhere inside <EntityPageLayout>
<EntityPageLayout.Content
  path="/ci-cd/*"
  title="CI/CD"
  element={<CircleCIRouter />}
/>;
```

4. Add proxy config:

```
// app-config.yaml
proxy:
  '/circleci/api':
    target: https://circleci.com/api/v1.1
    changeOrigin: true
    pathRewrite:
      '^/proxy/circleci/api/': '/'
    headers:
      Circle-Token:
        $secret:
          env: CIRCLECI_AUTH_TOKEN
```

5. Get and provide `CIRCLECI_AUTH_TOKEN` as env variable (https://circleci.com/docs/api/#add-an-api-token)
6. Add `circleci.com/project-slug` annotation to your component-info.yaml file in format <git-provider>/<owner>/<project> (https://backstage.io/docs/architecture-decisions/adrs-adr002#format)

## Features

- List top 50 builds for a project
- Dive into one build to see logs
- Polling (logs only)
- Retry builds
- Works for both project and personal tokens
- Pagination for builds

## Limitations

- CircleCI has pretty strict rate limits per token, be careful with opened tabs
- CircelCI doesn't provide a way to auth by 3rd party (e.g. GitHub) token, nor by calling their OAuth endpoints, which currently stands in the way of better auth integration with Backstage (https://discuss.circleci.com/t/circleci-api-authorization-with-github-token/5356)
