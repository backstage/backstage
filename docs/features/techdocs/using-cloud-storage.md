---
id: using-cloud-storage
title: Using Cloud Storage for TechDocs generated files
description: Using Cloud Storage for TechDocs generated files
---

In the [TechDocs architecture](./architecture.md) you have the option to choose
where you want to store the Generated static files which TechDocs uses to render
documentation. In both the "Basic" and "Recommended" setup, you can add cloud
storage providers like Google GCS, Amazon AWS S3, etc. By default, TechDocs uses
the local filesystem of the `techdocs-backend` plugin in the "Basic" setup. And
in the recommended setup, having one of the cloud storage is a prerequisite.
Read more on the TechDocs Architecture documentation page.

On this page you can read how to enable them.

## Configuring Google GCS Bucket with TechDocs

Follow the
[official Google Cloud documentation](https://googleapis.dev/nodejs/storage/latest/index.html#quickstart)
for the latest instructions on the following steps involving GCP.

**1. Set `techdocs.publisher.type` config in your `app-config.yaml`**

Set `techdocs.publisher.type` to `'googleGcs'`.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
```

**2. GCP (Google Cloud Platform) Project**

Create or choose a dedicated GCP project. Set
`techdocs.publisher.googleGcs.projectId` to the project ID.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
  googleGcs:
    projectId: 'gcp-project-id'
```

**3. Service account API key**

Create a new Service Account and a key associated with it. In roles of the
service account, use "Storage Admin".

If you want to create a custom role, make sure to include both `get` and
`create` permissions for both "Objects" and "Buckets". See
https://cloud.google.com/storage/docs/access-control/iam-permissions

A service account can have many keys. Open your newly created account's page (in
IAM & Admin console), and create a new key. Use JSON format for the key.

A `<GCP-PROJECT-ID-random-uid>.json` file will be downloaded. This is the secret
key TechDocs will use to make API calls. Make it available in your Backstage
server and/or your local development server and set it in the app config
`techdocs.publisher.googleGcs.credentials`.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      projectId: 'gcp-project-id'
      credentials:
        $file: '/path/to/google_application_credentials.json'
```

**4. GCS Bucket**

Create a dedicated bucket for TechDocs sites. techdocs-backend will publish
documentation to this bucket. TechDocs will fetch files from here to serve
documentation in Backstage.

Set the name of the bucket to `techdocs.publisher.googleGcs.bucketName`.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      projectId: 'gcp-project-id'
      credentials:
        $file: '/path/to/google_application_credentials.json'
      bucketName: 'name-of-techdocs-storage-bucket'
```

**5. That's it!**

Your Backstage app is now ready to use Google Cloud Storage for TechDocs, to
store the static generated documentation files.
