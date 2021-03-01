---
id: extending-publisher
title: Create your own Publisher
description: Documentation on Creating your own Publisher
---

Publishers are responsible for pushing and storing the templated skeleton after
the values have been templated by the `Templater`. See
[Create your own templater](./create-your-own-templater.md) for more info.

They receive a directory or location where the templater has successfully run
and is now ready to store somewhere. They also are given some other options
which are sent from the frontend, such as the `storePath` which is a string of
where the frontend thinks we should save this templated folder.

Currently we provide the following `publishers`:

- `github`

This publisher is passed through to the `createRouter` function of the
`@backstage/plugin-scaffolder-backend`. Currently, only one publisher is
supported, but PR's are always welcome.

An full example backend can be found
[here](https://github.com/backstage/backstage/blob/d91c10f654475a60829fa33a5c81018e517a319a/packages/backend/src/plugins/scaffolder.ts),
but it looks something like the following

```ts
import {
  createRouter,
  GithubPublisher,
} from '@backstage/plugin-scaffolder-backend';
import { Octokit } from '@octokit/rest';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  const githubClient = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const publisher = new GithubPublisher({ client: githubClient });

  return await createRouter({
    publisher,
    logger,
  });
}
```

The publisher will always be called with the location from the selected
`Preparer`.

### Create your own Publisher and register it with the Scaffolder

All `publishers` need to implement the `PublisherBase` type.

That type looks like the following:

```ts
export type PublisherBase = {
  publish(opts: {
    entity: TemplateEntityV1alpha1;
    values: TemplaterValues;
    directory: string;
  }): Promise<{ remoteUrl: string }>;
};
```

The `publisher` function will be called with an `options` object which contains
the following:

- `entity` - the
  [Template Entity](../../software-catalog/descriptor-format.md#kind-template)
  which is currently being scaffolded
- `values` - a json object which will resemble the `spec.schema` from the
  [Template Entity](../../software-catalog/descriptor-format.md#kind-template)
  which is defined here under spec.schema`. More info can be found here
  [Register your own template](../adding-templates.md#adding-form-values-in-the-scaffolder-wizard)
- `directory` - a string containing the returned path from the `templater`. See
  more information here in
  [Create your own templater](./create-your-own-templater.md)

Now it's up to you to implement the `publish` function and return
`{ remoteUrl: string }` which can be used to identify the finished product.

Some good examples exist here:

- https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/stages/publish/github.ts

### Registering your own Publisher

Currently, we only support one `publisher` (PR's welcome), but you can register
any single `publisher` with the `createRouter`.

```ts
return await createRouter({
  publisher: new MyGitlabPublisher(),
});
```
