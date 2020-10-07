---
id: deployment-k8s
title: Kubernetes
description: Documentation on Kubernetes and K8s Deployment
---

# Helm charts

An example Backstage app can be deployed in Kubernetes using the [Backstage Helm
charts][backstage-helm-charts]

First, choose a DNS name where backstage will be hosted create a yaml file for
your custom configuration.

```
appConfig:
  app:
    baseUrl: https://backstage.mydomain.com
    title: Backstage
  backend:
    baseUrl: https://backstage.mydomain.com
    cors:
      origin: https://backstage.mydomain.com
  lighthouse:
    baseUrl: https://backstage.mydomain.com/lighthouse-api
  techdocs:
    storageUrl: https://backstage.mydomain.com/api/techdocs/static/docs
    requestUrl: https://backstage.mydomain.com/api/techdocs

```

Then use it to run:

```
git clone https://github.com/spotify/backstage.git
cd contrib/chart/backstage
helm install -f backstage-mydomain.yaml backstage .
```

This command will deploy the following pieces:

- Backstage frontend
- Backstage backend with scaffolder and auth plugins
- (optional) a PostgreSQL instance
- lighthouse plugin
- ingress

After a few minutes Backstage should be up and running in your cluster under the
DNS specified earlier.

Make sure to create the appropriate DNS entry in your infrastructure. To find
the public IP address run:

```bash
$ kubectl get ingress
NAME                HOSTS   ADDRESS         PORTS   AGE
backstage-ingress   *       123.1.2.3       80      17m
```

> **NOTE**: this is not a production ready deployment.

For more information on how to customize the deployment check the
[README][charts-readme].

[backstage-helm-charts]:
  (https://github.com/spotify/backstage/tree/master/contrib/chart/backstage)
[charts-readme]:
  (https://github.com/spotify/backstage/tree/master/contrib/chart/backstage/README.md)
