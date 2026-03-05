---
id: configuration
title: Software Template Configuration
sidebar_label: Configuration
description: Configuration options for Backstage Software Templates
---

Backstage software templates create source code, so your Backstage application
needs to be set up to allow repository creation.

This is done in your `app-config.yaml` by adding
[Backstage integrations](https://backstage.io/docs/integrations/) for the
appropriate source code repository for your organization.

:::note Note

Integrations may already be set up as part of your `app-config.yaml`.

:::

The next step is to [add templates](http://backstage.io/docs/features/software-templates/adding-templates)
to your Backstage app.

## Publishing defaults

Software templates can define _publish_ actions, such as `publish:github`, to
create new repositories or submit pull / merge requests to existing
repositories. You can configure the author and commit message through the
`scaffolder` configuration in `app-config.yaml`:

```yaml
scaffolder:
  defaultAuthor:
    name: M.C. Hammer # Defaults to `Scaffolder`
    email: hammer@donthurtem.com # Defaults to `scaffolder@backstage.io`
  defaultCommitMessage: "U can't touch this" # Defaults to 'Initial commit'
```

To configure who can see the new repositories created from software templates,
add the `repoVisibility` key within a software template:

```yaml
- id: publish
  name: Publish
  action: publish:github
  input:
    repoUrl: '{{ parameters.repoUrl }}'
    repoVisibility: public # or 'internal' or 'private'
```

### Default Environment

The scaffolder supports a `defaultEnvironment` configuration that provides default parameters and secrets to all templates. This reduces template complexity and improves security by centralizing common values.

```yaml
scaffolder:
  defaultEnvironment:
    parameters:
      region: eu-west-1
      organizationName: acme-corp
      defaultRegistry: registry.acme-corp.com
    secrets:
      AWS_ACCESS_KEY: ${AWS_ACCESS_KEY}
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      DOCKER_REGISTRY_TOKEN: ${DOCKER_REGISTRY_TOKEN}
```

#### Default parameters

Default parameters are accessible via `${{ environment.parameters.* }}` in templates. Default parameters are isolated in their own context to avoid naming conflicts.

```yaml
 parameters:
    - title: Fill in some steps
      required:
        - organizationName
      properties:
        organizationName:
          title: organizationName
          type: string
          description: Unique name of the organization
          ui:autofocus: true
          ui:options:
            rows: 5

  steps:
    - id: deploy
      name: Deploy Application
      action: aws:deploy
      input:
        region: ${{ environment.parameters.region }}  # Resolves to defaultEnvironment.parameters.region
        organization: ${{ parameters.organizationName }}  # Resolves to frontend input value
        otherOrganization: ${{ environment.parameters.organizationName }}  # Resolves to defaultEnvironment.parameters.organizationName
```

#### Secrets

Default secrets are resolved from environment variables and accessible via `${{ environment.secrets.* }}` in template actions. Secrets are only available during action execution, not in frontend forms.

```yaml
- id: deploy
  name: Deploy with credentials
  action: aws:deploy
  input:
    accessKey: ${{ environment.secrets.AWS_ACCESS_KEY }} # Resolves to defaultEnvironment.secrets.AWS_ACCESS_KEY
```

**Security Note:** Secrets are automatically masked in logs and are only available to backend actions, never exposed to the frontend.

## Disabling Docker in Docker situation (Optional)

Software templates use the `fetch:template` action by default, which requires no
external dependencies and offers a
[Cookiecutter-compatible mode](https://backstage.io/docs/features/software-templates/builtin-actions#using-cookiecuttercompat-mode).
There is also a `fetch:cookiecutter` action, which uses
[Cookiecutter](https://github.com/cookiecutter/cookiecutter) directly for
templating. By default, the `fetch:cookiecutter` action will use the
[scaffolder-backend/Cookiecutter](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/scripts/Cookiecutter.dockerfile)
docker image.

If you are running Backstage from a Docker container and you want to avoid
calling a container inside a container, you can set up Cookiecutter in your own
image, this will use the local installation instead.

You can do so by including the following lines in the last step of your
`Dockerfile`:

```Dockerfile
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install cookiecutter
```

## Customizing the ScaffolderPage with Grouping and Filtering

Once you have more than a few software templates you may want to customize your
`ScaffolderPage` by grouping and surfacing certain templates together. You can
accomplish this by creating `groups` and passing them to your `ScaffolderPage`
like below

```tsx
<ScaffolderPage
  groups={[
    {
      title: 'Recommended',
      filter: entity =>
        entity?.metadata?.tags?.includes('recommended') ?? false,
    },
  ]}
/>
```

This code will group all templates with the 'recommended' tag together at the
top of the page above any other templates not filtered by this group or others.

You can also further customize groups by passing in a `titleComponent` instead
of a `title` which will be a component to use as the header instead of just the
default `ContentHeader` with the `title` set as it's value.

![Grouped Templates](../../assets/software-templates/grouped-templates.png)

There is also an option to hide some templates.
You can have several use cases for that:

- it's still in an experimental phase, so you can combine it with feature flagging for example
- you don't want to make them accessible from template list, but only open it on some action with pre-filled data.
- show different set of templates depends on target environment

```typescript jsx
<ScaffolderPage
  templateFilter={entity =>
    entity?.metadata?.tags?.includes('experimental') ?? false
  }
/>
```
