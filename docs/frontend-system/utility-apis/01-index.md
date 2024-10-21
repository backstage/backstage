---
id: index
title: Utility APIs
sidebar_label: Overview
# prettier-ignore
description: Working with Utility APIs in the New Frontend System
---

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

As described [in the architecture section](../architecture/33-utility-apis.md), utility APIs are pieces of shared functionality - interfaces that can be requested by plugins to use. They are defined by a TypeScript interface as well as a reference (an "API ref") used to access its implementation. They can be provided both by plugins and the core framework, and are themselves [extensions](../architecture/20-extensions.md) that can accept inputs, be declaratively configured in your app-config, or transparently be replaced entirely with custom implementations that fulfill the same contract.

## Creating utility APIs

> For details, [see the main article](./02-creating.md).

Backstage apps, plugins, and the core Backstage framework can all expose utility APIs for general use.

Some are available out of the box, such as the API for reading app configuration. Some are provided by third party plugins, such as the catalog client API that both the catalog itself and your own code can leverage to talk to the catalog backend. Some, you may create yourself and make available inside your Backstage instance for use within your private ecosystem of plugins.

[The main article](./02-creating.md) describes the process of creating and exposing utility APIs of your own, for sharing functionality or configurability across plugins and apps.

## Consuming utility APIs

> For details, [see the main article](./03-consuming.md).

Once utility APIs are created, there are a few ways that they can be accessed to be consumed.

Some utility APIs in turn depend on other utility APIs. This powerful composability lets you leverage already-written reusable pieces. In particular, you may want to rely on Backstage's framework-provided APIs e.g. for reading app configuration and many other use cases. Sometimes you request utility APIs inside your React components, e.g. for accessing i18n strings, or emitting analytics events.

These are described in detail in [the main article](./03-consuming.md)

## Configuring utility APIs

> For details, [see the main article](./04-configuring.md).

Most utility APIs are usable directly without any configuration. But they are proper extensions, and can therefore have their implementations entirely swapped out by your app for advanced use cases. They can also be built with the ability to configured in your app-config, or to have inputs that extend their functionality.

These cases are all described in [the main article](./04-configuring.md).

## Migrating from the old frontend system

If you want to learn how to migrate your own utility APIs from the old frontend system to the new one, that's described in the [Migrating APIs guide](../building-plugins/05-migrating.md#migrating-apis).
