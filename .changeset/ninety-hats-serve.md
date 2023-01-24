---
'@backstage/plugin-catalog-backend-module-azure': patch
---

This will add the ability to use Azure DevOps with multi project with a single value which is a new feature as previously this had to be done manually for each project that you wanted to add.

Right now you would have to fill in multiple values in the config to use multiple projects:

```
yourFirstProviderId: # identifies your dataset / provider independent of config changes
    organization: myorg
    project: 'firstProject' # this will match the firstProject project
    repository: '*' # this will match all repos
    path: /catalog-info.yaml
yourSecondProviderId: # identifies your dataset / provider independent of config changes
    organization: myorg
    project: 'secondProject' # this will match the secondProject project
    repository: '*' # this will match all repos
    path: /catalog-info.yaml
```

With this change you can actually have all projects available where your PAT determines which you have access to, so that includes multiple projects:

```
yourFirstProviderId: # identifies your dataset / provider independent of config changes
    organization: myorg
    project: '*' # this will match all projects where your PAT has access to
    repository: '*' # this will match all repos
    path: /catalog-info.yaml
```
