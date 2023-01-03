---
id: configuration
title: TechDocs Configuration Options
# prettier-ignore
description: Reference documentation for configuring TechDocs using app-config.yaml
---

Using the `app-config.yaml` in the Backstage app, you can configure TechDocs
using several options. This page serves as a reference to all the available
configuration options for TechDocs.

```yaml
# File: app-config.yaml

techdocs:
  # techdocs.generator is used to configure how documentation sites are generated using MkDocs.

  generator:
    # techdocs.generator.runIn can be either 'docker' or 'local'. This is to determine how to run the generator - whether to
    # spin up the techdocs-container docker image or to run mkdocs locally (assuming all the dependencies are taken care of).
    # You want to change this to 'local' if you are running Backstage using your own custom Docker setup and want to avoid running
    # into Docker in Docker situation. Read more here
    # https://backstage.io/docs/features/techdocs/getting-started#disable-docker-in-docker-situation-optional

    runIn: 'docker'

    # (Optional) techdocs.generator.dockerImage can be used to control the docker image used during documentation generation. This can be useful
    # if you want to use MkDocs plugins or other packages that are not included in the default techdocs-container (spotify/techdocs).
    # NOTE: This setting is only used when techdocs.generator.runIn is set to 'docker'.

    dockerImage: 'spotify/techdocs'

    # (Optional) techdocs.generator.pullImage can be used to disable pulling the latest docker image by default. This can be useful when you are
    # using a custom techdocs.generator.dockerImage and you have a custom docker login requirement. For example, you need to login to
    # AWS ECR to pull the docker image.
    # NOTE: Disabling this requires the docker image was pulled by other means before running the techdocs generator.

    pullImage: true

    mkdocs:
      # (Optional)  techdocs.generator.omitTechdocsCoreMkdocsPlugin can be used to disable automatic addition of techdocs-core plugin to the mkdocs.yaml files.
      # Defaults to false, which means that the techdocs-core plugin is always added to the mkdocs file.
      omitTechdocsCorePlugin: false

      # (Optional and not recommended) Configures the techdocs generator to
      # attempt to ensure an index.md exists falling back to using <docs-dir>/README.md
      # or README.md in case a default <docs-dir>/index.md is not provided.
      # Note that https://www.mkdocs.org/user-guide/configuration/#edit_uri behavior
      # will be broken in these scenarios.
      legacyCopyReadmeMdToIndexMd: false

  # techdocs.builder can be either 'local' or 'external.
  # Using the default build strategy, if builder is set to 'local' and you open a TechDocs page,
  # techdocs-backend will try to generate the docs, publish to storage and show the generated docs afterwords.
  # This is the "Basic" setup of the TechDocs Architecture.
  # Using the default build strategy, if builder is set to 'external' (or anything other than 'local'), techdocs-backend
  # will only fetch the docs and will NOT try to generate and publish.
  # In this case, we assume that docs are being built by an external process (e.g. in the CI/CD pipeline of the repository).
  # This is the "Recommended" setup of the architecture.
  # Note that custom build strategies may alter this behaviour.
  # Read more about the "Basic" and "Recommended" setups here https://backstage.io/docs/features/techdocs/architecture
  # Read more about build strategies here: https://backstage.io/docs/features/techdocs/concepts#techdocs-build-strategy

  builder: 'local'

  # techdocs.publisher is used to configure the Storage option, whether you want to use the local filesystem to store generated docs
  # or you want to use External storage providers like Google Cloud Storage, AWS S3, etc.

  publisher:
    # techdocs.publisher.type can be - 'local' or 'googleGcs' or 'awsS3' or 'azureBlobStorage'.
    # When set to 'local', techdocs-backend will create a 'static' directory at its root to store generated documentation files.
    # When set to 'googleGcs', techdocs-backend will use a Google Cloud Storage Bucket to store generated documentation files.
    # When set to 'awsS3', techdocs-backend will use an Amazon Web Service (AWS) S3 bucket to store generated documentation files.

    type: 'local'

    # Optional when techdocs.publisher.type is set to 'local'.

    local:
      # (Optional). Set this to specify where the generated documentation is stored.
      publishDirectory: '/path/to/local/directory'

    # Required when techdocs.publisher.type is set to 'googleGcs'. Skip otherwise.

    googleGcs:
      # (Required) Cloud Storage Bucket Name
      bucketName: 'techdocs-storage'

      # (Optional) Location in storage bucket to save files
      # If not set, the default location will be the root of the storage bucket
      bucketRootPath: '/'

      # (Optional) An API key is required to write to a storage bucket.
      # If missing, GOOGLE_APPLICATION_CREDENTIALS environment variable will be used.
      # https://cloud.google.com/docs/authentication/production
      credentials:
        $file: '/path/to/google_application_credentials.json'

    # Required when techdocs.publisher.type is set to 'awsS3'. Skip otherwise.

    awsS3:
      # (Required) AWS S3 Bucket Name
      bucketName: 'techdocs-storage'

      # (Optional) Location in storage bucket to save files
      # If not set, the default location will be the root of the storage bucket
      bucketRootPath: '/'

      # (Optional) The AWS account ID where the storage bucket is located.
      # Credentials for the account ID must be configured in the 'aws' app config section.
      # See the integration-aws-node package for details on how to configure credentials in
      # the 'aws' app config section.
      # https://www.npmjs.com/package/@backstage/integration-aws-node
      # If account ID is not set and no credentials are set, environment variables or aws config file will be used to authenticate.
      # https://www.npmjs.com/package/@aws-sdk/credential-provider-node
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
      accountId: ${TECHDOCS_AWSS3_ACCOUNT_ID}

      # (Optional) AWS credentials to use to write to the storage bucket.
      # This configuration section is now deprecated.
      # Configuring the account ID is now preferred, with credentials in the 'aws' app config section.
      # If credentials are not set and no account ID is set, environment variables or aws config file will be used to authenticate.
      # https://www.npmjs.com/package/@aws-sdk/credential-provider-node
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
      credentials:
        accessKeyId: ${TECHDOCS_AWSS3_ACCESS_KEY_ID_CREDENTIAL}
        secretAccessKey: ${TECHDOCS_AWSS3_SECRET_ACCESS_KEY_CREDENTIAL}

      # (Optional) AWS Region of the bucket.
      # If not set, AWS_REGION environment variable or aws config file will be used.
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
      region: ${AWS_REGION}

      # (Optional) Endpoint URI to send requests to.
      # If not set, the default endpoint is built from the configured region.
      # https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html#endpoint
      endpoint: ${AWS_ENDPOINT}

      # (Optional) Whether to use path style URLs when communicating with S3.
      # Defaults to false.
      # This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used to host tech docs.
      s3ForcePathStyle: false

      # (Optional) AWS Server Side Encryption
      # Defaults to undefined.
      # If not set, encrypted buckets will fail to publish.
      # https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-s3-encryption.html
      sse: 'aws:kms' # or AES256

    # Required when techdocs.publisher.type is set to 'azureBlobStorage'. Skip otherwise.

    azureBlobStorage:
      # (Required) Azure Blob Storage Container Name
      containerName: 'techdocs-storage'

      # (Required) An account name is required to write to a storage blob container.
      # https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key
      credentials:
        accountName: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_NAME}
        # (Optional) An account key is required to write to a storage container.
        # If missing,AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET environment variable will be used.
        # https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json
        accountKey: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_KEY}

  # (Optional and not recommended) Prior to version [0.x.y] of TechDocs, docs
  # sites could only be accessed over paths with case-sensitive entity triplets
  # e.g. (namespace/Kind/name). If you are upgrading from an older version of
  # TechDocs and are unable to perform the necessary migration of files in your
  # external storage, you can set this value to `true` to temporarily revert to
  # the old, case-sensitive entity triplet behavior.
  legacyUseCaseSensitiveTripletPaths: false

  # techdocs.cache is optional, and is only recommended when you've configured
  # an external techdocs.publisher.type above. Also requires backend.cache to
  # be configured with a valid cache store. Configure techdocs.cache.ttl to
  # enable caching of techdocs assets.
  cache:
    # Represents the number of milliseconds a statically built asset should
    # stay cached. Cache invalidation is handled automatically by the frontend,
    # which compares the build times in cached metadata vs. canonical storage,
    # allowing long TTLs (e.g. 1 month/year)
    ttl: 3600000

    # (Optional) The time (in milliseconds) that the TechDocs backend will wait
    # for a cache service to respond before continuing on as though the cached
    # object was not found (e.g. when the cache sercice is unavailable). The
    # default value is 1000
    readTimeout: 500
```
