---
'@backstage/plugin-sonarqube': minor
---

**BREAKING** This plugin now call the sonarqube-backend plugin instead of relying on the proxy plugin

The whole proxy's `'/sonarqube':` key can be removed from your configuration files.

Then head to the sonarqube-backend plugin page to learn how to set-up the link to your sonarqube instances.
