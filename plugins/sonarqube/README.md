# SonarQube Plugin

The SonarQube Plugin displays code statistics from [SonarCloud](https://sonarcloud.io) or [SonarQube](https://sonarqube.com).

![Sonar Card](./docs/sonar-card.png)

## Getting Started

1. Install the SonarQube Plugin:

```bash
# packages/app

yarn add @backstage/plugin-sonarqube
```

2. Add plugin to the app:

```js
// packages/app/src/plugins.ts

export { plugin as SonarQube } from '@backstage/plugin-sonarqube';
```

3. Add the `SonarQubeCard` to the EntityPage:

```jsx
// packages/app/src/components/catalog/EntityPage.tsx

import { SonarQubeCard } from '@backstage/plugin-sonarqube';

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    // ...
    <Grid item xs={12} sm={6} md={4}>
      <SonarQubeCard entity={entity} />
    </Grid>
    // ...
  </Grid>
);
```

4. Add the proxy config:

   Provide a method for your Backstage backend to get to your SonarQube API end point.

**SonarCloud**

```yaml
# app-config.yaml

proxy:
  '/sonarqube':
    target: https://sonarcloud.io/api
    allowedMethods: ['GET']
    headers:
      Authorization:
        # Content: 'Basic base64("<api-key>:")' <-- note the trailing ':'
        # Example: Basic bXktYXBpLWtleTo=
        $env: SONARQUBE_AUTH_HEADER
```

**SonarQube**

```yaml
# app-config.yaml

proxy:
  '/sonarqube':
    target: https://your.sonarqube.instance.com/api
    allowedMethods: ['GET']
    headers:
      Authorization:
        # Content: 'Basic base64("<api-key>:")' <-- note the trailing ':'
        # Example: Basic bXktYXBpLWtleTo=
        $env: SONARQUBE_AUTH_HEADER

sonarQube:
  baseUrl: https://your.sonarqube.instance.com
```

5. Get and provide `SONARQUBE_AUTH_HEADER` as env variable (https://sonarcloud.io/account/security or https://docs.sonarqube.org/latest/user-guide/user-token/)

6. Add the `sonarqube.org/project-key` annotation to your catalog-info.yaml file:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  description: |
    Backstage is an open-source developer portal that puts the developer experience first.
  annotations:
    sonarqube.org/project-key: YOUR_PROJECT_KEY
spec:
  type: library
  owner: CNCF
  lifecycle: experimental
```
