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
        ui:options:
          addable: false
          orderable: false
          removable: false
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

## Use parameters as condition in steps

```yaml
- name: Only development environments
  if: ${{ parameters.environment === "staging" and parameters.environment === "development" }}
  action: debug:log
  input:
    message: 'development step'

- name: Only production environments
  if: ${{ parameters.environment === "prod" or parameters.environment === "production" }}
  action: debug:log
  input:
    message: 'production step'
```
