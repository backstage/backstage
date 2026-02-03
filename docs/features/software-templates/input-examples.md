---
id: input-examples
title: Input Examples
description: Some examples to use in your template
---

All the examples on this page you can test using _create/edit_ from your Backstage installation.

It is important to remember that all examples are based on [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/).

## Simple text input

### Simple input with basic validations

We can use a `pattern` to validate the input. The `pattern` is a regular expression that the input must match.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Simple text input
        type: string
        description: Description about input
        maxLength: 8
        pattern: '^([a-zA-Z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)*$'
        ui:autofocus: true
        ui:help: 'Hint: additional description...'
```

#### Custom validation error message

This example shows how to customize the error message shown when the `pattern` validation fails.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Simple text input
        type: string
        description: Description about input
        maxLength: 8
        pattern: '^([a-zA-Z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)*$'
        ui:autofocus: true
        ui:help: 'Hint: additional description...'
    errorMessage:
      properties:
        name: '1-8 alphanumeric tokens (first starts with letter) delimited by -'
```

### Multi line text input

If you need to insert a multi-line string, you can use the `ui:widget: textarea` option. This will create a text area input instead of a single line input.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      multiline:
        title: Text area input
        type: string
        description: Insert your multi line string
        ui:widget: textarea
        ui:options:
          rows: 10
        ui:help: 'Hint: Make it strong!'
        ui:placeholder: |
          apiVersion: backstage.io/v1alpha1
            kind: Component
            metadata:
              name: backstage
            spec:
              type: library
              owner: CNCF
              lifecycle: experimental
```

## Arrays options

### Array with custom titles

In the example below the user will see the `enumNames` instead of the `enum` values, making it easier to read.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      volume_type:
        title: Volume Type
        type: string
        description: The volume type to be used
        default: gp2
        enum:
          - gp2
          - gp3
          - io1
          - io2
          - sc1
          - st1
          - standard
        enumNames:
          - 'General Purpose SSD (gp2)'
          - 'General Purpose SSD (gp3)'
          - 'Provisioned IOPS (io1)'
          - 'Provisioned IOPS (io2)'
          - 'Cold HDD (sc1)'
          - 'Throughput Optimized HDD (st1)'
          - 'Magnetic (standard)'
```

### A multiple choices list

This is a simple multiple choice list.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Select environments
        type: array
        items:
          type: string
          enum:
            - production
            - staging
            - development
        uniqueItems: true
        ui:widget: checkboxes
```

### Array with another types

In the example below, it will create an array of custom objects. Once you add one, you will see an object where each one contains 3 fields, "How are you?", "Is it sunny?" and "Anything else?".

```yaml
parameters:
  - title: Fill in some steps
    properties:
      arrayObjects:
        title: Array with custom objects
        type: array
        minItems: 0
        ui:options:
          addable: true
          orderable: true
          removable: true
        items:
          type: object
          properties:
            array:
              title: How are you?
              type: string
              default: good
              enum:
                - good
                - okay
                - great
            flag:
              title: Is it sunny?
              type: boolean
              ui:widget: radio
            someInput:
              title: Anything else?
              type: string
```

## Boolean options

### Boolean

This adds a simple checkbox to the form. The value will be `true` or `false`.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Checkbox boolean
        type: boolean
```

### Boolean Yes or No options

This example shows how to use a radio button instead of a checkbox with `Yes` or `No` options.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Yes or No options
        type: boolean
        ui:widget: radio
```

### Boolean multiple options

You can create multiple checkboxes with different options. The example below shows how to create a list of features that can be enabled or disabled for example.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Select features
        type: array
        items:
          type: string
          enum:
            - 'Enable scraping'
            - 'Enable HPA'
            - 'Enable cache'
        uniqueItems: true
        ui:widget: checkboxes
```

## Markdown text blocks

Its possible to render markdown text blocks in the form. This is useful to add some help text or instructions for the user.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      markdown:
        type: 'null' # Needs to be quoted
        description: |
          ## Markdown Text Block

          Standard markdown formatting is supported including *italics*, **bold** and [links](https://example.com)

          * bullet 1
          * bullet 2
```

## Use parameters as condition in steps

Its possible to conditionally run steps based on the value of a parameter. In the example below, we trigger the steps depending on the value of the `environment` parameter.

```yaml
- name: Only development environments
  if: ${{ parameters.environment === "staging" or parameters.environment === "development" }}
  action: debug:log
  input:
    message: 'development step'

- name: Only production environments
  if: ${{ parameters.environment === "prod" or parameters.environment === "production" }}
  action: debug:log
  input:
    message: 'production step'

- name: Non-production environments
  if: ${{ parameters.environment !== "prod" and parameters.environment !== "production" }}
  action: debug:log
  input:
    message: 'non-production step'
```

## Use parameters as conditional for fields

Its also possible to conditionally show fields based on the value of a parameter. In the example below, we show the `lastName` field only if the `includeName` parameter is set to `true`.

```yaml
parameters:
  - title: Fill in some steps
    properties:
      includeName:
        title: Include Name?
        type: boolean
        default: true

    dependencies:
      includeName:
        allOf:
          - if:
              properties:
                includeName:
                  const: true
            then:
              properties:
                lastName:
                  title: Last Name
                  type: string
              # You can use additional fields of parameters within conditional parameters such as required.
              required:
                - lastName
```

### Multiple conditional fields with custom ordering

In this example, we show how to conditionally show multiple fields based on the value of a parameter. The `ui:order` property is used to control the order of the fields in the form.
In this case, we show the `lastName` and `address` fields only if the `includeName` and `includeAddress` parameters are set to `true`.

```yaml
parameters:
  - title: Fill in some steps
    ui:order:
      - includeName
      - lastName
      - includeAddress
      - address
    properties:
      includeName:
        title: Include Name?
        type: boolean
        default: true
      includeAddress:
        title: Include Address?
        type: boolean
        default: true
    dependencies:
      includeName:
        allOf:
          - if:
              properties:
                includeName:
                  const: true
            then:
              properties:
                lastName:
                  title: Name
                  type: string
              required:
                - lastName
      includeAddress:
        allOf:
          - if:
              properties:
                includeAddress:
                  const: true
            then:
              properties:
                address:
                  title: Address
                  type: string
              required:
                - address
```

## Conditionally set parameters

The `if` keyword within the parameter uses [nunjucks templating](https://mozilla.github.io/nunjucks/templating.html#if). The `not` keyword is unavailable; instead, use javascript equality.

```yaml
spec:
  parameters:
    - title: Fill in some steps
      properties:
        path:
          title: path
          type: string

  steps:
    - id: fetch
      name: Fetch template
      action: fetch:template
      input:
        url: ${{ parameters.path if parameters.path else '/root' }}
    - id: fetch_not_example
      name: Fetch template not example
      action: fetch:template
      input:
        url: ${{ '/root' if parameters.path !== true else parameters.path }}
```

## Use placeholders to reference remote files

:::note

Testing of this functionality is not yet supported using _create/edit_. In addition, this functionality only works for remote files and not local files. You also cannot nest files.

:::

Its possible to use placeholders to reference remote files. This is useful when you have some standard parameters or actions that you want to reuse across multiple templates.

### template.yaml

In our template, we use the `$yaml` placeholder to reference the `parameters.yaml` and `action.yaml` files. The `parameters.yaml` file contains some parameters that we want to use in our template, and the `action.yaml` file contains the action that we want to run.

```yaml
spec:
  parameters:
    - $yaml: https://github.com/example/path/to/parameters.yaml # This would become the parameters as referenced in the parameters.yaml file
    - title: Fill in some steps
      properties:
        path:
          title: path
          type: string

  steps:
    - $yaml: https://github.com/example/path/to/action.yaml # This would become the publish action as referenced in the action.yaml file

    - id: fetch
      name: Fetch template
      action: fetch:template
      input:
        url: ${{ parameters.path if parameters.path else '/root' }}
```

### parameters.yaml

The `url` parameter will be added to the template.

```yaml
title: Provide simple information
required:
  - url
properties:
  url:
    title: url
    type: string
```

### action.yaml

The `publish:github` action will be included in our template.

```yaml
id: publish
name: Publish files
action: publish:github
input:
  repoUrl: ${{ parameters.url }}
```
