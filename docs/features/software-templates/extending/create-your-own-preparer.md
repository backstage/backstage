---
id: extending-preparer
title: Create your own Preparer
description: Documentation on Creating your own Preparer
---

Preparers are responsible for reading the location of the definition of a
[Template Entity](../../software-catalog/descriptor-format.md#kind-template) and
making a temporary folder with the contents of the selected skeleton.

Currently, we provide two different providers that can parse two different
location protocols:

- `file://`
- `github://`

These two are added to the `PreparersBuilder` and then passed into the
`createRouter` function of the `@backstage/plugin-scaffolder-backend`.

A full example backend can be found in
[`scaffolder.ts`](https://github.com/backstage/backstage/blob/d91c10f654475a60829fa33a5c81018e517a319a/packages/backend/src/plugins/scaffolder.ts),
but it looks something like the following

```ts
import {
  createRouter,
  FilePreparer,
  GithubPreparer,
  Preparers,
} from '@backstage/plugin-scaffolder-backend';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  const preparers = new Preparers();

  const filePreparer = new FilePreparer();
  const githubPreparer = new GithubPreparer();

  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);

  return await createRouter({
    preparers,
    templaters,
    logger,
  });
}
```

As you can see in the above code, a `PreparerBuilder` is created, and then two
of the `preparers` are registered with the different protocols that they accept.

The `protocol` is set on the
[Template Entity](../../software-catalog/descriptor-format.md#kind-template)
when added to the service catalog. You can see more about this `PreparerKey`
here in [Register your own template](../adding-templates.md)

**note:** Currently the catalog supports loading definitions from GitHub + Local
Files, which translate into the two `PreparerKeys`: `file` and `github`. To load
from other places, not only will there need to be another preparer, but the
support to load the location will also need to be added to the Catalog.

### Creating your own Preparer to add to the `PreparerBuilder`

All preparers need to implement the `PreparerBase` type.

That type looks like the following:

```ts
export type PreparerBase = {
  prepare(
    template: TemplateEntityV1alpha1,
    opts: { logger: Logger },
  ): Promise<string>;
};
```

The `prepare` function will be given the
[Template Entity](../../software-catalog/descriptor-format.md#kind-template)
along with the source of where the `template.yaml` was loaded from under the
`metedata.annotations.managed-by-location` property.

Now it's up to you to implement a function which can go and fetch the skeleton
and put the contents into a temporary directory and return that directory path.

Some good examples exist here:

- https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/stages/prepare/file.ts
- https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/stages/prepare/github.ts

### Registering your own Preparer

You can register the preparer that you have created with the `PreparerBuilder`
by using the `PreparerKey` from the Catalog, for example like this:

```ts
const preparers = new Preparers();
preparers.register('gcs', new GoogleCloudStoragePreparer());
```

And then pass this into the `createRouter` function.
