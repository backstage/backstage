# Catalog Backend Module for GCP

This is an extension module to the plugin-catalog-backend plugin, containing catalog processors and providers to ingest GCP resources as `Resource` kind entities.

## Authentication

The GKE Entity Provider supports two authentication methods:

1. **Service Account Credentials** (recommended for production): Provide Google Service Account credentials directly in the configuration
2. **Application Default Credentials**: If no credentials are provided, the provider falls back to:
   - `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a service account key file
   - Google Cloud SDK default credentials (when running on Google Cloud Platform)

## installation

Register the plugin in `catalog.ts``

```typescript
import { GkeEntityProvider } from '@backstage/plugin-catalog-backend-module-gcp';

...

builder.addEntityProvider(
  GkeEntityProvider.fromConfig({
    logger: env.logger,
    scheduler: env.scheduler,
    config: env.config
  })
);
```

Update `app-config.yaml` as follows:

```yaml
catalog:
  providers:
    gcp:
      gke:
        parents:
          # consult https://cloud.google.com/kubernetes-engine/docs/ for valid values
          # list all clusters in the project
          - 'projects/some-project/locations/-'
          # list all clusters in the region, in the project
          - 'projects/some-other-project/locations/some-region'
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
        # Optional: Google Service Account credentials for authentication
        # If not provided, falls back to Application Default Credentials or GOOGLE_APPLICATION_CREDENTIALS
        googleServiceAccountCredentials: |
          {
            "type": "service_account",
            "project_id": "your-project-id",
            "private_key_id": "key-id",
            "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
            "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
            "client_id": "client-id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
          }
        # Optional: Authentication provider for Kubernetes clusters
        # Defaults to 'google' if not specified
        # Common values: 'google', 'googleServiceAccount'
        authProvider: googleServiceAccount
        # Optional: Owner of the discovered GKE clusters
        # Defaults to 'unknown' if not specified
        owner: platform-team
```
