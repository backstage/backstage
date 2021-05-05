---
'@backstage/backend-common': minor
---

Refactor the `runDockerContainer(…)` function to an interface-based api.
This gives the option to replace the docker runtime in the future.

Packages and plugins that previously used the `dockerode` as argument should be migrated to use the new `ContainerRunner` interface instead.

```diff
  import {
-   runDockerContainer,
+   ContainerRunner,
    PluginEndpointDiscovery,
  } from '@backstage/backend-common';
- import Docker from 'dockerode';

  type RouterOptions = {
    // ...
-   dockerClient: Docker,
+   containerRunner: ContainerRunner;
  };

  export async function createRouter({
    // ...
-   dockerClient,
+   containerRunner,
  }: RouterOptions): Promise<express.Router> {
    // ...

+   await containerRunner.runContainer({
-   await runDockerContainer({
      image: 'docker',
      // ...
-     dockerClient,
    });

    // ...
  }
```

To keep the `dockerode` based runtime, use the `DockerContainerRunner` implementation:

```diff
+ import {
+   ContainerRunner,
+   DockerContainerRunner
+ } from '@backstage/backend-common';
- import { runDockerContainer } from '@backstage/backend-common';

+ const containerRunner: ContainerRunner = new DockerContainerRunner({dockerClient});
+ await containerRunner.runContainer({
- await runDockerContainer({
    image: 'docker',
    // ...
-   dockerClient,
  });
```
