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

3. Add the `EntitySonarQubeCard` to the EntityPage:

```diff
  // packages/app/src/components/catalog/EntityPage.tsx
+ import { EntitySonarQubeCard } from '@backstage/plugin-sonarqube';

 ...

 const overviewContent = (
   <Grid container spacing={3} alignItems="stretch">
     <Grid item md={6}>
       <EntityAboutCard variant="gridItem" />
     </Grid>
+    <Grid item md={6}>
+      <EntitySonarQubeCard variant="gridItem" />
+    </Grid>
   </Grid>
 );
```

4. Add the proxy config:

   Provide a method for your Backstage backend to get to your SonarQube API end point. Add configuration to your `app-config.yaml` file depending on the product you use.

**SonarCloud**

```yaml
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
proxy:
  '/sonarqube':
    target: https://your.sonarqube.instance.com/api
    allowedMethods: ['GET']
    headers:
      Authorization:
        # Environmental variable: SONARQUBE_AUTH_HEADER
        # Value: 'Basic base64("<sonar-auth-token>:")'
        # Encode the "<sonar-auth-token>:" string using base64 encoder.
        # Note the trailing colon (:) at the end of the token.
        # Example environmental config: SONARQUBE_AUTH_HEADER=Basic bXktYXBpLWtleTo=
        # Fetch the sonar-auth-token from https://sonarcloud.io/account/security/
        $env: SONARQUBE_AUTH_HEADER

sonarQube:
  baseUrl: https://your.sonarqube.instance.com
```

5. Get and provide `SONARQUBE_AUTH_HEADER` as env variable (https://sonarcloud.io/account/security or https://docs.sonarqube.org/latest/user-guide/user-token/)

6. Run the following commands in the root folder of the project to install and compile the changes.

```yaml
yarn install
yarn tsc
```

7. Add the `sonarqube.org/project-key` annotation to the `catalog-info.yaml` file of the target repo for which code quality analysis is needed.

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
