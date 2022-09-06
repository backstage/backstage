---
'@backstage/backend-common': patch
---

Implemented KubernetesContainerRunner: a ContainerRunner implementation that leverages Jobs on a kubernetes cluster

```ts
const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();

const options: KubernetesContainerRunnerOptions = {
  kubeConfig,
  // namespace where Jobs will be created
  namespace: 'default',
  // Jobs name will be prefixed with this name
  name: 'my-runner',
  // An existing Kubernetes volume that will be used
  // as base for mounts
  mountBase: {
    volumeName: 'workdir',
    // Every mount must start with the base path
    // see example below
    basePath: '/workdir',
  },
  // Define a Pod template for the Jobs. It has to include
  // a volume definition named as the mountBase volumeName
  podTemplate: {
    spec: {
      containers: [],
      volumes: [
        {
          name: 'workdir',
          persistentVolumeClaim: {
            claimName: 'workdir-claim',
          },
        },
      ],
    },
  },
};
const containerRunner = new KubernetesContainerRunner(options);

const runOptions: RunContainerOptions = {
  imageName: 'golang:1.17',
  args: ['echo', 'hello world'],
  mountDirs: {
    '/workdir/app': '/app',
  },
};
containerRunner.runContainer(runOptions);
```
