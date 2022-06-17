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
            allowedKinds:
              - Group
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
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  # some outputs which are saved along with the job for use in the frontend
  output:
    remoteUrl: ${{ steps.publish.output.remoteUrl }}
    entityRef: ${{ steps.register.output.entityRef }}
```

Let's dive in and pick apart what each of these sections do and what they are.

## `spec.parameters` - `FormStep | FormStep[]`

These `parameters` are template variables which can be modified in the frontend
as a sequence. It can either be one `Step` if you just want one big list of
different fields in the frontend, or it can be broken up into multiple different
steps which would be rendered as different steps in the scaffolder plugin
frontend.

Each `Step` is `JSONSchema` with some extra goodies for styling what it might
look like in the frontend. For these steps we rely very heavily on this library:
https://github.com/rjsf-team/react-jsonschema-form. They have some great docs
too here: https://react-jsonschema-form.readthedocs.io/ and a playground where
you can play around with some examples here
https://rjsf-team.github.io/react-jsonschema-form.

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
    "ui:autocomplete": "family-name"
  },
  "lastName": {
    "ui:emptyValue": "",
    "ui:autocomplete": "given-name"
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
          ui:autocomplete: family-name
        lastName:
          type: string
          title: Last name
          ui:emptyValue: ''
          ui:autocomplete: given-name
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

### Hide or mask sensitive data on Review step

Sometimes, specially in custom fields, you collect some data on Create form that
must not be shown to the user on Review step. To hide or mask this data, you can
use `ui:widget: password` or set some properties of `ui:backstage`:

```yaml
- title: Hide or mask values
  properties:
    password:
      title: Password
      type: string
      ui:widget: password # will print '******' as value for property 'password' on Review Step
    masked:
      title: Masked
      type: string
      ui:backstage:
        review:
          mask: '<some-value-to-show>' # will print '<some-value-to-show>' as value for property 'Masked' on Review Step
    hidden:
      title: Hidden
      type: string
      ui:backstage:
        review:
          show: false # won't print any info about 'hidden' property on Review Step
```

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
specify which of the two kinds are listed in the `allowedKinds` option:

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    allowedKinds:
      - Group
```

## `spec.steps` - `Action[]`

The `steps` is an array of the things that you want to happen part of this
template. These follow the same standard format:

```yaml
- id: fetch-base # A unique id for the step
  name: Fetch Base # A title displayed in the frontend
  if: ${{ parameters.name }} # Optional condition, skip the step if not truthy
  action: fetch:template # An action to call
  input: # Input that is passed as arguments to the action handler
    url: ./template
    values:
      name: ${{ parameters.name }}
```

By default we ship some [built in actions](./builtin-actions.md) that you can
take a look at, or you can
[create your own custom actions](./writing-custom-actions.md).

## Outputs

Each individual step can output some variables that can be used in the
scaffolder frontend for after the job is finished. This is useful for things
like linking to the entity that has been created with the backend, and also
linking to the created repository.

The main two that are used are the following:

```yaml
output:
  remoteUrl: ${{ steps.publish.output.remoteUrl }} # link to the remote repository
  entityRef: ${{ steps.register.output.entityRef }} # link to the entity that has been ingested to the catalog
```

## The templating syntax

You might have noticed variables wrapped in `${{ }}` in the examples. These are
template strings for linking and gluing the different parts of the template
together. All the form inputs from the `parameters` section will be available by
using this template syntax (for example, `${{ parameters.firstName }}` inserts
the value of `firstName` from the parameters). This is great for passing the
values from the form into different steps and reusing these input variables.
These template strings preserve the type of the parameter.

As you can see above in the `Outputs` section, `actions` and `steps` can also
output things. You can grab that output using `steps.$stepId.output.$property`.

You can read more about all the `inputs` and `outputs` defined in the actions in
code part of the `JSONSchema`, or you can read more about our
[built in actions](./builtin-actions.md).
