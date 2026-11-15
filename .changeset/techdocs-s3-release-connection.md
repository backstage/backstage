---
'@backstage/plugin-techdocs-node': patch
---

Fixed TechDocs served from AWS S3 leaking S3 connections when a browser navigates away before a file is fully loaded. Over time the connection pool was exhausted and all TechDocs pages failed to load with `Socket timed out without establishing a connection` errors until the backend was restarted.
