---
'@backstage/plugin-techdocs-node': patch
---

Fixed TechDocs served from Azure Blob Storage or Google Cloud Storage keeping storage connections open when a browser navigates away before a file is fully loaded. Errors that occur while streaming a file from Azure Blob Storage are now also logged and handled, instead of being left unhandled.
