# scaffolder-backend-module-sonarqube

Welcome to the `scaffolder-backend-module-sonarqube` custom action!

This contains one action: `sonarqube:project:create`

The `sonarqube:project:create` action creates a new project in Sonar. Supports both SonarCloud and SonarQube self hosted.

## Getting started

```
cd packages/backend
yarn add @backstage/plugin-scaffolder-backend-module-sonarqube
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts
---
import { ScmIntegrations } from '@backstage/integration';
import { sonarQubeCreateProjectAction } from '@backstage/plugin-scaffolder-backend-module-sonarqube';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
}
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    ...builtInActions,
    sonarQubeCreateProjectAction({
      config: env.config,
    }),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    catalogClient: catalogClient,
    reader: env.reader,
    identity: env.identity,
    actions,
    scheduler: env.scheduler,
  });

```

### Authorization

In order to use `scaffolder-backend-module-sonarqube`, you must provide a token which allows access the Sonarqube API (Create Projects permission is required to create projects)

You need to define your Sonar API Token in your `app-config.yaml`:

```yaml
scaffolder:
  sonarqube:
    token: ${SONARQUBE_TOKEN}
```

### Example of using

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sonarqube-template
  title: sonarqube-template
  description: Template for testing the scaffolder-backend-module-sonarqube action
  tags:
    - test
spec:
  owner: MatthewThomas
  type: debug
  steps:
    - id: template
      name: Sonar create project
      action: sonarqube:create:project
      input:
        name: my_backstage_project
        projectKey: my_backstage_project
        organization: backstage
```

This action is typically used after the publish action, but can be used on its own.

You can visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.
