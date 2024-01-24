---
'@backstage/plugin-azure-devops-backend': patch
---

Fixed bug with `extractPartsFromAsset` that resulted in a leading `.` being removed from the path in an otherwise valid path (ex. `.assets/image.png`). The leading `.` will now only be moved for paths beginning with `./`.
