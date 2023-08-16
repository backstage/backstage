---
'@backstage/plugin-techdocs-node': minor
---

Added connection string option to `techdocs.publisher.azureBlobStorage`

These changes are **required** to `docs/features/techdocs/configuration.md` and `plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts`

```diff
diff --git a/docs/features/techdocs/configuration.md b/docs/features/techdocs/configuration.md
index a8d302c..687ad3c 100644
--- a/docs/features/techdocs/configuration.md
+++ b/docs/features/techdocs/configuration.md
@@ -158,10 +158,11 @@ techdocs:
       # (Required) Azure Blob Storage Container Name
       containerName: 'techdocs-storage'

-      # (Optional) Azurite connection string for local testing.
+      # (Optional) Azure blob storage connection string.
+      # Can be useful for local testing through azurite
       # Defaults to undefined
       # if provided, takes higher priority, 'techdocs.publisher.azureBlobStorage.credentials' will become irrelevant
-      azuriteConnectionString: ''
+      connectionString: ''

       # (Required) An account name is required to write to a storage blob container.
       # https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key
diff --git a/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts b/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
index 5f19b80..db2c380 100644
--- a/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
+++ b/plugins/techdocs-node/src/stages/publish/azureBlobStorage.ts
@@ -83,13 +83,16 @@ export class AzureBlobStoragePublish implements PublisherBase {
         'techdocs.legacyUseCaseSensitiveTripletPaths',
       ) || false;

-    // Give more priority for azurite, if configured, return the AzureBlobStoragePublish object here itself
-    const azuriteConnString = config.getOptionalString(
-      'techdocs.publisher.azureBlobStorage.azuriteConnectionString',
-    );
-    if (azuriteConnString) {
+    // Give more priority for connectionString, if configured, return the AzureBlobStoragePublish object here itself
+    const connectionStringKey =
+      'techdocs.publisher.azureBlobStorage.connectionString';
+    const connectionString = config.getOptionalString(connectionStringKey);
+    if (connectionString) {
+      logger.info(
+        `using ${connectionStringKey} string to create BlobServiceClient`,
+      );
       const storageClient =
-        BlobServiceClient.fromConnectionString(azuriteConnString);
+        BlobServiceClient.fromConnectionString(connectionString);
       return new AzureBlobStoragePublish({
         storageClient: storageClient,
         containerName: containerName,
```
