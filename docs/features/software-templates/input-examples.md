---
id: input-examples
title: Input Examples
description: Some examples to use in your template
---

All the examples on this page you can test using _create/edit_ from your Backstage installation.

It is important to remember that all examples are based on [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/).

## Simple text input

### Simple input with basic validations

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
              title: Array string with default value
              type: string
              default: value3
              enum:
                - value1
                - value2
                - value3
            flag:
              title: Boolean flag
              type: boolean
              ui:widget: radio
            someInput:
              title: Simple text input
              type: string
```

## Boolean options

### Boolean

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Checkbox boolean
        type: boolean
```

### Boolean Yes or No options

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

```yaml
parameters:
  - title: Fill in some steps
    properties:
      name:
        title: Select features
        type: array
        items:
          type: boolean
          enum:
            - 'Enable scraping'
            - 'Enable HPA'
            - 'Enable cache'
        uniqueItems: true
        ui:widget: checkboxes
```

## Markdown text blocks

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

Conditions use Javascript equality operators.

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

### template.yaml

```yaml
spec:
  parameters:
    - $yaml: https://github.com/example/path/to/example.yaml
    - title: Fill in some steps
      properties:
        path:
          title: path
          type: string

  steps:
    - $yaml: https://github.com/example/path/to/action.yaml

    - id: fetch
      name: Fetch template
      action: fetch:template
      input:
        url: ${{ parameters.path if parameters.path else '/root' }}
```

### example.yaml

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

```yaml
id: publish
name: Publish files
action: publish:github
input:
  repoUrl: ${{ parameters.url }}
```
