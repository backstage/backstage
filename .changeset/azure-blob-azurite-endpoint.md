---
'@backstage/integration': patch
---

Azure Blob Storage integrations now accept an endpoint whose path is the account name, such as `http://127.0.0.1:10000/devstoreaccount1`. This lets you use the Azurite emulator with the catalog.
