---
id: permissions
title: Permissions
description: Configuring permissions for Kubernetes plugin
---

The Kubernetes plugin integrates with the permission framework. Administrators can define PermissionPolicies
to restrict access to the `/clusters`, `/services/:serviceId`, `/resources` and `/proxy` endpoints.

This feature assumes your Backstage instance has enabled the [permissions framework](https://backstage.io/docs/permissions/getting-started).

### Available permissions

| Name                      | Policy   | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| kubernetes.clusters.read  | read     | Allows the user to read Kubernetes clusters information under `/clusters`                                                                                                                                                                                                                                                                                |
| kubernetes.resources.read | read     | Allows the user to read Kubernetes resources information under `/services/:serviceId` and `/resources`                                                                                                                                                                                                                                                   |
| kubernetes.proxy          | resource | Allows the user to make requests to the [REST API](https://kubernetes.io/docs/reference/using-api/api-concepts/) under `/proxy`. Supports attribute-based conditional policies on cluster, namespace, resource type, action category (`read`, `write`, `delete`, `exec`), and Kubernetes API verb. See [Proxy](proxy.md#attribute-based-access-control). |
