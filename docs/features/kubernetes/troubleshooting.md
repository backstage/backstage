---
id: troubleshooting
title: Troubleshooting Kubernetes
sidebar_label: Troubleshooting
description: Troubleshooting for Kubernetes
---

## Kubernetes is not showing up on Service Entities

This can be debugged by checking whether your Kubernetes cluster are connected
to Backstage as follows:

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

The Kubernetes tab will not show anything when the catalog info annotation does
not match the related Kubernetes resource. We recommend you add the following
labels to your resources and use the label selector annotation as follows:

`backstage.io/kubernetes-id: <entity-service-name>`for get k8s service-related
objects.
[See the plugin code](https://github.com/backstage/backstage/blob/a1f587c/plugins/kubernetes-backend/src/service/KubernetesFetcher.ts#L119)

```yaml
# k8s related yaml (service.yaml, deployment.yaml, ingress.yaml)
metadata:
  creationTimestamp: '2022-03-13T13:52:46.000Z'
  labels:
    app: <k8s-app-name>
    env: <environment>
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
  backstage.io/kubernetes-label-selector: '<label-selector>'
```
