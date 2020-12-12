---
id: configuration
title: TechDocs Configuration Options
description:
  Reference documentation for configuring TechDocs using app-config.yaml
---

Using the `app-config.yaml` in the Backstage app, you can configure TechDocs
using several options. This page serves as a reference to all the available
configuration options for TechDocs.

```yaml
# File: app-config.yaml

techdocs:

  # TechDocs makes API calls to techdocs-backend using this URL. e.g. get docs of an entity, get metadata, etc.

  requestUrl: http://localhost:7000/api/techdocs


  # Just another route in techdocs-backend where TechDocs requests the static files from. This URL uses an HTTP middleware
  # to serve files from either a local directory or an External storage provider.

  storageUrl: http://localhost:7000/api/techdocs/static/docs


  # generators.techdocs can have two values: 'docker' or 'local'. This is to determine how to run the generator - whether to
  # spin up the techdocs-container docker image or to run mkdocs locally (assuming all the dependencies are taken care of).
  # You want to change this to 'local' if you are running Backstage using your own custom Docker setup and want to avoid running
  # into Docker in Docker situation. Read more here
  # https://backstage.io/docs/features/techdocs/getting-started#disable-docker-in-docker-situation-optional

  generators:
    techdocs: 'docker'


  # techdocs.builder can be either 'local' or 'external.
  # If builder is set to 'local' and you open a TechDocs page, techdocs-backend will try to generate the docs, publish to storage
  # and show the generated docs afterwords. This is the "Basic" setup of the TechDocs Architecture.
  # If builder is set to 'external', techdocs-backend will only fetch the docs and will NOT try to generate and publish. In this case of 'external',
  # we assume that docs are being built by an external process (e.g. in the CI/CD pipeline of the repository). This is the "Recommended" setup of
  # the architecture. Read more here https://backstage.io/docs/features/techdocs/architecture

  builder: 'local'


  # techdocs.publisher is used to configure the Storage option, whether you want to use the local filesystem to store generated docs
  # or you want to use External storage providers like Google Cloud Storage, AWS S3, etc.

  publisher:

    # techdocs.publisher.type can be - 'local' or 'googleGcs' (awsS3, azureStorage, etc. to be available as well).
    # When set to 'local', techdocs-backend will create a 'static' directory at its root to store generated documentation files.
    # When set to 'googleGcs', techdocs-backend will use a Google Cloud Storage Bucket to store generated documentation files.

    type: 'local'


    # Required when techdocs.publisher.type is set to 'googleGcs'. Skip otherwise.

    googleGcs:
      # An API key is required to write to a storage bucket.
      credentials:
        $file: '/path/to/google_application_credentials.json',

      # Your GCP Project ID where the Cloud Storage Bucket is hosted.
      projectId: 'gcp-project-id'

      # Cloud Storage Bucket Name
      bucketName: 'techdocs-storage',

```
