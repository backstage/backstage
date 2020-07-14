# Creating your own Templater

Templaters are responsible for taking the directory path for the skeleton
returned by the preparers, and then executing the templating command on top of
the file and returning the completed template path. This may or may not be the
same directory as the input directory.

They also recieve additional values from the frontend, which can be used to
interpolate into the skeleton files.

Currently we provide the following templaters:

- `cookiecutter`

This templater is added the `TemplaterBuilder` and then passed into the
`createRouter` function of the `@spotify/plugin-scaffolder-backend`

An full example backend can be found
[here](https://github.com/spotify/backstage/blob/d91c10f654475a60829fa33a5c81018e517a319a/packages/backend/src/plugins/scaffolder.ts),
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
[Template Entity](../software-catalog/descriptor-format.md#kind-template).

If you wish to add a new templater you'll need to register it with the
`TemplaterBuilder` here.

### Creating your own Templater to add to the `TemplaterBuilder`

All templaters need to implement the `TemplaterBase` type.
