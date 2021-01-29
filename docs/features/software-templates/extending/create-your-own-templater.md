---
id: extending-templater
title: Creating your own Templater
description: Documentation on Creating your own Templater
---

Templaters are responsible for taking the directory path for the skeleton
returned by the preparers, and then executing the templating command on top of
the file and returning the completed template path. This may or may not be the
same directory as the input directory.

They also receive additional values from the frontend, which can be used to
interpolate into the skeleton files.

Currently we provide the following templaters:

- `cookiecutter`

This templater is added to the `TemplaterBuilder` and then passed into the
`createRouter` function of the `@backstage/plugin-scaffolder-backend`

An full example backend can be found
[here](https://github.com/backstage/backstage/blob/d91c10f654475a60829fa33a5c81018e517a319a/packages/backend/src/plugins/scaffolder.ts),
but it looks something like the following

```ts
import {
  CookieCutter,
  createRouter,
  Templaters,
} from '@backstage/plugin-scaffolder-backend';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  const templaters = new Templaters();
  const cookiecutterTemplater = new CookieCutter();
  templaters.register('cookiecutter', cookiecutterTemplater);

  return await createRouter({
    templaters,
  });
}
```

As you can see in the above code a `TemplaterBuilder` is created and the default
`cookiecutter` `templater` is registered under the key `cookicutter`.

This `TemplaterKey` is used to select the correct templater from the
`spec.templater` in the
[Template Entity](../../software-catalog/descriptor-format.md#kind-template).

If you wish to add a new templater, you'll need to register it with the
`TemplaterBuilder`.

### Creating your own Templater to add to the `TemplaterBuilder`

All templaters need to implement the `TemplaterBase` type.

That type looks like the following:

```ts
export type TemplaterRunOptions = {
  directory: string;
  values: TemplaterValues;
  logStream?: Writable;
  dockerClient: Docker;
};

export type TemplaterBase = {
  run(opts: TemplaterRunOptions): Promise<TemplaterRunResult>;
};
```

The `run` function will be given a `TemplaterRunOptions` object which is as
follows:

- `directory`- the skeleton directory returned from the `Preparer`, more info at
  [Create your own preparer](./create-your-own-preparer.md).
- `values` - a json object which will resemble the `spec.schema` from the
  [Template Entity](../../software-catalog/descriptor-format.md#kind-template)
  which is defined here under spec.schema`. More info can be found here
  [Register your own template](../adding-templates.md#adding-form-values-in-the-scaffolder-wizard)
- `logStream` - a stream that you can write to for displaying in the frontend.
- `dockerClient` - a [dockerode](https://github.com/apocas/dockerode) client to
  be able to run docker containers.

_note_ Currently the templaters that we provide are basically Docker action
containers that are run on top of the skeleton folder. This keeps dependencies
to a minimum for running Backstage scaffolder, but you don't _have_ to use
Docker. You can `pip install cookiecutter` to run it locally in your backend.
You could create your own templater that spins up an EC2 instance and downloads
the folder and does everything using an AMI if you want. It's entirely up to
you!

Now it's up to you to implement the `run` function, and then return a
`TemplaterRunResult` which is `{ resultDir: string }`.

Some good examples exist here:

- https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/stages/templater/cookiecutter.ts

### Registering your own Templater

If you try to process a
[Template Entity](../../software-catalog/descriptor-format.md#kind-template)
with a new `spec.templater` value, you'll need to register that with the
`TemplaterBuilder`.

For example let's say you have the following
[Template Entity](../../software-catalog/descriptor-format.md#kind-template):

```yaml
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: react-ssr-template
  title: React SSR Template
  description:
    Next.js application skeleton for creating isomorphic web applications.
  tags:
    - recommended
    - react
spec:
  owner: web@example.com
  templater: handlebars
  type: website
  path: '.'
  schema:
    required:
      - component_id
      - description
    properties:
      component_id:
        title: Name
        type: string
        description: Unique name of the component
      description:
        title: Description
        type: string
        description: Description of the component
```

You see that the `spec.templater` is set as `handlebars`, so you'll need to
register this with the `TemplaterBuilder` like so:

```ts
const templaters = new Templaters();
templaters.register('handlebars', new HandlebarsTemplater());
```

And then pass this into the `createRouter` function.
