---
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': patch
---

Fixed the Confluence to Markdown action leaking a file handle for every attachment it downloaded. A download that failed partway through also left the scaffolder step hanging. It now fails with the underlying error.
