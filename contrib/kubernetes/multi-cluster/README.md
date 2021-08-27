# Kubernetes Remote Service Account Importer

Script to create a Kubernetes Service Account at a remote cluster and import it into target cluster as a Secret to allow multi-cluster communication

## Options:

- **--source-context** -> Kubernetes context for source cluster where to create Service Account and export it to the target cluster
- **--target-context** -> Kubernetes context for target cluster where to import the Service Account secrets
- **--source-ns** -> Kubernetes namespace at the source cluster where to create the Service Account. Default namespace is 'multicluster-mirror' and it's created if it doesn't exist already.
- **--target-ns** -> Kubernetes namespace at the target cluster where to import the Service Account Secrets. Default namespace is 'multicluster-mirror' and it's created if it doesn't exist already.
- **--output** -> (Optional) use this flag if you want to also output a KubeConfig and Secret files.

## Usage:

```
./remote-cluster-importer.sh \
  --source-context source-cluster-context \
  --target-context minikube \
  --output
```

```
./remote-cluster-importer.sh \
  --source-context source-cluster-context \
  --target-context minikube \
  --source-ns example-source-namespace \
  --target-ns example-target-namespace \
  --output
```
