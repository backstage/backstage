---
'@backstage/plugin-jenkins-backend': patch
---

feature: provide access token to JenkinsInstanceConfig. It can be passed to other backend calls if authentication enabled. DefaultJenkinsInfoProvider sends always this token to catalog api if access token exists.
