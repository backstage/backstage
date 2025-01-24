---
'@backstage/cli': patch
---

Fixed the file path pattern of many static assets output as part of the frontend build process, where there was an extra `.` before the extension, leading to names like `image-af7946b..png`.
