---
id: writing-templates
title: Writing Templates
description: Details around creating your own custom Software Templates
---

Templates are stored in the **Software Catalog** under a kind `Template`. You
can create your own templates with a small `yaml` definition which describes the
template and its metadata, along with some input variables that your template
will need, and then a list of actions which are then executed by the scaffolding
service.

Let's take a look at a simple example:

```yaml
# Notice the v1beta3 version
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
# some metadata about the template itself
metadata:
  name: v1beta3-demo
  title: Test Action template
  description: scaffolder v1beta3 template demo
spec:
  owner: backstage/techdocs-core
  type: service

  # these are the steps which are rendered in the frontend with the form input
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
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            catalogFilter:
              kind: Group
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
              - github.com

  # here's the steps that are executed in series in the scaffolder backend
  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./template
        values:
          name: ${{ parameters.name }}
          owner: ${{ parameters.owner }}

    - id: fetch-docs
      name: Fetch Docs
      action: fetch:plain
      input:
        targetPath: ./community
        url: https://github.com/backstage/community/tree/main/backstage-community-sessions

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  # some outputs which are saved along with the job for use in the frontend
  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: ${{ steps['register'].output.entityRef }}
```

Let's dive in and pick apart what each of these sections do and what they are.

## `spec.parameters` - `FormStep | FormStep[]`

These `parameters` are template variables which can be modified in the frontend
as a sequence. It can either be one `Step` if you just want one big list of
different fields in the frontend, or it can be broken up into multiple different
steps which would be rendered as different steps in the scaffolder plugin
frontend.

Each `Step` is `JSONSchema` with some extra goodies for styling what it might
look like in the frontend. For these steps we rely very heavily on this
[library](https://github.com/rjsf-team/react-jsonschema-form). They have some
[great docs](https://rjsf-team.github.io/react-jsonschema-form/docs/) and a
[playground](https://rjsf-team.github.io/react-jsonschema-form) where you can
play around with some examples.

There's another option for that library called `uiSchema` which we've taken
advantage of, and we've merged it with the existing `JSONSchema` that you
provide to the library. These are the little `ui:*` properties that you can see
in the step definitions.

For example if we take the **simple** example from the playground it looks like
this:

```json
// jsonSchema:
{
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "default": "Chuck"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "nicknames":{
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10
    }
  }
}

// uiSchema:
{
  "firstName": {
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:autocomplete": "given-name"
  },
  "lastName": {
    "ui:emptyValue": "",
    "ui:autocomplete": "family-name"
  },
  "nicknames": {
    "ui:options":{
      "orderable": false
    }
  },
  "telephone": {
    "ui:options": {
      "inputType": "tel"
    }
  }
}
```

It would look something like the following in a template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: v1beta3-demo
  title: Test Action template
  description: scaffolder v1beta3 template demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    - title: A registration form
      description: A simple form example.
      type: object
      required:
        - firstName
        - lastName
      properties:
        firstName:
          type: string
          title: First name
          default: Chuck
          ui:autofocus: true
          ui:emptyValue: ''
          ui:autocomplete: given-name
        lastName:
          type: string
          title: Last name
          ui:emptyValue: ''
          ui:autocomplete: family-name
        nicknames:
          type: array
          items:
            type: string
          ui:options:
            orderable: false
        telephone:
          type: string
          title: Telephone
          minLength: 10
          ui:options:
            inputType: tel
```

### Using Secrets

You may want to mark things as secret and make sure that these values are protected and not available through REST endpoints. You can do this by using the built in `ui:field: Secret`.

You can define this property as any normal parameter, however the consumption of this parameter will not be available through `${{ parameters.myKey }}` you will instead need to use `${{ secrets.myKey }}` in your `template.yaml`.

Parameters will be automatically masked in the review step.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: v1beta3-demo
  title: Test Action template
  description: scaffolder v1beta3 template demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    - title: Authenticaion
      description: Provide authentication for the resource
      required:
        - username
        - password
      properties:
        username:
          type: string
          # use the built in Secret field extension
          ui:field: Secret
        password:
          type: string
          ui:field: Secret

  steps:
    - id: setupAuthentication
      action: auth:create
      input:
        # make sure to use ${{ secrets.parameterName }} to reference these values
        username: ${{ secrets.username }}
        password: ${{ secrets.password }}
```

### Custom step layouts

If you find that the default layout of the form used in a particular step does not meet your needs then you can supply your own [custom step layout](./writing-custom-step-layouts.md).

### Remove sections or fields based on feature flags

Based on feature flags you can hide sections or even only fields of your
template. This is a good use case if you want to test experimental parameters in
a production environment. To use it let's look at the following template:

```yaml
spec:
  type: website
  owner: team-a
  parameters:
    - name: Enter some stuff
      description: Enter some stuff
      backstage:featureFlag: experimental-feature
      properties:
        inputString:
          type: string
          title: string input test
        inputObject:
          type: object
          title: object input test
          description: a little nested thing never hurt anyone right?
          properties:
            first:
              type: string
              title: first
              backstage:featureFlag: nested-experimental-feature
            second:
              type: number
              title: second
```

If you have a feature flag `experimental-feature` active then
your first step would be shown. The same goes for the nested properties in the
spec. Make sure to use the key `backstage:featureFlag` in your templates if
you want to use this functionality.

### The Repository Picker

In order to make working with repository providers easier, we've built a custom
picker that can be used by overriding the `ui:field` option in the `uiSchema`
for a `string` field. Instead of displaying a text input block it will render
our custom component that we've built which makes it easy to select a repository
provider, and insert a project or owner, and repository name.

You can see it in the above full example which is a separate step and it looks a
little like this:

```yaml
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
          - github.com
```

The `allowedHosts` part should be set to where you wish to enable this template
to publish to. And it can be any host that is listed in your `integrations`
config in `app-config.yaml`.

Besides specifying `allowedHosts` you can also restrict the template to publish to
repositories owned by specific users/groups/namespaces by setting the `allowedOwners`
option. With the `allowedRepos` option you are able to narrow it down further to a
specific set of repository names. A full example could look like this:

```yaml
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
          - github.com
        allowedOwners:
          - backstage
          - someGithubUser
        allowedRepos:
          - backstage
```

For a list of all possible `ui:options` input props for `RepoUrlPicker`, please visit [here](./ui-options-examples.md#repourlpicker).

The `RepoUrlPicker` is a custom field that we provide part of the
`plugin-scaffolder`. You can provide your own custom fields by
[writing your own Custom Field Extensions](./writing-custom-field-extensions.md)

#### Using the Users `oauth` token

There's a little bit of extra magic that you get out of the box when using the
`RepoUrlPicker` as a field input. You can provide some additional options under
`ui:options` to allow the `RepoUrlPicker` to grab an `oauth` token for the user
for the required `repository`.

This is great for when you are wanting to create a new repository, or wanting to
perform operations on top of an existing repository.

A sample template that takes advantage of this is like so:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: v1beta3-demo
  title: Test Action template
  description: scaffolder v1beta3 template demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    ...

    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            # Here's the option you can pass to the RepoUrlPicker
            requestUserCredentials:
              secretsKey: USER_OAUTH_TOKEN
              additionalScopes:
                github:
                  - workflow
            allowedHosts:
              - github.com
    ...

  steps:
    ...

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}
        # here's where the secret can be used
        token: ${{ secrets.USER_OAUTH_TOKEN }}

    ...
```

You will see from above that there is an additional `requestUserCredentials`
object that is passed to the `RepoUrlPicker`. This object defines what the
returned `secret` should be stored as when accessing using
`${{ secrets.secretName }}`, in this case it is `USER_OAUTH_TOKEN`. And then you
will see that there is an additional `input` field into the `publish:github`
action called `token`, in which you can use the `secret` like so:
`token: ${{ secrets.USER_OAUTH_TOKEN }}`.

There's also the ability to pass additional scopes when requesting the `oauth`
token from the user, which you can do on a per-provider basis, in case your
template can be published to multiple providers.

Note, that you will need to configure an [authentication provider](../../auth/index.md#configuring-authentication-providers), alongside the
[`ScmAuthApi`](../../auth/index.md#scaffolder-configuration-software-templates) for your source code management (SCM) service to make this feature work.

### Accessing the signed-in users details

Sometimes when authoring templates, you'll want to access the user that is running the template, and get details from the profile or the users `Entity` in the Catalog.

If you have enabled a sign in provider and have a [sign in resolver](../../auth/identity-resolver.md) that points to a user in the Catalog, then you can use the `${{ user.entity }}` templating expression to access the raw entity from the Catalog.

This can be particularly useful if you have processors setup in the Catalog to write `spec.profile.email` of the `User Entities` to reference them and pass them into actions like below:

```yaml
  steps:
    action: publish:github
    ...
    input:
        ...
        gitAuthorName: ${{ user.entity.metadata.name }}
        gitAuthorEmail: ${{ user.entity.spec.profile.email }}
```

You also have access to `user.entity.metadata.annotations` too, so if you have some other additional information stored in there, you reference those too.

### The Owner Picker

When the scaffolder needs to add new components to the catalog, it needs to have
an owner for them. Ideally, users should be able to select an owner when they go
through the scaffolder form from the users and groups already known to
Backstage. The `OwnerPicker` is a custom field that generates a searchable list
of groups and/or users already in the catalog to pick an owner from. You can
specify which of the two kinds (or both) are listed in the `catalogFilter.kind` option:

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    catalogFilter:
      kind: [Group, User]
```

For a list of all possible `ui:options` input props for `OwnerPicker`, please visit [here](./ui-options-examples.md#ownerpicker).

#### `catalogFilter`

The `catalogFilter` allow you to filter the list entities using any of the [catalog api filters](https://backstage.io/docs/features/software-catalog/software-catalog-api#filtering):

For example, if you want to show users in the `default` namespace, and groups with the `github.com/team-slug` annotation, you can do the following:

```yaml
catalogFilter:
  - kind: [User]
    metadata.namespace: default
  - kind: [Group]
    metadata.annotations.github.com/team-slug: { exists: true }
```

## `spec.steps` - `Action[]`

The `steps` is an array of the things that you want to happen part of this
template. These follow the same standard format:

```yaml
- id: fetch-base # A unique id for the step
  name: Fetch Base # A title displayed in the frontend
  if: ${{ parameters.name }} # Optional condition, skip the step if not truthy
  each: ${{ parameters.iterable }} # Optional iterable, run the same step multiple times
  action: fetch:template # An action to call
  input: # Input that is passed as arguments to the action handler
    url: ./template
    values:
      name: ${{ parameters.name }}
```

By default we ship some [built in actions](./builtin-actions.md) that you can
take a look at, or you can
[create your own custom actions](./writing-custom-actions.md).

When `each` is provided, the current iteration value is available in the `${{ each }}` input.

Examples:

```yaml
each: ['apples', 'oranges']
input:
  values:
    fruit: ${{ each.value }}
```

```yaml
each: [{ name: 'apple', count: 3 }, { name: 'orange', count: 1 }]
input:
  values:
    fruit: ${{ each.value.name }}
    count: ${{ each.value.count }}
```

When `each` is used, the outputs of a repeated step are returned as an array of outputs from each iteration.

## Outputs

Each individual step can output some variables that can be used in the
scaffolder frontend for after the job is finished. This is useful for things
like linking to the entity that has been created with the backend, linking
to the created repository, or showing Markdown text blobs.

```yaml
output:
  links:
    - title: Repository
      url: ${{ steps['publish'].output.remoteUrl }} # link to the remote repository
    - title: Open in catalog
      icon: catalog
      entityRef: ${{ steps['register'].output.entityRef }} # link to the entity that has been ingested to the catalog
  text:
    - title: More information
      content: |
        **Entity URL:** `${{ steps['publish'].output.remoteUrl }}`
```

## The templating syntax

You might have noticed variables wrapped in `${{ }}` in the examples. These are
template strings for linking and gluing the different parts of the template
together. All the form inputs from the `parameters` section will be available by
using this template syntax (for example, `${{ parameters.firstName }}` inserts
the value of `firstName` from the parameters). This is great for passing the
values from the form into different steps and reusing these input variables.
These template strings preserve the type of the parameter.

The `${{ parameters.firstName }}` pattern will work only in the template file.
If you want to start using values provided from the UI in your code, you will have to use
the `${{ values.firstName }}` pattern. Additionally, you have to pass
the parameters from the UI to the input of the `fetch:template` step.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: v1beta3-demo
  title: Test Action
  description: scaffolder v1beta3 template demo
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
          description: Unique name of your project
        urlParameter:
          title: URL endpoint
          type: string
          description: URL endpoint at which the component can be reached
          default: 'https://www.example.com'
        enabledDB:
          title: Enable Database
          type: boolean
          default: false
  ...
  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./template
        values:
          name: ${{ parameters.name }}
          url: ${{ parameters.urlParameter }}
          enabledDB: ${{ parameters.enabledDB }}
```

Afterwards, if you are using the builtin templating action, you can start using
the variables in your code. You can use also any other templating functions from
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html#tags) as well.

```bash
#!/bin/bash
echo "Hi my name is ${{ values.name }}, and you can fine me at ${{ values.url }}!"
{% if values.enabledDB %}
echo "You have enabled your database!"
{% endif %}
```

As you can see above in the `Outputs` section, `actions` and `steps` can also
output things. You can grab that output using `steps.$stepId.output.$property`.

You can read more about all the `inputs` and `outputs` defined in the actions in
code part of the `JSONSchema`, or you can read more about our
[built in actions](./builtin-actions.md).

## Built in Filters

Template filters are functions that help you transform data, extract specific information,
and perform various operations in Scaffolder Templates.

This section introduces the built-in filters provided by Backstage and offers examples of
how to use them in the Scaffolder templates. It's important to mention that Backstage also leverages the
native filters from the Nunjucks library. For a complete list of these native filters and their usage,
refer to the [Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).

### parseRepoUrl

The `parseRepoUrl` filter parse a repository URL into
its components, such as `owner`, repository `name`, and more.

**Usage Example:**

```yaml
- id: log
  name: Parse Repo URL
  action: debug:log
  input:
    extra: ${{ parameters.repoUrl | parseRepoUrl }}
```

- **Input**: `github.com?repo=backstage&org=backstage`
- **Output**: [RepoSpec](https://github.com/backstage/backstage/blob/v1.17.2/plugins/scaffolder-backend/src/scaffolder/actions/builtin/publish/util.ts#L39)

### parseEntityRef

The `parseEntityRef` filter allows you to extract different parts of
an entity reference, such as the `kind`, `namespace`, and `name`.

**Usage example**

1. Without context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    extra: ${{ parameters.owner | parseEntityRef }}
```

- **Input**: `group:techdocs`
- **Output**: [CompoundEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/types.ts#L23)

2. With context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    extra: ${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
```

- **Input**: `techdocs`
- **Output**: [CompoundEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/types.ts#L23)

### pick

This `pick` filter allows you to select specific properties from an object.

**Usage Example**

```yaml
- id: log
  name: Pick
  action: debug:log
  input:
    extra: ${{ parameters.owner | parseEntityRef | pick('name') }}
```

- **Input**: `{ kind: 'Group', namespace: 'default', name: 'techdocs' }`
- **Output**: `techdocs`

### projectSlug

The `projectSlug` filter generates a project slug from a repository URL

**Usage Example**

```yaml
- id: log
  name: Project Slug
  action: debug:log
  input:
    extra: ${{ parameters.repoUrl | projectSlug }}
```

- **Input**: `github.com?repo=backstage&org=backstage`
- **Output**: `backstage/backstage`
