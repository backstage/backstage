# Plain Kubernetes Deployment

This directory contains an example of a simple Kubernetes deployment of Backstage. It is not intended to serve as a complete production deployment, but as a starting point for setting one up.

## Usage

You can try the deployment out as is. The easiest way is to use [Docker Desktop](https://www.docker.com/products/docker-desktop) with [Kubernetes](https://docs.docker.com/get-started/kube-deploy/).

From a fresh clone of this repo, run the following in the root:

```bash
yarn install

yarn docker-build

kubectl apply -f contrib/kubernetes/plain_single_backend_deployment/deployment.yaml
```

You can use the following commands to monitor the deployment:

```bash
# List all resources in the backstage namespace
kubectl -n backstage get all

# Inspect the status of the deployment resource
kubectl -n backstage describe deployment backstage-backend

# Inspect the status of the pod running the backstage backend
kubectl -n backstage describe pod -l app=backstage,component=backend
```

Once the deployment is up and running, you can use the following to set up a proxy to reach the backend locally:

```bash
kubectl proxy
```

With the proxy up and running, you should be able to navigate to [http://localhost:8001/api/v1/namespaces/backstage/services/backstage-backend:http/proxy](http://localhost:8001/api/v1/namespaces/backstage/services/backstage-backend:http/proxy) and see Backstage. Note that you'll end up on a 404 page, but hitting the home icon in the sidebar should take you to the catalog page where you can see a few example services.

## Caveats

This deployment is for demonstration purposes only, for a production deployment you will need to set up at least a persistent database and some form of ingress. If your organization doesn't already have established patterns for these, you could look at options of managed PostgreSQL instances from cloud providers, or something like Zalando's [postgres-operator](https://github.com/zalando/postgres-operator). For ingress there are also [plenty of options](https://ramitsurana.gitbook.io/awesome-kubernetes/docs/projects/projects#load-balancing), where `nginx` is a popular choice to get started.
