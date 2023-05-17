---
'@backstage/plugin-scaffolder-react': patch
---

fixed refresh problem when backstage backend disconnects without any feedback to user. Now we send a generic message and try to reconnect after 15 seconds
