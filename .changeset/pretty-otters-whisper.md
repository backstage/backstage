---
'@backstage/plugin-techdocs-node': minor
---

Add azurite support in techdocs through `techdocs.publisher.azureBlobStorage.azuriteConnectionString`

These changes are **required** to `plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts` and `docs/features/techdocs/configuration.md`

```diff
diff --git a/docs/features/techdocs/configuration.md b/docs/features/techdocs/configuration.md
index 49ee9d7..a8d302c 100644
--- a/docs/features/techdocs/configuration.md
+++ b/docs/features/techdocs/configuration.md
@@ -158,6 +158,11 @@ techdocs:
       # (Required) Azure Blob Storage Container Name
       containerName: 'techdocs-storage'

+      # (Optional) Azurite connection string for local testing.
+      # Defaults to undefined
+      # if provided, takes higher priority, 'techdocs.publisher.azureBlobStorage.credentials' will become irrelevant
+      azuriteConnectionString: ''
+
       # (Required) An account name is required to write to a storage blob container.
       # https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key
       credentials:
diff --git a/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts b/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
index bcbc10a..5f19b80 100644
--- a/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
+++ b/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
@@ -78,6 +78,26 @@ export class AzureBlobStoragePublish implements PublisherBase {
       );
     }

+    const legacyPathCasing =
+      config.getOptionalBoolean(
+        'techdocs.legacyUseCaseSensitiveTripletPaths',
+      ) || false;
+
+    // Give more priority for azurite, if configured, return the AzureBlobStoragePublish object here itself
+    const azuriteConnString = config.getOptionalString(
+      'techdocs.publisher.azureBlobStorage.azuriteConnectionString',
+    );
+    if (azuriteConnString) {
+      const storageClient =
+        BlobServiceClient.fromConnectionString(azuriteConnString);
+      return new AzureBlobStoragePublish({
+        storageClient: storageClient,
+        containerName: containerName,
+        legacyPathCasing: legacyPathCasing,
+        logger: logger,
+      });
+    }
+
     let accountName = '';
     try {
       accountName = config.getString(
@@ -108,11 +128,6 @@ export class AzureBlobStoragePublish implements PublisherBase {
       credential,
     );

-    const legacyPathCasing =
-      config.getOptionalBoolean(
-        'techdocs.legacyUseCaseSensitiveTripletPaths',
-      ) || false;
-
     return new AzureBlobStoragePublish({
       storageClient: storageClient,
       containerName: containerName,
```
