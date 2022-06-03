---
'@backstage/plugin-techdocs-backend': patch
---

In order to ensure a good, stable TechDocs user experience when running TechDocs with `techdocs.builder` set to `local`, the number of concurrent builds has been limited to 10. Any additional builds requested concurrently will be queued and handled as prior builds complete. In the unlikely event that you need to handle more concurrent builds, consider scaling out your TechDocs backend deployment or using the `external` option for `techdocs.builder`.
