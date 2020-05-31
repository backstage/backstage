# gitops-profiles

Welcome to the gitops-profiles plugin!
This plugin is for creating GitOps-managed Kubernetes clusters. Currently, it supports provisioning EKS clusters on GitHub via GitHub Actions.

_This plugin was created through the Backstage CLI_

## Plugin Development

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/gitops-clusters](http://localhost:3000/gitops-profiles).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.

## Use GitOps-API backend with Backstage

The backend of this plugin is written in Goland and its source code is available [here](https://github.com/chanwit/gitops-api) as a separate GitHub repository.
The binary of this plugin is available as a ready-to-use Docker image, [https://hub.docker.com/chanwit/gitops-api](https://hub.docker.com/chanwit/gitops-api).
To start using GitOps with Backstage, you have to start the backend using the following command:

```bash
$ docker run -d --init -p 3008:8080 chanwit/gitops-api
```

Please note that this plugin requires the backend to run on port 3008.

## Deploy on Kubernetes

This section shows am example to deploy Backstage with this gitops profiles plugin and its GitOps-API backend on Kubernetes.
To try this example, simply copy-n-paste the following yaml to a file named `deployment.yaml` and then run `kubectl apply -f deployment.yaml`.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: backstage
  name: backstage
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backstage
  template:
    metadata:
      labels:
        app: backstage
    spec:
      containers:
        - image: spotify/backstage:latest
          imagePullPolicy: Always
          name: backstage
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: gitops-api
  name: gitops-api
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitops-api
  template:
    metadata:
      labels:
        app: gitops-api
    spec:
      containers:
        - image: chanwit/gitops-api:latest
          imagePullPolicy: Always
          name: gitops-api
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: backstage
  name: backstage
  namespace: default
spec:
  ports:
    - port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: backstage
  type: NodePort
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: gitops-api
  name: gitops-api
  namespace: default
spec:
  ports:
    - port: 3008
      protocol: TCP
      targetPort: 8080
  selector:
    app: gitops-api
  type: ClusterIP
```
