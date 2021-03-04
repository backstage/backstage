---
id: troubleshooting
title: Troubleshooting Kubernetes
sidebar_label: Troubleshooting
description: Troubleshooting for Kubernetes
---

## Kubernetes is not showing up on Service Entities

Sometimes, Kubernetes is not showing up on service entities, we should test your
k8s cluster are already connected to Backstage or not.

```curl
curl --location --request POST '{{backstage-backend-url}}:{{backstage-backend-port}}/api/kubernetes/services/:service-entity-name' \
--header 'Content-Type: application/json' \
--data-raw '{
    "entity": {
        "metadata": {
            "name": <service-entity-name>
        }
    }
}
'
```

The curl response should have resources from Kubernetes:

```json
# curl response
{
  "items": [
    {
      "cluster": {
        "name": <cluster-name>
      },
      "resources": [
        {
          "type": "services",
          "resources": [
            {
              "metadata": {
                "creationTimestamp": "2022-03-13T13:52:46.000Z",
                "labels": {
                  "app": <k8s-app-name>,
                  "backstage": <selector>,
                  "backstage.io/kubernetes-id": <service-entity-name>
                },
                "name": <k8s-app-name>,
                "namespace": <namespace>
              },
              ....
            }
          ]
        },
        ....
        {
          "type": "pods",
          "resources": [
            ,,,,
          ]
        }
      ],
      "errors": []
    }
  ]
}

```

Kubernetes will not be showing anything when catalog info annotations is not
match with k8s related yaml label (service.yaml, deployment.yaml, etc). We
recommend you for adding two labels and using label selector annotations:

`backstage: <selector>` and `backstage.io/kubernetes-id: <entity-service-name>`.

`backstage: <selector>` for matching with catalog-info.yaml

`backstage.io/kubernetes-id: <entity-service-name>`for get k8s service-related 
objects. [link](https://github.com/backstage/backstage/blob/a1f587c/plugins/kubernetes-backend/src/service/KubernetesFetcher.ts#L119)

```yaml
# k8s related yaml (service.yaml, deployment.yaml, ingress.yaml)
metadata:
    creationTimestamp: '2022-03-13T13:52:46.000Z'
    labels:
        app: <k8s-app-name>
        backstage: <selector>
        backstage.io/kubernetes-id: <service-entity-name>
    name: <k8s-app-name>
    namespace: <namespace>
```
k8s-app-name and service-entity-name could be different, but if you would like
to have consistent names between k8s and backstage, we recommend use same name.

and the catalog info annotations would use label selector:

```yaml
# catalog-info.yaml (backstage)
annotations:
  backstage.io/kubernetes-label-selector: 'backstage=<selector>'
```
