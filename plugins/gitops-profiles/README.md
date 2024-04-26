# gitops-profiles

Welcome to the gitops-profiles plugin!
This plugin is for creating GitOps-managed Kubernetes clusters. Currently, it supports provisioning EKS clusters on GitHub via GitHub Actions.

_This plugin was created through the Backstage CLI_

## Plugin Development

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/gitops-clusters](http://localhost:3000/gitops-profiles).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Use GitOps-API backend with Backstage

The backend of this plugin is written in Golang and its source code is available [here](https://github.com/chanwit/gitops-api) as a separate GitHub repository.
The binary of this plugin is available as a ready-to-use Docker image, [https://hub.docker.com/chanwit/gitops-api](https://hub.docker.com/chanwit/gitops-api).
To start using GitOps with Backstage, you have to start the backend using the following command:

```bash
$ docker run -d --init -p 3008:8080 chanwit/gitops-api
```

Please note that this plugin requires the backend to run on port 3008.
