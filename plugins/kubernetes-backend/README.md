# Kubernetes Backend

This is the backend part of the Kubernetes plugin for Backstage. It is called by and responds to requests from the frontend [`@backstage/plugin-kubernetes`](https://github.com/backstage/backstage/tree/master/plugins/kubernetes) plugin.

It directly interfaces with the Kubernetes API control plane to obtain information about objects that will then be presented at the front end.

## Introduction

See our announcement blog post [New Backstage feature: Kubernetes for Service Owners](https://backstage.io/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners) to learn more about the motivation behind developing the plugin.

## Setup & Configuration

This plugin must be explicitly added to a Backstage app, along with it's peer frontend plugin.

The plugin requires configuration in the Backstage `app-config.yaml` to connect to a Kubernetes API control plane.

In addition, configuration of an entity's `catalog-info.yaml` helps identify which specific Kubernetes object(s) should be presented on a specific entity catalog page.

For more information, see the [formal documentation about the Kubernetes feature in Backstage](https://backstage.io/docs/features/kubernetes/overview).
