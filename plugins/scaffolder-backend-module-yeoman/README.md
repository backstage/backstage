# scaffolder-backend-module-yeoman

Welcome to the `run:yeoman` action for the `scaffolder-backend`.

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-yeoman
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

const actions = [
  createRunYeomanAction(),
  ...createBuiltInActions({
    containerRunner,
    catalogClient,
    integrations,
    config: env.config,
    reader: env.reader,
  }),
];

return await createRouter({
  containerRunner,
  catalogClient,
  actions,
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
});
```

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: yeoman-demo
  title: Yeoman Test
  description: Cookiecutter example
spec:
  owner: backstage/techdocs-core
  type: service

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

    - title: Choose a location
      required:
        - repoUrl
        - dryRun
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
        dryRun:
          title: Only perform a dry run, don't publish anything
          type: boolean
          default: false

  steps:
    - id: yeoman
      name: Yeoman
      action: run:yeoman
      input:
        namespace: org:codeowners
        options:
          codeowners: '@${{ parameters.owner }}'

    - id: publish
      if: ${{ parameters.dryRun !== true }}
      name: Publish
      action: publish:github
      input:
        allowedHosts:
          - github.com
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}

    - id: register
      if: ${{ parameters.dryRun !== true }}
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

    - name: Results
      if: ${{ parameters.dryRun }}
      action: debug:log
      input:
        listWorkspace: true

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: ${{ steps['register'].output.entityRef }}
```

You can also visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.

### Yeoman Generators setup

Yeoman generator should be installed a dependency of your `backstage/packages/backend` in `package.json`

```package.json
"generator-name": "^1.2.3"
```

Alternatively it can be installed globally in the environment using, e.g.: `npm install -g generator-name`.
