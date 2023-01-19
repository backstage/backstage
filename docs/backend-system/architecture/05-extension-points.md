---
id: extension-points
title: Backend Plugin Extension Points
sidebar_label: Extension Points
# prettier-ignore
description: Extension points of backend plugins
---

### Extension Points

Modules depend on extension points just as a regular dependency by specifying it in the `deps` section.

#### Defining an Extension Point

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface ScaffolderActionsExtensionPoint {
  addAction(action: ScaffolderAction): void;
}

export const scaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });
```

#### Registering an Extension Point

Extension points are registered by a plugin and extended by modules.
