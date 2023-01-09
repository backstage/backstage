# scaffolder-backend-module-gitlab

Welcome to the Gitlab Module for Scaffolder.

Here you can find all Gitlab related features to improve your scaffolder:

## Getting started

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-scaffolder-backend-module-gitlab
```

Configure the action (you can check
the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to
see all options):

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: gitlab-demo
  title: Gitlab DEMO
  description: Scaffolder Gitlab Demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:autofocus: true
          ui:options:
            rows: 5
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - gitlab.com

  steps:
    - id: fetch
      name: Fetch
      action: fetch:template
      input:
        url: https://github.com/TEMPLATE
        values:
          name: ${{ parameters.name }}

    - id: publish
      name: Publish
      action: publish:gitlab
      input:
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}
        sourcePath: pimcore
        defaultBranch: main

    - id: gitlab-deploy-token
      name: Create Deploy Token
      action: gitlab:create-project-deploy-token
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish'].output.projectId }}"
        name: ${{ parameters.name }}-secret
        username: ${{ parameters.name }}-secret
        scopes: ['read_registry']

    - id: gitlab-access-token
      name: Gitlab Access Token
      action: gitlab:create-project-access-token
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish-manifest'].output.projectId }}"
        name: ${{ parameters.name }}-access-token
        accessLevel: 40
        scopes: ['read_repository', 'write_repository']

    - id: gitlab-project-variable
      name: Manifest CI/CD Variable
      action: gitlab:create-project-variable
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish'].output.projectId }}"
        key: 'VARIABLE_NAME'
        value: "${{ steps['gitlab-access-token'].output.access_token }}"
        variableType: 'env_var'
        masked: true
        variableProtected: false
        raw: false
        environmentScope: '*'

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
```
