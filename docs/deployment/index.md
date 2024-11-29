---
id: index
title: Deploying Backstage
sidebar_label: Overview
description: Packaging Backstage and deploying to production
---

Backstage provides tooling to build Docker images, but can be deployed with or
without Docker on many different infrastructures. The _best_ way to deploy
Backstage is in _the same way_ you deploy other software at your organization.

This documentation shows common examples that may be useful when deploying
Backstage for the first time, or for those without established deployment
practices.

:::note Note

The _easiest_ way to explore Backstage is to visit the
[live demo site](https://demo.backstage.io).

:::

At Spotify, we deploy software generally by:

1. Building a Docker image
2. Storing the Docker image on a container registry
3. Referencing the image in a Kubernetes Deployment YAML
4. Applying that Deployment to a Kubernetes cluster

This method is covered in [Building a Docker image](docker.md) and
[Deploying with Kubernetes](k8s.md).

There are many ways to deploy Backstage! You can find more examples in the community contributed guides found [here](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/).

If you need to run Backstage behind a corporate proxy, this
[contributed guide](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/help-im-behind-a-corporate-proxy.md)
may help.
