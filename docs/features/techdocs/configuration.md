---
id: configuration
title: TechDocs Configuration Options
description: Reference documentation for configuring TechDocs using app-config.yaml
---

Using the `app-config.yaml` in the Backstage app, you can configure TechDocs using several options. This page serves as a reference to all the available configuration options for TechDocs.

## Generator Configuration

`techdocs.generator` is used to configure how documentation sites are generated using MkDocs.

### Run In

`techdocs.generator.runIn`

**Options:** `'docker'` or `'local'`

This determines how to run the generator - whether to spin up the techdocs-container docker image or to run mkdocs locally (assuming all the dependencies are taken care of).

You want to change this to `'local'` if you are running Backstage using your own custom Docker setup and want to avoid running into Docker in Docker situation. [Read more here](https://backstage.io/docs/features/techdocs/getting-started/#disabling-docker-in-docker-situation-optional).

**Example:**

```yaml
techdocs:
  generator:
    runIn: 'docker'
```

### Docker Image

`techdocs.generator.dockerImage`

(Optional) This can be used to control the docker image used during documentation generation. This can be useful if you want to use MkDocs plugins or other packages that are not included in the default techdocs-container (spotify/techdocs).

**Note:** This setting is only used when `techdocs.generator.runIn` is set to `'docker'`.

**Example:**

```yaml
techdocs:
  generator:
    runIn: 'docker'
    dockerImage: 'spotify/techdocs'
```

### Pull Image

`techdocs.generator.pullImage`

(Optional) This can be used to disable pulling the latest docker image by default. This can be useful when you are using a custom `techdocs.generator.dockerImage` and you have a custom docker login requirement. For example, you need to login to AWS ECR to pull the docker image.

**Note:** Disabling this requires the docker image was pulled by other means before running the techdocs generator.

**Example:**

```yaml
techdocs:
  generator:
    runIn: 'docker'
    dockerImage: 'custom-registry/techdocs'
    pullImage: false
```

### MkDocs Configuration

#### Omit TechDocs Core Plugin

`techdocs.generator.mkdocs.omitTechdocsCorePlugin`

(Optional) This can be used to disable automatic addition of techdocs-core plugin to the mkdocs.yaml files. Defaults to `false`, which means that the techdocs-core plugin is always added to the mkdocs file.

**Example:**

```yaml
techdocs:
  generator:
    mkdocs:
      omitTechdocsCorePlugin: false
```

#### Legacy Copy README to Index

`techdocs.generator.mkdocs.legacyCopyReadmeMdToIndexMd`

(Optional and not recommended) Configures the techdocs generator to attempt to ensure an index.md exists falling back to using `<docs-dir>/README.md` or `README.md` in case a default `<docs-dir>/index.md` is not provided.

**Note:** https://www.mkdocs.org/user-guide/configuration/#edit_uri behavior will be broken in these scenarios.

**Example:**

```yaml
techdocs:
  generator:
    mkdocs:
      legacyCopyReadmeMdToIndexMd: false
```

#### Default Plugins

`techdocs.generator.mkdocs.defaultPlugins`

(Optional) Configures the default plugins which should be added automatically to every mkdocs.yaml file. This simplifies the usage as e.g. styling plugins can be added once for all.

Make sure that the defined plugins are installed locally / in the Docker image. By default, only the techdocs-core plugin will be added (except if `omitTechdocsCorePlugin: true`).

**Example:**

```yaml
techdocs:
  generator:
    mkdocs:
      defaultPlugins: ['techdocs-core']
```

## Builder Configuration

`techdocs.builder`

**Options:** `'local'` or `'external'`

Using the default build strategy:

- If builder is set to `'local'` and you open a TechDocs page, techdocs-backend will try to generate the docs, publish to storage and show the generated docs afterwards. This is the **"Basic"** setup of the TechDocs Architecture.
- If builder is set to `'external'` (or anything other than `'local'`), techdocs-backend will only fetch the docs and will NOT try to generate and publish. In this case, we assume that docs are being built by an external process (e.g. in the CI/CD pipeline of the repository). This is the **"Recommended"** setup of the architecture.

**Note:** Custom build strategies may alter this behaviour.

[Read more about the "Basic" and "Recommended" setups](https://backstage.io/docs/features/techdocs/architecture)  
[Read more about build strategies](https://backstage.io/docs/features/techdocs/concepts#techdocs-build-strategy)

**Example:**

```yaml
techdocs:
  builder: 'local'
```

## Publisher Configuration

`techdocs.publisher`

This is used to configure the storage option, whether you want to use the local filesystem to store generated docs or you want to use external storage providers like Google Cloud Storage, AWS S3, etc.

### Publisher Type

`techdocs.publisher.type`

This determines where generated documentation files are stored.

**Options:**

- `'local'` - techdocs-backend will create a 'static' directory at its root to store generated documentation files
- `'googleGcs'` - techdocs-backend will use a Google Cloud Storage Bucket
- `'awsS3'` - techdocs-backend will use an Amazon Web Service (AWS) S3 bucket
- `'azureBlobStorage'` - techdocs-backend will use Azure Blob Storage

**Example:**

```yaml
techdocs:
  publisher:
    type: 'local'
```

### Local Storage

`techdocs.publisher.local`

This is used to configure the local storage option.

Optional when `techdocs.publisher.type` is set to `'local'`.

#### Publish Directory

`techdocs.publisher.local.publishDirectory`

(Optional) This specifies where the generated documentation is stored.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'local'
    local:
      publishDirectory: '/path/to/local/directory'
```

### Google Cloud Storage

`techdocs.publisher.googleGcs`

This is used to configure the Google Cloud Storage option.

Required when `techdocs.publisher.type` is set to `'googleGcs'`. Skip otherwise.

#### Bucket Name

`techdocs.publisher.googleGcs.bucketName`

(Required) The Cloud Storage Bucket Name

**Example:**

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'techdocs-storage'
```

#### Bucket Root Path

`techdocs.publisher.googleGcs.bucketRootPath`

(Optional) The Location in storage bucket to save files. If not set, the default location will be the root of the storage bucket.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'techdocs-storage'
      bucketRootPath: '/docs'
```

#### Credentials

`techdocs.publisher.googleGcs.credentials`

(Optional) An API key required to write to a storage bucket.
If missing `GOOGLE_APPLICATION_CREDENTIALS` environment variable will be used. https://cloud.google.com/docs/authentication/production

**Example:**

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'techdocs-storage'
      credentials:
        $file: '/path/to/google_application_credentials.json'
```

### AWS S3

`techdocs.publisher.awsS3`

This is used to configure the AWS S3 option.

Required when `techdocs.publisher.type` is set to `'awsS3'`. Skip otherwise.

#### Bucket Name

`techdocs.publisher.awsS3.bucketName`

(Required) The AWS S3 Bucket Name

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
```

#### Bucket Root Path

`techdocs.publisher.awsS3.bucketRootPath`

(Optional) The Location in storage bucket to save files. If not set, the default location will be the root of the storage bucket.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      bucketRootPath: '/documentation'
```

#### Account ID

`techdocs.publisher.awsS3.accountId`

The AWS account ID where the storage bucket is located. Credentials for the account ID must be configured in the `aws` app config section. See the [integration-aws-node package](https://www.npmjs.com/package/@backstage/integration-aws-node) for details on how to configure credentials in the `aws` app config section.

If account ID is not set and no credentials are set, environment variables or AWS config file will be used to authenticate.

https://www.npmjs.com/package/@aws-sdk/credential-provider-node
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      accountId: ${TECHDOCS_AWSS3_ACCOUNT_ID}
```

#### Credentials

`techdocs.publisher.awsS3.credentials`

(Optional) AWS credentials to use to write to the storage bucket. This configuration section is now **deprecated**. Configuring the account ID is now preferred, with credentials in the `aws` app config section.

If credentials are not set and no account ID is set, environment variables or AWS config file will be used to authenticate.

https://www.npmjs.com/package/@aws-sdk/credential-provider-node
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      credentials:
        accessKeyId: ${TECHDOCS_AWSS3_ACCESS_KEY_ID_CREDENTIAL}
        secretAccessKey: ${TECHDOCS_AWSS3_SECRET_ACCESS_KEY_CREDENTIAL}
```

#### Region

`techdocs.publisher.awsS3.region`

(Optional) The AWS Region of the bucket.
If not set, `AWS_REGION` environment variable or AWS config file will be used.

https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      region: ${AWS_REGION}
```

#### Endpoint

`techdocs.publisher.awsS3.endpoint`

(Optional) The Endpoint URI to send requests to.
If not set, the default endpoint is built from the configured region.

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html#endpoint

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      endpoint: ${AWS_ENDPOINT}
```

#### HTTPS Proxy

`techdocs.publisher.awsS3.httpsProxy`

(Optional) The HTTPS proxy to use for S3 Requests. Defaults to using no proxy. This allows docs to be published and read from behind a proxy.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      httpsProxy: ${HTTPS_PROXY}
```

#### S3 Force Path Style

`techdocs.publisher.awsS3.s3ForcePathStyle`

(Optional) Whether to use path style URLs when communicating with S3. Defaults to `false`. This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used to host tech docs.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      s3ForcePathStyle: true
```

#### Server Side Encryption

`techdocs.publisher.awsS3.sse`

(Optional) AWS Server Side Encryption. Defaults to undefined. If not set, encrypted buckets will fail to publish.

https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-s3-encryption.html

**Options:** `'aws:kms'` or `'AES256'`

**Example:**

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'techdocs-storage'
      sse: 'aws:kms'
```

### Azure Blob Storage

`techdocs.publisher.azureBlobStorage`

Required when `techdocs.publisher.type` is set to `'azureBlobStorage'`. Skip otherwise.

#### Container Name

`techdocs.publisher.azureBlobStorage.containerName`

(Required) Azure Blob Storage Container Name

**Example:**

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'techdocs-storage'
```

#### Connection String

`techdocs.publisher.azureBlobStorage.connectionString`

(Optional) Azure blob storage connection string. Can be useful for local testing through azurite. Defaults to undefined. If provided, takes higher priority, and `techdocs.publisher.azureBlobStorage.credentials` will become irrelevant.

**Example:**

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'techdocs-storage'
      connectionString: 'DefaultEndpointsProtocol=https;AccountName=...'
```

#### Credentials

`techdocs.publisher.azureBlobStorage.credentials`

(Required) An account name to write to a storage blob container.

https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key

(Optional) An account key is required to write to a storage container. If missing, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` environment variables will be used.

https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json

**Example:**

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'techdocs-storage'
      credentials:
        accountName: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_NAME}
        accountKey: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_KEY}
```

## Legacy Case Sensitive Triplet Paths

`techdocs.legacyUseCaseSensitiveTripletPaths`

(Optional and not recommended) Prior to version [0.x.y] of TechDocs, docs sites could only be accessed over paths with case-sensitive entity triplets e.g. (namespace/Kind/name). If you are upgrading from an older version of TechDocs and are unable to perform the necessary migration of files in your external storage, you can set this value to `true` to temporarily revert to the old, case-sensitive entity triplet behavior.

**Example:**

```yaml
techdocs:
  legacyUseCaseSensitiveTripletPaths: false
```

## Cache Configuration

`techdocs.cache`

(Optional) `techdocs.cache` is only recommended when you've configured an external `techdocs.publisher.type` above. Also requires `backend.cache` to be configured with a valid cache store. Configure `techdocs.cache.ttl` to enable caching of techdocs assets.

### TTL

`techdocs.cache.ttl`

Represents the number of milliseconds a statically built asset should stay cached. Cache invalidation is handled automatically by the frontend, which compares the build times in cached metadata vs. canonical storage, allowing long TTLs (e.g. 1 month/year).

**Example:**

```yaml
techdocs:
  cache:
    ttl: 3600000
```

### Read Timeout

`techdocs.cache.readTimeout`

(Optional) The time (in milliseconds) that the TechDocs backend will wait for a cache service to respond before continuing on as though the cached object was not found (e.g. when the cache service is unavailable). The default value is 1000.

**Example:**

```yaml
techdocs:
  cache:
    ttl: 3600000
    readTimeout: 500
```
