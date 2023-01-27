---
'@backstage/plugin-azure-devops-backend': patch
---

Fixed a bug where the azure devops host in URLs on the readme card was being URL encoded, breaking hosts with ports.
