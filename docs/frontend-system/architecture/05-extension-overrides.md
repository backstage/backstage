---
id: extension-overrides
title: Frontend Extension Overrides
sidebar_label: Extension Overrides
# prettier-ignore
description: Frontend extension overrides
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

<!--

Introduce extension overrides and how they can be shipped in separate packages but also internally within a project too.

Talk about how extension overrides

-->

## Creating a Extension Override

<!--

How to create an extension override and export it from a package.A

 - Example using the default exports

You can also create them directly withing the app for local overrides.

 - Example of installing an override directly into an app

Mention that in can still be a good idea to split your overrides out into separate packages in large projects. But it's up to you to decide how to group the extensions into extension overrides.

 -->

## Overriding Existing Extensions

<!--

To override an existing extension you need to provide an extension through an extension override that has the same ID as the existing extension. That is, all of kind, namespace and name must match the extension you want to override.

This means that you typically need to provide an explicit namespace when overriding extensions from a plugin.

 - Example of how to create an extension override for an existing extension from some plugin

 -->
