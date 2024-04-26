# CircleCI Plugin

> [!IMPORTANT]
> This plugin is now developed & maintained by CircleCI. Please refer to [their up-to-date documentation](https://github.com/CircleCI-Public/backstage-plugin) & [plugin repository](https://github.com/CircleCI-Public/backstage-plugin/) for help.

## Screenshots

<img src="./src/assets/screenshot-pipeline-list.png" />
<img src="./src/assets/screenshot-build-details.png" />
<img src="./src/assets/screenshot-build-failure.png" />

## Setup

1. If you have a standalone app (you didn't clone this repo), then do

```bash
# From your Backstage root directory
yarn --cwd packages/app add @circleci/backstage-plugin
```

2. Add the `EntityCircleCIContent` extension to the entity page in your app:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityCircleCIContent,
  isCircleCIAvailable,
} from '@circleci/backstage-plugin';

// For example in the CI/CD section
const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isCircleCIAvailable}>
      <EntityCircleCIContent />
    </EntitySwitch.Case>
```

4. Add proxy config:

```yaml
# In app-config.yaml
proxy:
  '/circleci/api':
    target: https://circleci.com/api/v1.1
    headers:
      Circle-Token: ${CIRCLECI_AUTH_TOKEN}
```

5. Get and provide a `CIRCLECI_AUTH_TOKEN` as an environment variable (see the [CircleCI docs](https://circleci.com/docs/api/#add-an-api-token)).
6. Add an annotation to your respective `catalog-info.yaml` files, with the format `circleci.com/project-slug: <git-provider>/<owner>/<project>` (See reference in [ADR002](https://backstage.io/docs/architecture-decisions/adrs-adr002#format)).

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    # This also supports bitbucket/xxx/yyy
    circleci.com/project-slug: github/my-org/my-repo
spec:
  type: service
  # ...
```

## Features

- List top 50 builds for a project
- Dive into one build to see logs
- Polling (logs only)
- Retry builds
- Works for both project and personal tokens
- Pagination for builds

## Limitations

- CircleCI has pretty strict rate limits per token, be careful with opened tabs
- CircleCI doesn't provide a way to auth by 3rd party (e.g. GitHub) token, nor by calling their OAuth endpoints, which currently stands in the way of better auth integration with Backstage (reference [feature request](https://ideas.circleci.com/api-feature-requests/p/allow-circleci-api-calls-using-github-auth) and [discussion topic](https://discuss.circleci.com/t/circleci-api-authorization-with-github-token/5356))
