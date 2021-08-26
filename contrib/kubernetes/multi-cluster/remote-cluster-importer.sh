#!/bin/bash
#
#   Script to create a Kubernetes Service Account at a remote cluster and import it into target cluster as a Secret to allow multi-cluster communication.
#
#   Options:
#     - --source-context -> Kubernetes context for source cluster where to create Service Account and export it to the target cluster
#     - --target-context -> Kubernetes context for target cluster where to import the the Service Account secrets
#     - --source-ns -> Kubernetes namespace at the source cluster where to create the Service Account. Default namespace is 'multicluster-mirror' and it's created if it doesn't exist already.
#     - --target-ns -> Kubernetes namespace at the target cluster where to import the Service Account Secrets. Default namespace is 'multicluster-mirror' and it's created if it doesn't exist already.
#     - --output -> (Optional) use this flag if you want to also output a KubeConfig and Secret files.
#
#   Usage:
#     ./remote-cluster-importer.sh \
#         --source-context source-cluster-context \
#         --target-context minikube \
#         --output
#
#     ./remote-cluster-importer.sh \
#         --source-context source-cluster-context \
#         --target-context minikube \
#         --source-ns multicluster-mirror \
#         --target-ns example-target-namespace \
#         --output
#
#   @author: Manuel Santos (manuel.santos@meredes-benz.io)
#

set -eu -o pipefail

# Set OS specific values.
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    BASE64_DECODE_FLAG="-d"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    BASE64_DECODE_FLAG="-D"
elif [[ "$OSTYPE" == "linux-musl" ]]; then
    BASE64_DECODE_FLAG="-d"
else
    echo "Unknown OS ${OSTYPE}"
    exit 1
fi

OUTPUT=0
while (( "$#" )); do
  case "$1" in
    --output)
      OUTPUT=1
      shift
    ;;
    --source-context)
      SOURCE_CONTEXT=$2
      shift 2
    ;;
    --target-context)
      TARGET_CONTEXT=$2
      shift 2
    ;;
    --source-ns)
      SOURCE_NS=$2
      shift 2
    ;;
    --target-ns)
      TARGET_NS=$2
      shift 2
    ;;
    -*)
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
  esac
done

echo "Extracting clusters information from contexts"
SOURCE_CLUSTER=$(kubectl config view -o jsonpath="{.contexts[?(@.name == \"${SOURCE_CONTEXT}\"})].context.cluster}")
SOURCE_CLUSTER_SERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name == \"${SOURCE_CLUSTER}\"})].cluster.server}")

SA_NAME="${SOURCE_CLUSTER}"-mcsa
SOURCE_NS="${SOURCE_NS:-multicluster-mirror}"
TARGET_NS="${TARGET_NS:-multicluster-mirror}"

echo "Creating the Kubernetes Service Account with minimal RBAC permissions."
kubectl --context="${SOURCE_CONTEXT}" apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ${SOURCE_NS}

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${SA_NAME}
  namespace: ${SOURCE_NS}

---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: multicluster-reader
rules:
  - apiGroups: ["", "extensions", "apps"]
    resources: ["configmaps", "pods", "services", "endpoints", "secrets"]
    verbs: ["get", "list", "watch"]

---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: multicluster-reader-binding
subjects:
  - kind: ServiceAccount
    name: ${SA_NAME}
    namespace: ${SOURCE_NS}
    apiGroup: ""
roleRef:
  kind: ClusterRole
  name: multicluster-reader
  apiGroup: ""
EOF

# Get the service account token and CA cert.
SA_SECRET_NAME=$(kubectl --context="${SOURCE_CONTEXT}" get -n "${SOURCE_NS}" sa/"${SA_NAME}" -o "jsonpath={.secrets[0]..name}")
CA_CERT=$(kubectl --context="${SOURCE_CONTEXT}" get secret/"${SA_SECRET_NAME}" -n "${SOURCE_NS}" -o jsonpath='{.data.ca\.crt}')
TOKEN=$(kubectl --context="${SOURCE_CONTEXT}" get secret/"${SA_SECRET_NAME}" -n "${SOURCE_NS}" -o jsonpath='{.data.token}' | base64 "${BASE64_DECODE_FLAG}")

echo "Preparing target namespace ${TARGET_NS}"
kubectl --context="${TARGET_CONTEXT}" apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ${TARGET_NS}
EOF

echo "Writing kubeconfig."
KUBE_CONFIG_CONTENT=$( cat <<EOF
apiVersion: v1
kind: Config
clusters:
- name: ${SOURCE_CLUSTER}
  cluster:
    certificate-authority-data: ${CA_CERT}
    server: ${SOURCE_CLUSTER_SERVER}
contexts:
- name: ${SOURCE_CONTEXT}
  context:
    cluster: ${SOURCE_CLUSTER}
    user: ${SOURCE_CLUSTER}
users:
- name: ${SOURCE_CLUSTER}
  user:
    token: ${TOKEN}
EOF
)

if [[ "${OUTPUT}" -eq 1 ]]; then
  echo "${KUBE_CONFIG_CONTENT}" > "${SOURCE_CLUSTER}"-mcsa-kubeconfig.yaml
fi

echo "Creating Kubernetes Secret for multicluster ServiceAccount"
ENCODED_SOURCE_NS=$(echo "${SOURCE_NS}" | base64 )
ENCODED_SOURCE_LUSTER_SERVER=$(echo "${SOURCE_CLUSTER_SERVER}" | base64 )
ENCODED_TOKEN=$(echo "${TOKEN}" | base64 )
ENCODED_KUBE_CONFIG_CONTENT=$(echo "${KUBE_CONFIG_CONTENT}" | base64 )

MULTI_CLUSTER_SECRET_CONTENT=$( cat <<EOF
apiVersion: v1
data:
  ca.crt: ${CA_CERT}
  config: ${ENCODED_KUBE_CONFIG_CONTENT}
  namespace: ${ENCODED_SOURCE_NS}
  server: ${ENCODED_SOURCE_LUSTER_SERVER}
  token: ${ENCODED_TOKEN}
kind: Secret
metadata:
  labels:
    backstage/remote-cluster-secret: "true"
    backstage/remote-cluster-name: ${SOURCE_CLUSTER}
  name: ${SA_SECRET_NAME}
  namespace: ${TARGET_NS}
type: Opaque
EOF
)

if [[ "${OUTPUT}" -eq 1 ]]; then
  echo "${MULTI_CLUSTER_SECRET_CONTENT}" > "${SOURCE_CLUSTER}"-mcsa-secret.yaml
fi

kubectl --context="${TARGET_CONTEXT}" apply -f - <<EOF
${MULTI_CLUSTER_SECRET_CONTENT}
EOF
