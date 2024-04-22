# scaffolder-backend-module-gitea

Welcome to the `publish:gitea` action of the `scaffolder-gitea-backend`.

## Getting started

To use this action, you will have to add the package using the following command to be executed at the root of your backstage project:

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitea
```

Alternatively, if you use the new backend system, then register it like this:

```typescript
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitea'));
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

**Important**: As backstage will issue `HTTPS/TLS` requests to the gitea instance, it is needed to configure `gitea` with a valid certificate or at least with a
self-signed certificate `gitea cert --host localhost -ca` trusted by a CA authority. Don't forget to set the env var `NODE_EXTRA_CA_CERTS` to point to the CA file before launching backstage or you can set temporarily `NODE_TLS_REJECT_UNAUTHORIZED=0` but this is not recommended for production!

When done, you can create a template which:

- Declare the `RepoUrlPicker` within the `spec/parameters` section to select the gitea host and to provide the name of the repository
- Add an `enum` list allowing the user to define the visibility about the repository to be created: `public` or `private`. If this field is omitted, `public` is then used by the action.
- Include in a step the action: `publish:gitea`

**Warning**: The list of the `allowedOwners` of the `repoUrlPicker` must match the list of the `organizations` which are available on the gitea host !

```yaml
kind: Template
metadata:
  name: simple-gitea-project
  title: Create a gitea repository
  description: Create a gitea repository
spec:
  owner: guests
  type: service

  parameters:
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedOwners:
              - qteam
              - qshift
            allowedHosts:
              - gitea.localtest.me:3333

        repoVisibility:
          title: Visibility of the repository
          type: string
          default: 'public'
          enum:
            - 'public'
            - 'private'
          enumNames:
            - 'public'
            - 'private'

  steps:
    ...
    - id: publish
      name: Publishing to a gitea git repository
      action: publish:gitea
      input:
        description: This is ${{ parameters.repoUrl | parseRepoUrl | pick('repo') }}
        repoVisibility: ${{ parameters.repoVisibility }}
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main
```

Access the newly gitea repository created using the `repoContentsUrl` ;-)
