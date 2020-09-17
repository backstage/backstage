# Backstage Helm Chart

## App/Frontend Values

| Parameter                   | Description                                               | Default             |
| --------------------------- | --------------------------------------------------------- | ------------------- |
| app.enabled                 | Whether to render the frontend app config or not          | `true`              |
| app.nameOverride            | Override the name given to the app/frontend               | `""`                |
| app.fullnameOverride        | Override the full name of the app/frontend                | `""`                |
| app.replicaCount            | The number of replicas for the app/frontend               | `1`                 |
| app.image.repository        | The image repository of the app/frontend container        | `spotify/backstage` |
| app.image.tag               | The app/frontend tag to pull                              | `latest`            |
| app.image.pullPolicy        | Image pull policy                                         | `Always`            |
| app.service.type            | The service type for the app/frontend service             | `ClusterIP`         |
| app.service.port            | The port for the app/frontend                             | `80`                |
| app.ingress.enabled         | Whether to create ingress or not                          | `false`             |
| app.ingress.annotations     | Annotations for the app/frontend ingress                  | `{}`                |
| app.ingress.hosts[].host    | Hostname for the app/frontend                             | `backstage.local`   |
| app.ingress.hosts[].paths[] | Path name to serve the app/frontend on                    | `["/"]`             |
| app.imagePullSecrets[]      | Any image secrets you need to pull `app.image.repository` | `[]`                |
| app.podSecurityContext      | Security context for the app/frontend pods                | `{}`                |
| app.securityContext         | Security context settings for the deployment              | `{}`                |
| app.resources               | Kubernetes Pod resource requests/limits                   | `{}`                |
| app.nodeSelector            | Node selectors for scheduling app/frontend pods           | `{}`                |
| app.tolerations             | Tolerations for scheduling app/frontend pods              | `{}`                |
| app.affinity                | Affinity settings for scheduling app/frontend pods        | `{}`                |

## Backend Values

| Parameter                       | Description                                                   | Default             |
| ------------------------------- | ------------------------------------------------------------- | ------------------- |
| backend.enabled                 | Whether to render the backend config or not                   | `true`              |
| backend.nameOverride            | Override the name given to the backend                        | `""`                |
| backend.fullnameOverride        | Override the full name of the backend                         | `""`                |
| backend.replicaCount            | The number of replicas for the backend                        | `1`                 |
| backend.image.repository        | The image repository of the backend container                 | `spotify/backstage` |
| backend.image.tag               | The backend tag to pull                                       | `latest`            |
| backend.image.pullPolicy        | Image pull policy                                             | `Always`            |
| backend.service.type            | The service type for the backend service                      | `ClusterIP`         |
| backend.service.port            | The port for the backend                                      | `80`                |
| backend.ingress.enabled         | Whether to create ingress or not                              | `false`             |
| backend.ingress.annotations     | Annotations for the backend ingress                           | `{}`                |
| backend.ingress.hosts[].host    | Hostname for the backend                                      | `backstage.local`   |
| backend.ingress.hosts[].paths[] | Path name to serve the backend on                             | `["/"]`             |
| backend.imagePullSecrets[]      | Any image secrets you need to pull `backend.image.repository` | `[]`                |
| backend.podSecurityContext      | Security context for the backend pods                         | `{}`                |
| backend.securityContext         | Security context settings for the deployment                  | `{}`                |
| backend.resources               | Kubernetes Pod resource requests/limits                       | `{}`                |
| backend.nodeSelector            | Node selectors for scheduling backend pods                    | `{}`                |
| backend.tolerations             | Tolerations for scheduling backend pods                       | `{}`                |
| backend.affinity                | Affinity settings for scheduling backend pods                 | `{}`                |
