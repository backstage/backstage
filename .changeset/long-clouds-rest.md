---
'@backstage/cli': patch
---

Introduce `--deprecated` option to `config:check` to log all deprecated app configuration properties

```sh
$ yarn backstage-cli config:check --lax --deprecated
config:check --lax --deprecated
Loaded config from app-config.yaml
The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
```
