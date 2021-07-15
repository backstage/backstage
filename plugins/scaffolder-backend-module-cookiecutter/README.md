# scaffolder-backend-module-cookiecutter

Welcome to the `fetch:cookiecutter` action for the `scaffolder-backend`.

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```
cd packages/backend
yarn add @backstage/plugin-scaffolder-backend-module-cookiecutter
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

const actions = [
  createFetchCookiecutterAction({
    integrations,
    reader,
    containerRunner,
  }),
  ...createBuiltInActions({
    ...
  })
];

return await createRouter({
  containerRunner,
  logger,
  config,
  database,
  catalogClient,
  reader,
  actions,
});
```

After that you can use the action in your template:

```yaml
apiVersion: backstage.io/v1beta2
kind: Template
metadata:
  name: cookiecutter-demo
  title: Cookiecutter Test
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
            allowedKinds:
              - Group
        system:
          title: System
          type: string
          description: System of the component
          ui:field: EntityPicker
          ui:options:
            allowedKinds:
              - System
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
    - id: fetch-base
      name: Fetch Base
      action: fetch:cookiecutter
      input:
        url: ./template
        values:
          name: '{{ parameters.name }}'
          owner: '{{ parameters.owner }}'
          system: '{{ parameters.system }}'
          destination: '{{ parseRepoUrl parameters.repoUrl }}'

    - id: publish
      if: '{{ not parameters.dryRun }}'
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: 'This is {{ parameters.name }}'
        repoUrl: '{{ parameters.repoUrl }}'

    - id: register
      if: '{{ not parameters.dryRun }}'
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
        catalogInfoPath: '/catalog-info.yaml'

    - name: Results
      if: '{{ parameters.dryRun }}'
      action: debug:log
      input:
        listWorkspace: true

  output:
    links:
      - title: Repository
        url: '{{ steps.publish.output.remoteUrl }}'
      - title: Open in catalog
        icon: 'catalog'
        entityRef: '{{ steps.register.output.entityRef }}'
```

You can also visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts when it's installed to configure how you like.

### Environment setup

The environment needs to have either `cookiecutter` installed and be available in the `PATH` or access to a `docker` daemon so it can spin up a docker container with `cookiecutter` available.

If you are running Backstage from a Docker container and you want to avoid calling a container inside a container, you can set up `cookiecutter` in your own image, this will use the local installation instead.

You can do so by including the following lines in the last step of your Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install cookiecutter
```
