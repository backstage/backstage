---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Add custom action for merge request: **auto**

The **Auto** action selects the committed action between _create_ and _update_.

The **Auto** action fetches files using the **/projects/repository/tree endpoint**.
After fetching, it checks if the file exists locally and in the repository. If it does, it chooses **update**; otherwise, it chooses **create**.
