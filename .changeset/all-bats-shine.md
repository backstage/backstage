---
'@backstage/cli': patch
---

Updated the WebPack configuration to use `contenthash`. This fixes an issue were builds would sometimes generate output files with the same name but different content across builds, leading to breakages when loading the frontend app.
