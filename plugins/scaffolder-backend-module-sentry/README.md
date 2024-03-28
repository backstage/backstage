# scaffolder-backend-module-sentry

Welcome to the Sentry Module for Scaffolder.

Here you can find all Sentry related features to improve your scaffolder:

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-sentry
```

Configure the action (you can check
the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to
see all options):

```typescript
const actions = [
  createSentryCreateProjectAction({
    integrations,
    reader: env.reader,
    containerRunner,
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

You need to define your Sentry API Token in your `app-config.yaml`:

```yaml
scaffolder:
  sentry:
    token: ${SENTRY_TOKEN}
```

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sentry-demo
  title: Sentry template
  description: scaffolder sentry app
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
    - id: fetch
      name: Fetch
      action: fetch:template
      input:
        url: https://github.com/TEMPLATE
        values:
          name: ${{ parameters.name }}

    - id: create-sentry-project
      if: ${{ parameters.dryRun !== true }}
      name: Create Sentry Project
      action: sentry:create-project
      input:
        organizationSlug: ORG-SLUG
        teamSlug: TEAM-SLUG
        name: ${{ parameters.name }}

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
