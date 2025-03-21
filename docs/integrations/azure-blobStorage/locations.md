---
id: locations
sidebar_label: Locations
title: Azure Blob Storage account Locations
# prettier-ignore
description: Setting up an integration with Azure Blob Storage account
---

The Azure Blob Storage account integration supports loading catalog entities from an blob storage account container.
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your `app-config.yaml`:

Using Azure active directory credentials:

```yaml
integrations:
  azureBlobStorage:
    - accountName: ${ACCOUNT_NAME} # required
      endpoint: ${CUSTOM_ENDPOINT} # custom endpoint will require either aadCredentials or sasToken
      aadCredential:
        clientId: ${CLIENT_ID}
        tenantId: ${TENANT_ID}
        clientSecret: ${CLIENT_SECRET}
```

Using Azure storage account SAS token:

```yaml
integrations:
  azureBlobStorage:
    - accountName: ${ACCOUNT_NAME} # required
      endpoint: ${CUSTOM_ENDPOINT} # custom endpoint will require either aadCredentials or sasToken
      sasToken: ${SAS_TOKEN}
```

Using Azure storage account access key:

```yaml
integrations:
  azureBlobStorage:
    - accountName: ${ACCOUNT_NAME} # required
      endpoint: ${CUSTOM_ENDPOINT} # custom endpoint will require either aadCredentials or sasToken
      accountKey: ${ACCOUNT_KEY}
```
