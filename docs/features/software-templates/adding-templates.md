---
id: adding-templates
title: Adding your own Templates
description: Documentation on Adding your own Templates
---

Templates are stored in the **Software Catalog** under a kind `Template`. The
minimum that is needed to define a template is a `template.yaml` file, but it
would be good to also have some files in there that can be templated in.

A simple `template.yaml` definition might look something like this:

```yaml
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
```

[Template Entity](../software-catalog/descriptor-format.md#kind-template)
contains more information about the required fields.

Once we have a `template.yaml` ready, we can then add it to the software catalog
for use by the scaffolder.

> Note: When you add or modify a template, you will need to refresh the location entity.
> Otherwise, Backstage won't display the template in the available templates,
> or it will keep showing the old template. You can refresh the location instance by
> going into `Catalog` web page, choosing `Locations` instead of `Components`, and selecting the correct location entity.
> From there, you can click on the refresh icon representing "Scheduled entity refresh" action.
> Afterwards, you should see your template updated.

You can add the template files to the catalog through
[static location configuration](../software-catalog/configuration.md#static-location-configuration),
for example:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/software-templates/blob/main/scaffolder-templates/react-ssr-template/template.yaml
      rules:
        - allow: [Template]
    - type: file
      target: template.yaml # Backstage will expect the file to be in packages/backend/template.yaml
```

Or you can add the template using the `catalog-import` plugin, which unless
configured differently should be running on `/catalog-import`.

For information about writing your own templates, you can check out the docs
[here](./writing-templates.md)
