---
id: index
title: The Frontend System
sidebar_label: Introduction
description: The Frontend System
---

## Status

We recommend migrating your frontend plugins to the new frontend system. If you do please do so under an `/alpha` sub-path export.

You can find an example app setup in the [`app` package](https://github.com/backstage/backstage/tree/master/packages/app).

We'd recommend that you install the `app-visualizer` plugin to help with troubleshooting. It provides a visual overview of your app's extension tree, making it easy to verify that plugins are installed correctly, see how extensions are wired together, and identify issues during migration. For installation instructions, please read [troubleshooting app visualizer](./building-apps/09-troubleshooting-app-visualizer.md).
