# scaffolder-backend-module-nasti

Welcome to the `fetch:nasti action for the `scaffolder-backend`.

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-scaffolder-backend-module-nasti
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

const actions = [
  createFetchNastiAction({
    integrations,
    reader: env.reader,
    containerRunner,
  }),
  ...createBuiltInActions({
    ...
  })
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
parameters:
  - title: Fill in some steps
    required:
      - name
      - owner
      - owner_email
    properties:
      name:
        title: App Name
        type: string
        description: Name of the new application
        ui:autofocus: true
      owner:
        title: Contact Name
        type: string
        description: Your name
      owner_email:
        title: Contact Email
        type: string
        description: Your email

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
  - id: fetch-base
    name: Fetch Base
    action: fetch:nasti
    input:
      url: ./template
      values:
        app_name: ${{ parameters.name }}
        contact_name: ${{ parameters.owner }}
        email: ${{ parameters.owner_email }}

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

### Environment setup

The environment needs to have either `nasti` installed and be available in the `PATH` or access to a `docker` daemon so it can spin up a docker container with `nasti` available.

If you are running Backstage from a Docker container and you want to avoid calling a container inside a container, you can set up `nasti` in your own image, this will use the local installation instead.

You can do so by including the following lines in the last step of your Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install nasti
```

In this case, you don't have to include `containerRunner` in the action configuration.
