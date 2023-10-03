# @mspiegel31/backstage-plugin-scaffolder-backend-module-plugin-scaffolder-backend-module-copier

Welcome to the `fetch:copier` action for the `scaffolder-backend`

## Getting started

### Install the action

from your backstage root directory, run:

```
yarn add --cwd packages/backend @mspiegel31/backstage-plugin-scaffolder-backend-module-plugin-scaffolder-backend-module-copier
```

### Configure the action

you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options:

```typescript
// packages/backend/src/plugins/scaffolder.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const actions = [
    createCopierFetchAction({ config: env.config }),
    ...createBuiltinActions({
      integrations,
      catalogClient,
      config: env.config,
      reader: env.reader,
    }),
  ];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
  });
}
```

### Use the action

```yaml
# https://backstage.io/docs/features/software-catalog/descriptor-format#kind-template
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: catalog-info-template
  title: Catalog info template
  description: |
    helper for quickly integrating `catalog-info.yaml` files into existing repositories

  annotations:
    github.com/project-slug: spotoninc/software-templates

  tags:
    - basic
    - onboarding

spec:
  owner: dx
  type: service

  # These parameters are used to generate the input form in the frontend, and are
  # used to gather input data for the execution of the template.

  parameters:
    - title: Fill in some steps
      required:
        - name
        - owner
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:autofocus: true
          ui:options:
            rows: 5
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            catalogFilter:
              kind: Group
        system:
          title: System
          type: string
          description: System of the component
          ui:field: EntityPicker
          ui:options:
            catalogFilter:
              kind: System
            defaultKind: System

    - title: Configure template options
      required:
        - pretend
      properties:
        pretend:
          title: Only perform a dry run, don't publish anything
          type: boolean
          default: false

  steps:
    - action: fetch:copier
      id: fetch-template
      name: Template base software library
      input:
        url: https://github.com/serious-scaffold/serious-scaffold-python
        answerFileDirectory: '.answerfiles'
        pretend: ${{parameters.pretend}}
        values:
          package_name: ${{parameters.name}}
          module_name: test_project
          author_name: ${{parameters.owner}}
```

### Copier feature support

the `copier` command line utility does support certain [unsafe features](https://copier.readthedocs.io/en/stable/configuring/#unsafe) such as custom Jinja extensions etc. This action does not allow the creation of templates that require these unsafe features, and will fail if the requested template leverages those features.

### Environment Setup

The environment needs to have `copier` and `git` installed and available in the `PATH`.

If you are running Backstage from a Docker container and you want to avoid calling a container inside a container, you can set up `copier` and `git` in your own image, this will use the local installation instead.

You can do so by including the following lines in the last step of your Dockerfile:

```dockerfile
# git is required for version-aware template features
RUN apt-get update && apt-get install -y python3 python3-pip git
RUN pip3 install copier
```
