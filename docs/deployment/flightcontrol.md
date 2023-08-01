---
id: flightcontrol
title: Deploying with Flightcontrol
sidebar_label: AWS Fargate via Flightcontrol
description: Deploying Backstage to AWS Fargate via Flightcontrol
---

This guide explains how to deploy Backstage to [Flightcontrol](https://www.flightcontrol.dev?ref=backstage), a platform that fully automates deployments to Amazon Web Services (AWS). Flightcontrol supports git-driven and image registry deployments.

Before you begin, make sure you have a [Flightcontrol account](https://app.flightcontrol.dev/signup?ref=backstage) and a [Github account](https://github.com/login) to follow this guide.

# Deployment Via Dashboard

1. First upload your project on Github

2. Select `GUI` as the config type:

3. Then, choose `+ Add Web Server (Fargate)` under Services before entering the following server information:

| Field Name        | Value             |
| ----------------- | ----------------- |
| Build Type        | Custom Dockerfile |
| Health Check Path | /catalog          |
| Port              | 7007              |

4. After that, select `+ Add Database (RDS)`

5. Click `Create Project` and complete any required steps (like linking your AWS account).

# Deployment via Code

1. Create a Flightcontrol project from your dashboard. Select a repository for the source.

2. Select the `flightcontrol.json` Config Type.

3. Add a new file at the root of your repository called `flightcontrol.json`. Here's an example configuration that creates a Web Server for your Backstage app:

```json filename="flightcontrol.json"
{
  "$schema": "https://app.flightcontrol.dev/schema.json",
  "environments": [
    {
      "id": "production",
      "name": "Production",
      "region": "us-west-2",
      "source": {
        "branch": "main"
      },
      "services": [
        {
          "id": "my-webapp",
          "name": "My BackstageApp",
          "type": "fargate",
          "buildType": "docker",
          "dockerfilePath": "Dockerfile",
          "dockerContext": ".",
          "healthCheckPath": "/catalog",
          "cpu": 0.25,
          "memory": 0.5,
          "domain": "backstage.yourapp.com",
          "port": 7007,
          "minInstances": 1,
          "maxInstances": 1,
          "envVariables": {
            "DATABASE_URL": {
              "fromService": {
                "id": "db",
                "value": "dbConnectionString"
              }
            }
          }
        },
        {
          "id": "db",
          "name": "Database",
          "type": "rds",
          "engine": "postgres",
          "engineVersion": "13",
          "instanceSize": "db.t4g.micro",
          "storage": 20,
          "private": false
        }
      ]
    }
  ]
}
```

## Troubleshooting

- [Flightcontrol Documentation](https://www.flightcontrol.dev/docs?ref=backstage)
- [Troubleshooting](https://www.flightcontrol.dev/docs/troubleshooting?ref=backstage)
