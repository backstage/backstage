---
'@backstage/plugin-azure-devops-backend': minor
'@backstage/plugin-azure-devops-common': minor
'@backstage/plugin-azure-devops': minor
---

Azure DevOps supports mono repo now. if you want to use the mono repo services in Backstage components, then use the below annotation to get respective service/repo's `README.md` & `Build Pipeline`

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    dev.azure.com/project-repo: my-project/my-repo
    dev.azure.com/mono-repo-path: '/UserService'
    dev.azure.com/mono-repo-build-definition: 'UserService-BuildPipeline,UserService-DataPipeline'
spec:
  type: service
  # ...
```

- `dev.azure.com/mono-repo-path` will be the path of the service in mono repo
- `dev.azure.com/mono-repo-build-definition` will be the name of the Build Definition also it's supports one or more Builds separated by a comma.
