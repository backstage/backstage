---
'@backstage/integration': patch
'@backstage/backend-defaults': patch
---

Azure Blob Storage integrations now accept path-style endpoints where the path is the account name, such as `http://127.0.0.1:10000/devstoreaccount1` for the Azurite emulator, and the URL reader can read blobs through them. This makes it possible to use Azurite with the Azure Blob Storage catalog entity provider.
