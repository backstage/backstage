---
id: index
title: The Frontend System
sidebar_label: Introduction
description: The Frontend System
---

## Status

The new frontend system framework is stable as of version 1.0 of these packages:

- `@backstage/frontend-defaults`
- `@backstage/frontend-plugin-api`
- `@backstage/frontend-app-api`
- `@backstage/frontend-test-utils`
- `@backstage/frontend-dev-utils`

Their public APIs follow the [package versioning policy](../overview/versioning-policy.md#package-versioning-policy).
APIs marked `@alpha` or `@beta`, including exports from `/alpha` entry points,
retain their existing stability levels. Other packages, including compatibility
and dynamic feature loading packages, retain their own versions and stability levels.

We recommend migrating your frontend apps and plugins to the new frontend system.
See the [app migration guide](./building-apps/08-migrating.md) and the
[plugin migration guide](./building-plugins/05-migrating.md).

You can find an example app setup in the [`app` package](https://github.com/backstage/backstage/tree/master/packages/app).
