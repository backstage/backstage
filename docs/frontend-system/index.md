---
id: index
title: The Frontend System
sidebar_label: Introduction
# prettier-ignore
description: The Frontend System
---

## Alpha Status

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

The primary use case for exploring the new frontend system would be if you are developing a plugin and want to be ready
for the future finalization of this frontend update. If you add support for the new system to your plugin, please do so
under a `/alpha` sub-path export so that existing Backstage apps can still consume your plugin.

You can find an example app setup in the [`app-next` package](https://github.com/backstage/backstage/tree/master/packages/app-next).
