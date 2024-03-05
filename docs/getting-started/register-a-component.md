---
id: register-a-component
title: Registering a Component
description: Start populating your Backstage app with your data.
---

Audience: Developers

## Summary

This guide will walk you through how to pull Backstage data from other locations manually. There are integrations that will automatically do this for you.

## Prerequisites

You should have already [have a standalone app](./index.md).

## 1. Finding our template

Register a new component, by going to `create` and choose `Register existing component`

  <!-- todo: Needs zoomable plugin -->

![Software template main screen, with a blue button to add an existing component](../assets/getting-started/b-existing-1.png)

## 2. Filling out the template

For repository URL, use `https://github.com/backstage/backstage/blob/master/catalog-info.yaml`. This is used in our [demo site](https://demo.backstage.io) catalog.

![Register a new component wizard, asking for an URL to the existing component YAML file](../assets/getting-started/b-existing-2.png)

Hit `Analyze` and review the changes.

## 3. Import the entity

If the changes from `Analyze` are correct, click `Apply`.

![Register a new component wizard, showing the metadata for the component YAML we use in this tutorial](../assets/getting-started/b-existing-3.png)

You should receive a message that your entities have been added.

If you go back to `Home`, you should be able to find `backstage`. You can click it and see the details for this new entity.
