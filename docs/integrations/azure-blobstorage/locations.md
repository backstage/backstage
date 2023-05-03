---
id: locations
title: Azure BlobStorage Locations
sidebar_label: Locations
# prettier-ignore
description: Integrating source code stored in BlobStorage Storage into the Backstage catalog
---

The Azure BlobStorage integration supports loading catalog entities from Azure
BlobStorage. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  azureBlobStorage:
    - accountName: account123
      secretAccessKey: ${AZURE_BLOB_SAS_TOKEN}
```

The configuration is a structure with two elements:

- `accountName`: The BlobStorage host; only `{accountName}.blob.core.windows.net` is supported.
- `secretAccessKey` (optional): A SAS token; including the leading `?`.
