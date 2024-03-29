# scaffolder-backend-module-gitea

Welcome to the `publish:gitea` action of the `scaffolder-gitea-backend`.

## Getting started

To use this action, you will have to add the package using the following command to be executed at the root of your backstage project:

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitea
```

Configure the action (if not yet done):
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

Before to create a template, include to your `app-config.yaml` file the
gitea host and credentials under the `integrations:` section

```yaml
integrations:
  gitea:
    - host: gitea.com
      username: '<GITEA_USER>'
      password: '<GITEA_PASSWORD>'
    - host: localhost:3333
      username: '<GITEA_LOCALHOST_USER>'
      password: '<GITEA_LOCALHOST_PASSWORD>'
```

**Important**: As backstage will issue HTTPS/TLS requests to the gitea instance, it is needed to configure `gitea` with a valid certificate or at least with a
self-signed certificate `gitea cert --host localhost -ca` trusted by a CA authority. Don't forget to set the env var `NODE_EXTRA_CA_CERTS` to point to the CA file before launching backstage !

When done, you can create a template which:

- Declare the `RepoUrlPicker` within the `spec/parameters` section to select the gitea hosts
- Include a step able to publish by example the newly generated project using the action `action: publish:gitea`

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-web-template
  title: Quarkus Hello world
  description: Create a simple microservice using Quarkus
  tags:
    - java
    - quarkus
spec:
  owner: quarkus
  type: service
  parameters:
    - title: Git repository Information
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - gitea.<YOUR_DOMAIN>:<PORT>
              - localhost:<PORT>

  steps:
    - id: template
      name: Generating component
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}

    - id: publish
      name: Publishing to a gitea git repository
      action: publish:gitea
      input:
        description: This is ${{ parameters.component_id }}
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main

    - id: register
      if: ${{ parameters.dryRun !== true }}
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: 'main/catalog-info.yaml'

  output:
    links:
      - title: Source Code Repository
        url: ${{ steps.publish.output.remoteUrl }}
      - title: Open Component in catalog
        icon: catalog
        entityRef: ${{ steps.register.output.entityRef }}
```

Access the newly gitea repository created using the `repoContentsUrl` ;-)
