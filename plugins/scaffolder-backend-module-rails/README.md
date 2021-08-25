# scaffolder-backend-module-rails

Welcome to the Rails Module for Scaffolder.

Here you can find all Rails related features to improve your scaffolder:

- Rails Action to use the `new` command
- More features are coming

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```
cd packages/backend
yarn add @backstage/plugin-scaffolder-backend-module-rails
```

Configure the action (you can check
the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to
see all options):

```typescript
const actions = [
  createFetchRailsAction({
    integrations,
    reader,
    containerRunner,
  }),
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
  name: rails-demo
  title: Rails template
  description: scaffolder Rails app
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
        railsArguments:
          title: arguments to run the rails new command
          type: object
          properties:
            minimal:
              title: minimal
              description: Preconfigure a minimal rails app
              type: boolean
            skipBundle:
              title: skipBundle
              description: Don't run bundle install
              type: boolean
            skipWebpackInstall:
              title: skipWebpackInstall
              description: Don't run Webpack install
              type: boolean
            api:
              title: api
              description: Preconfigure smaller stack for API only apps
              type: boolean
            template:
              title: template
              description: Path to some application template (can be a filesystem path or URL)
              type: string
              default: './rails-template-file.rb'
            webpacker:
              title: webpacker
              description:
                'Preconfigure Webpack with a particular framework (options: react,
                vue, angular, elm, stimulus)'
              type: string
              enum:
                - react
                - vue
                - angular
                - elm
                - stimulus
            database:
              title: database
              description: 'Preconfigure for selected database (options: mysql/postgresql/sqlite3/oracle/sqlserver/jdbcmysql/jdbcsqlite3/jdbcpostgresql/jdbc)'
              type: string
              enum:
                - mysql
                - postgresql
                - sqlite3
                - oracle
                - sqlserver
                - jdbcmysql
                - jdbcsqlite3
                - jdbcpostgresql
                - jdbc
            railsVersion:
              title: Rails version in Gemfile
              description:
                'Set up the application with Gemfile pointing to a specific version
                (options: dev, edge, master)'
              type: string
              enum:
                - dev
                - edge
                - master

  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:rails
      input:
        url: ./template
        values:
          name: '{{ parameters.name }}'
          owner: '{{ parameters.owner }}'
          system: '{{ parameters.system }}'
          railsArguments: '{{ json parameters.railsArguments }}'

    - name: Write Catalog information
      action: catalog:write
      input:
        component:
          apiVersion: 'backstage.io/v1alpha1'
          kind: Component
          metadata:
            name: '{{ parameters.name }}'
            annotations:
              github.com/project-slug: '{{ projectSlug parameters.repoUrl }}'
          spec:
            type: service
            lifecycle: production
            owner: '{{ parameters.owner }}'

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

### What you need to run that action

The environment need to have a [rails](https://github.com/rails/rails#getting-started) installation, or you can build and provide a docker image in your template.

We have a [Dockerfile](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-rails/Rails.dockerfile) that you can use to build your image.

If you choose to provide a docker image, you need to update your template with `imageName` parameter:

```yaml
steps:
  - id: fetch-base
    name: Fetch Base
    action: fetch:rails
    input:
      url: ./template
      imageName: repository/rails:tag
      values:
        name: '{{ parameters.name }}'
        owner: '{{ parameters.owner }}'
        system: '{{ parameters.system }}'
        railsArguments: '{{ json parameters.railsArguments }}'
```
