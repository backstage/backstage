---
id: creating-and-publishing
title: Creating and publishing your docs
sidebar_label: Creating and Publishing Documentation
---

This section will guide you through:

- Creating a basic setup for your documentation
- Writing and previewing your documentation in a local Backstage environment
- Creating a build ready for publication
- Publishing your documentation and making your Backstage instance read your
  published docs.

## Prerequisities

- [Docker](https://docs.docker.com/get-docker/)
- Static file hosting
- A working Backstage instance with TechDocs installed (see
  [TechDocs getting started](getting-started.md))

## Create a basic documentation setup

In your home directory (also known as `~`), create a directory that contains
your documentation (for example, `hello-docs`). Inside this directory, create a
file called `mkdocs.yml`. Below is a basic example of how it could look.

The `~/hello-docs/mkdocs.yml` file should have the following content:

```yaml
site_name: 'example-docs'

nav:
  - Home: index.md

plugins:
  - techdocs-core
```

The `~/hello-docs/docs/index.md` should have the following content:

```md
# example docs

This is a basic example of documentation.
```

## Writing and previewing your documentation

Using the `techdocs-cli` you can preview your docs inside a local Backstage
instance and get automatic recompilation on changes. This is useful for when you
want to write your documentation.

To do this you can run:

```bash
cd ~/hello-docs/
npx techdocs-cli serve
```

## Build production ready documentation

To get a build suitable for publication you can build your docs using the
`spotify/techdocs` container:

```bash
cd ~/hello-docs/
docker run -it -w /content -v $(pwd):/content spotify/techdocs build
```

You should now have a folder called `~/hello-docs/site/`.

## Deploy to a file server

In order to serve documentation to TechDocs, our Backstage plugin needs to
download the HTML rendered from the previous step. This will likely exist on an
external file server, or a storage solution such as Google Cloud Storage.

When deploying documentation, it should be deployed on that file server/storage
solution with the following convention: `{id}/{file}`. For example, if you want
to upload the `getting-started/index.html` file for the `backstage`
documentation site, we would upload it to our file server as
`backstage/getting-started/index.html`.

To explain further what this would look like for multiple documentation sites,
take a look at this example file tree that would be represented on your file
server:

```md
/backstage/index.html /backstage/getting-started/index.html
/backstage/contributing/index.html /mkdocs/index.html
/mkdocs/plugin-development/index.html
/mkdocs/plugin-development/debugging/index.html
```

In this file tree, we have two documentation sites available: `backstage` and
`mkdocs`. Each of them expose several pages. Let's say both of these are hosted
on `http://example.com` as the server URL.

When you configure the TechDocs plugin in Backstage to use `http://example.com`
as the file server/storage solution, it will translate the following URLs to the
file server:

| Backstage URL                                             | File Server URL                                         |
| --------------------------------------------------------- | ------------------------------------------------------- |
| https://demo.backstage.io/docs/backstage/                 | http://example.com/backstage/index.html                 |
| https://demo.backstage.io/docs/mkdocs/plugin-development/ | http://example.com/mkdocs/plugin-development/index.html |

Then deploying new sites is easy: simply copy over the `site/` folder produced
in the [Create documentation](#build-production-ready-documentation) step above
to the file server/storage solution under the ID of the documentation site. It
will then become immediately available in Backstage under the same ID as you can
see in the table above.

So, if the URL to your file server is `http://example.com/`, your
`~/hello-docs/site` folder containing the documentation should be accessible at
`http://example.com/hello-docs/`.

## Configure TechDocs to read from file server

In order for Backstage to show your documentation, it needs to know where you
uploaded it.

Make sure you have Backstage set up using
[TechDocs getting started](getting-started.md).

To point Backstage to your docs storage, add or change the following lines in
your Backstage `app-config.yaml`:

```yaml
techdocs:
  storageUrl: http://example.com
```

You can now start Backstage using `yarn start` and open up your browser at
`http://localhost:3000/docs/hello-docs` to view your docs.
