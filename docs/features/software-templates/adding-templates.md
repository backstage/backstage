---
id: adding-templates
title: Adding your own Templates
---

Templates are stored in the **Service Catalog** under a kind `Template`. The
minimum that the a template skeleton needs is a `template.yaml` but it would be
good to also have some files in there that can be templated in.

A simple `template.yaml` definition might look something like this:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  # unique name per namespace for the template
  name: react-ssr-template
  # title of the template
  title: React SSR Template
  # a description of the template
  description:
    Next.js application skeleton for creating isomorphic web applications.
  # some tags to display in the frontend
  tags:
    - recommended
    - react
spec:
  # which templater key to use in the templaters builder
  templater: cookiecutter
  # what does this template create
  type: website
  # if the template is not in the current directory where this definition is kept then specfiy
  path: './template'
  # the schema for the form which is displayed in the frontend.
  # should follow JSON schema for forms: https://jsonforms.io/
  schema:
    required:
      - component_id
      - description
    properties:
      component_id:
        title: Name
        type: string
        description: Unique name of the component
      description:
        title: Description
        type: string
        description: Description of the component
```

[Template Entity](../software-catalog/descriptor-format.md#kind-template)
contains more information about the required fields.

Once we have a `template.yaml` ready, we can then add it to the service catalog
for use by the scaffolder.

Currently the catalog supports loading definitions from GitHub + Local Files. To
load from other places, not only will there need to be another preparer, but the
support to load the location will also need to be added to the Catalog.

You can add the template files to the catalog through
[static location configuration](../software-catalog/configuration.md#static-location-configuration),
for example

```yaml
catalog:
  locations:
    - type: github
      target: https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml
      rules:
        - allow: [Template]
```

Templates can also be added by posting the to the catalog directly. Note that if
you're doing this, you need to configure the catalog to allow template entities
to be ingested from any source, for example:

```yaml
catalog:
  rules:
    - allow: [Component, API, Template]
```

For loading from a file, the following command should work when the backend is
running:

```sh
curl \
  --location \
  --request POST 'localhost:7000/catalog/locations' \
  --header 'Content-Type: application/json' \
  --data-raw "{\"type\": \"file\", \"target\": \"${YOUR PATH HERE}/template.yaml\"}"
```

If loading from a Git location, you can run the following

```sh
curl \
  --location \
  --request POST 'localhost:7000/catalog/locations' \
  --header 'Content-Type: application/json' \
  --data-raw "{\"type\": \"github\", \"target\": \"https://${YOUR GITHUB REPO}blob/master/${PATH TO FOLDER}/template.yaml\"}"
```

This should then have added the catalog, and also should now be listed under the
create page at http://localhost:3000/create.

Alternatively, if you want to get setup with some mock templates that are
already provided, run the following to load those templates:

```
yarn lerna run mock-data
```

The `type` field which is chosen in the request to add the `template.yaml` to
the Service Catalog here, will be come the `PreparerKey` which will be used to
select the `Preparer` when creating a job.

### Adding form values in the Scaffolder Wizard

The `spec.schema` property in the
[Template Entity](../software-catalog/descriptor-format.md#kind-template) is a
`yaml` version of the JSON Form Schema standard.

Here you can define the key/values and then the wizard will convert this to a
form for the user to fill in when your template is selected.

You can find out much more about the standard and how to use it here:
https://jsonforms.io
