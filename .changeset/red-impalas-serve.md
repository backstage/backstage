---
'@backstage/techdocs-common': patch
---

Adds custom docker image support to the techdocs generator. This change adds a new `techdocs.generator` configuration key and deprecates the existing `techdocs.generators.techdocs` key.

```yaml
techdocs:
  # recommended, going forward:
  generator:
    runIn: 'docker' # or 'local'
    # New optional settings
    dockerImage: my-org/techdocs # use a custom docker image
    pullImage: false # disable automatic pulling of image (e.g. if custom docker login is required)
  # legacy (deprecated):
  generators:
    techdocs: 'docker' # or 'local'
```
