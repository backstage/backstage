---
id: plugins
title: Frontend Plugins
sidebar_label: Plugins
# prettier-ignore
description: Frontend plugins
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

In addition to the existing [`plugins`](../../plugins/index.md) documentation we now want to take a look at plugins in the new frontend system. If you already created a plugin yourself you will recognise a lot of similarity in the new architecture with the existing one.

Backstage is a single-page application composed of a set of plugins. Each of this plugin extends & customises your specific

<!--

Introduce frontend plugins and how each of them is shipped as a separate package. Highlight that each package should only export a single plugin instance.

-->

## Creating a Plugin

<!--

How to create a simple plugin

 -->

```ts
export const myPlugin = createPlugin({
  id: 'my-plugin',
});
```

<!--

Note that this plugin is useless in itself, and you need to provide extra options to make it useful, in particular extensions.

 -->

### Plugin ID

<!--

link to relevant docs

-->

### Plugin Extensions

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

### Plugin Routes

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

### Plugin External Routes

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

### Plugin Feature Flags

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

## Installing a Plugin in an App

<!--

Quick intro, but link back to app docs for more details

 -->
