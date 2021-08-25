---
'@backstage/integration': patch
---

Take custom ports into account when matching integrations to URLs. It used to be the case that an integration with e.g. `host: 'scm.mycompany.net:8080'` would not be matched by the `byUrl` method, while hosts without a custom port did match.
