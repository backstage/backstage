---
'@backstage/plugin-catalog-backend-module-puppetdb': patch
---

Added `latest_report_status` parameter from the PuppetDB node api and added it as a tag to the nodes. The status is valuable information as it displays which nodes are compliant to your configuration and which ones are failing are making changes.
