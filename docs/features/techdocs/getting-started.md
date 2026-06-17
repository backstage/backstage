---
id: getting-started
title: Getting Started
description: Getting Started Documentation
---

::::info
This documentation is written for the new frontend system, which is the default in new Backstage apps. If your Backstage app still uses the old frontend system, read the [old frontend system version of this guide](./getting-started--old.md) instead.
::::

If you haven't set up Backstage already, start [here](../../getting-started/index.md).

TechDocs functions as a plugin in Backstage, so you will need to use Backstage to use TechDocs. In newly scaffolded Backstage apps, created with the default `@backstage/create-app@latest` template, TechDocs is installed and wired into both the frontend and backend out of the box.

Now let us tweak some configurations to suit your needs.

## Setting the configuration

The configuration of TechDocs is based on three primary settings:

- `builder` - Determines whether the documentation is generated locally using the TechDocs backend or is built/published outside of Backstage and fetched for display from the configured publisher.
- `generator` - Determines whether the documentation is generated with a Docker image running `mkdocs` or with your own local copy of `mkdocs`.
- `publisher` - Specifies where the generated documentation is stored, such as on your local server or another location like a Google Cloud Storage bucket.

Out of the box, TechDocs is configured in `app-config.yaml` as:

```yaml
techdocs:
  builder: 'local' # Alternatives - 'external'
  generator:
    runIn: 'docker' # Alternatives - 'local'
  publisher:
    type: 'local' # Alternatives include 'googleGcs', 'awsS3', and other supported publishers. See configuration documentation for the full list.
```

This basic configuration allows you to get started quickly. It processes the component documentation, as follows:

- **builder = local** - uses the TechDocs backend to generate the docs, publish to storage, and show the generated docs.
- **generator.runIn = docker** - spins up the techdocs-container docker image running `mkdocs` inside it to process the documentation. The Docker image is automatically pulled by TechDocs.
- **publisher.type = local** - stores generated documentation files locally, by default in `@backstage/plugin-techdocs-backend/static/docs`, or in the path configured by `techdocs.publisher.local.publishDirectory`.

You can further refine the `generator` and `publisher` settings. **See [TechDocs Configuration Options](configuration.md) for complete configuration reference.**

### Should TechDocs Backend generate docs?

```yaml
techdocs:
  builder: 'local'
```

Note that we recommend generating docs on CI/CD instead. Read more in the "Basic" and "Recommended" sections of the [TechDocs Architecture](architecture.md). But if you want to get started quickly set `techdocs.builder` to `'local'` so that TechDocs Backend is responsible for generating documentation sites. If set to `'external'`, Backstage will assume that the sites are being generated on each entity's CI/CD pipeline, and are being stored in a storage somewhere.

When `techdocs.builder` is set to `'external'`, TechDocs becomes more or less a read-only experience where it serves static files from a storage containing all the generated documentation.

### Choosing storage (publisher)

TechDocs needs to know where to store generated documentation sites and where to fetch the sites from. This is managed by a [Publisher](./concepts.md#techdocs-publisher). Examples: Google Cloud Storage, Amazon S3, or local filesystem of Backstage server.

It is okay to use the local filesystem in a "basic" setup when you are trying out Backstage for the first time. At a later time, review [Using Cloud Storage](./using-cloud-storage.md).

```yaml
techdocs:
  builder: 'local'
  publisher:
    type: 'local'
```

### Disabling Docker in Docker situation (Optional)

You can skip this if your `techdocs.builder` is set to `'external'`.

The TechDocs Backend plugin runs a docker container with mkdocs installed to generate the frontend of the docs from source files (Markdown). If you are deploying Backstage using Docker, this will mean that your Backstage Docker container will try to run another Docker container for TechDocs Backend.

To avoid this problem, we have a configuration available. You can set a value in your `app-config.yaml` that tells the techdocs generator if it should run the `local` mkdocs or run it from `docker`. This defaults to running as `docker` if no config is provided.

```yaml
techdocs:
  builder: 'local'
  publisher:
    type: 'local'
  generator:
    runIn: local
```

Setting `generator.runIn` to `local` means you will have to make sure your environment is compatible with techdocs.

You will have to install the `mkdocs` and `mkdocs-techdocs-core` package from pip, optionally also `graphviz` and `plantuml` from your OS package manager (e.g. apt).

You can do so by including the following lines right above `USER node` of your `Dockerfile`:

```Dockerfile
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core
```

Please be aware that the version requirement could change, you need to check our [`Dockerfile`](https://github.com/backstage/techdocs-container/blob/main/Dockerfile) and make sure to match with it.

On a Debian-based Docker container, Python packages must be either installed using the OS package manager or within a virtual environment (see the [related PEP](https://peps.python.org/pep-0668/)). Alternative is to use e.g. [pipx](https://pypa.github.io/pipx/) for installing Python packages in an isolated environment.

The above Dockerfile snippet installs the latest `mkdocs-techdocs-core` package. Version numbers can be found in the corresponding [changelog](https://github.com/backstage/mkdocs-techdocs-core#changelog). In case you want to pin the version, use the example below:

```Dockerfile
RUN pip3 install mkdocs-techdocs-core==1.2.3
```

Note: We recommend Python version 3.11 or higher.

> Caveat: Please install the `mkdocs-techdocs-core` package after all other Python packages. The order is important to make sure we get correct version of some of the dependencies.

## Using TechDocs Addons

The TechDocs Addon framework lets you render React components in documentation pages. For installation instructions, available addon modules, and usage examples, see the dedicated [TechDocs Addons guide](./addons.md).

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
