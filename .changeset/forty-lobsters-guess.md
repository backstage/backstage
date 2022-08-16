---
'@backstage/plugin-sonarqube': minor
---

**BREAKING** This plugin now call the `sonarqube-backend` plugin instead of relying on the proxy plugin

The whole proxy's `'/sonarqube':` key can be removed from your configuration files.

Then head to the [README in sonarqube-backend plugin page](https://github.com/backstage/backstage/tree/master/plugins/sonarqube-backend/README.md) to learn how to set-up the link to your Sonarqube instances.
