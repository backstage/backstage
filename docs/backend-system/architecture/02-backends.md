---
id: backends
title: Backend Instances
sidebar_label: Backend
# prettier-ignore
description: Service APIs for backend plugins
---

The new Backstage backend system is being built to help make it simpler to install backend plugins and to keep projects up to date. It also changes the foundation to one that makes it a lot easier to evolve plugins and the system itself with minimal disruption or cause for breaking changes. You can read more about the reasoning in the [original RFC](https://github.com/backstage/backstage/issues/11611).

One of the goals of the new system was to reduce the code needed for setting up a Backstage backend and installing plugins. This is an example of how you create, add features, and start up your backend in the new system:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';

// Create your backend instance
const backend = createBackend();

// Install all desired features
backend.add(catalogPlugin());

// Start up the backend
await backend.start();
```

One notable change that helped achieve this much slimmer backend setup is the introduction of a system for dependency injection, which is very similar to the one in the Backstage frontend.
