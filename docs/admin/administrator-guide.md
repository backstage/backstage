---
id: admin-guide
title: Backstage Administrator Guide
sidebar_label: Admin Guide
description: Step-by-step guide for Backstage administrators responsible for running and maintaining production Backstage servers.
---

:::info
This guide is intended for administrators managing production Backstage deployments on single-server and Kubernetes setups. It covers server operations, plugin management, upgrades, and database administration.
:::

# Table of Contents

-   [Introduction](#introduction)
-   [Server Administration](#server-administration)
    -   [Single Server](#single-server)
    -   [Kubernetes](#kubernetes)
-   [Plugins: Installation & Configuration](#plugins-installation--configuration)
    -   [Single Server](#single-server-plugin)
    -   [Kubernetes](#kubernetes-plugin)
-   [Upgrading Backstage](#upgrading-backstage)
    -   [Single Server](#single-server-upgrade)
    -   [Kubernetes](#kubernetes-upgrade)
-   [Database Guide](#database-guide)
    -   [PostgreSQL](#postgresql)
    -   [MySQL](#mysql)
    -   [Plugin Databases](#plugin-databases)
-   [References](#references)
-   [Appendix: Troubleshooting](#appendix-troubleshooting)

---

## Introduction

This guide provides comprehensive instructions for Backstage administrators to operate, maintain, and upgrade a production Backstage instance. It targets deployments on both single-server environments and Kubernetes clusters.

---

## Server Administration

### Single Server

#### Starting the Backstage Server

1.  Ensure Node.js, Yarn, and your database server are installed and running.
2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Build the Backstage app:

    ```bash
    yarn build
    ```

4.  Start the server:

    ```bash
    yarn start
    ```

5.  To run the server in the background (on UNIX-like systems), use:

    ```bash
    nohup yarn start &
    ```

#### Stopping the Backstage Server

-   In your terminal, press `Ctrl+C` to stop the process.
-   If running in the background, identify the process and kill it:

    ```bash
    ps aux | grep yarn
    kill <pid>
    ```

#### Checking Server Status

-   Use process monitoring commands such as `ps` or `pm2` to verify if the server is running.
-   Monitor server logs for errors or activity:

    ```bash
    tail -f server.log
    ```

-   Verify the server is accessible at [`http://localhost:3000`](http://localhost:3000) or relevant URL.

---

### Kubernetes

#### Deploying, Stopping, and Monitoring

-   Deploy or update Backstage:

    ```bash
    kubectl apply -f backstage-deployment.yaml
    ```

-   Stop the deployment:

    ```bash
    kubectl delete -f backstage-deployment.yaml
    ```

-   Check pod status:

    ```bash
    kubectl get pods -n <namespace>
    ```

-   View logs of a pod:

    ```bash
    kubectl logs <pod-name> -n <namespace>
    ```

---

## Plugins: Installation & Configuration

### Single Server Plugin

1.  Add the desired plugin:

    ```bash
    yarn add @backstage/plugin-<plugin-name>
    ```

2.  Update `app-config.yaml` and source code as per the plugin's README instructions.
3.  Rebuild the app:

    ```bash
    yarn build
    ```

4.  Restart the Backstage server to activate the plugin.

### Kubernetes Plugin

1.  Add and configure the plugin locally as above.
2.  Build and push a new Docker image:

    ```bash
    docker build -t <your-backstage-image>:<tag> .
    docker push <your-backstage-image>:<tag>
    ```

3.  Update your Kubernetes deployment YAML with the new image:

    ```yaml
    spec:
      containers:
        - name: backstage
          image: <your-backstage-image>:<tag>
    ```

4.  Apply the updated deployment:

    ```bash
    kubectl apply -f backstage-deployment.yaml
    ```

---

## Upgrading Backstage

### Single Server Upgrade

1.  Upgrade Backstage packages:

    ```bash
    yarn upgrade @backstage/app
    yarn upgrade
    ```

2.  Review breaking changes in the [Backstage release notes](https://github.com/backstage/backstage/releases).
3.  Test your app locally.
4.  Rebuild and restart the server.

### Kubernetes Upgrade

-   Build and push the upgraded Docker image as above.
-   Update and apply your Kubernetes deployment manifest.
-   Monitor rollout status:

    ```bash
    kubectl rollout status deployment/<deployment-name> -n <namespace>
    ```

---

## Database Guide

### Supported Databases

-   **SQLite:** Default for development/demo only.
-   **PostgreSQL:** Recommended for production use.
-   **MySQL:** Supported alternative for production.

### PostgreSQL Setup

1.  Install PostgreSQL and create a dedicated database user.
2.  Configure `app-config.yaml`:

    ```yaml
    backend:
      database:
        client: pg
        connection:
          host: <host>
          user: <user>
          password: <password>
          database: <dbname>
    ```

3.  Regularly back up your database using tools like `pg_dump`.

### MySQL Setup

-   Use same steps as PostgreSQL but configure `client: mysql`:

    ```yaml
    backend:
      database:
        client: mysql
        connection:
          host: <host>
          user: <user>
          password: <password>
          database: <dbname>
    ```

### Plugin Databases

-   Certain plugins may require additional database tables or migrations.
-   Refer to each plugin's documentation for setup instructions.

---

## References

-   [Official Backstage Documentation](https://backstage.io/docs)
-   [CNCF Tech Docs: Backstage Assessment](https://github.com/cncf/techdocs/tree/main/assessments/0008-backstage)
-   [Backstage Docs Catalog CSV](https://github.com/cncf/techdocs/blob/main/assessments/0008-backstage/backstage-doc-survey.csv)

---

## Appendix: Troubleshooting

-   **Logs:** Review logs (`server.log`, or `kubectl logs`) for errors.
-   **Kubernetes issues:** Use `kubectl describe pod <pod-name>` to debug pod crashes or restarts.
-   **Plugin not found:** Ensure plugin registration and `yarn build` are done.
-   **Database errors:** Verify DB accessibility, credentials, and `app-config.yaml` correctness.
