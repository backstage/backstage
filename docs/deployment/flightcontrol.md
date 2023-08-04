---
id: flightcontrol
title: Deploying with Flightcontrol
sidebar_label: AWS Fargate via Flightcontrol
description: Deploying Backstage to AWS Fargate via Flightcontrol
---

This guide explains how to deploy Backstage to [Flightcontrol](https://www.flightcontrol.dev?ref=backstage), a platform that fully automates deployments to Amazon Web Services (AWS). Flightcontrol supports git-driven and image registry deployments.

Before you begin, make sure you have a [Flightcontrol account](https://app.flightcontrol.dev/signup?ref=backstage) and a [Github account](https://github.com/login) to follow this guide.

# Deployment Via Dashboard

1. Create a new project from the Flightcontrol Dashboard

2. Select the GitHub repo for your Backstage project

3. Select `GUI` as the config type:

4. Then, choose `+ Add Web Server (Fargate)` under Services before entering the following server information:

| Field Name        | Value             |
| ----------------- | ----------------- |
| Build Type        | Custom Dockerfile |
| Health Check Path | /catalog          |
| Port              | 7007              |

5. Click `Create Project` and complete any required steps (like linking your AWS account).

# Deployment via Code

1. Create a new project from the Flightcontrol Dashboard

2. Select the GitHub repo for your Backstage project

3. Select the `flightcontrol.json` Config Type.

```json filename="flightcontrol.json"
{
  "$schema": "https://app.flightcontrol.dev/schema.json",
  "environments": [
    {
      "id": "backstage",
      "name": "Backstage",
      "region": "us-west-2",
      "source": {
        "branch": "main"
      },
      "services": [
        {
          "id": "backstage",
          "name": "Backstage",
          "type": "fargate",
          "buildType": "docker",
          "dockerfilePath": "Dockerfile",
          "dockerContext": ".",
          "healthCheckPath": "/catalog",
          "cpu": 0.5,
          "memory": 1,
          "domain": "backstage.yourapp.com",
          "port": 7007,
          "minInstances": 1,
          "maxInstances": 1
        }
      ]
    }
  ]
}
```

# Databases and Redis

If you need a database or Redis for your Backstage plugins, you can easily add those to your Flightcontrol deployment. For more information, see [the flightcontrol docs](https://www.flightcontrol.dev/docs/guides/flightcontrol/using-code?ref=backstage#redis).

## Troubleshooting

- [Flightcontrol Documentation](https://www.flightcontrol.dev/docs?ref=backstage)
- [Troubleshooting](https://www.flightcontrol.dev/docs/troubleshooting?ref=backstage)
