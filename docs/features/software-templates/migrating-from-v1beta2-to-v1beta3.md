---
id: migrating-from-v1beta2-to-v1beta3
title: Migrating to v1beta3 templates
# prettier-ignore
description: How to migrate your existing templates to beta3 syntax
---

# What's new?

Well then, here we are! 🚀

Backstage has had many forms of templating languages throughout different
plugins and different systems. We've had `cookiecutter` syntax in templates, and
we also had `handlebars` templating in the `kind: Template`. Then we wanted to
remove the additional dependency on `cookiecutter` for Software Templates out of
the box, so we introduced `nunjucks` as an alternative in `fetch:template`
action which is based on the `jinja2` syntax so they're pretty similar. In an
effort to reduce confusion and unify on to one templating language, we're
officially deprecating support for `handlebars` templating in the
`kind: Template` entities with `apiVersion` `scaffolder.backstage.io/v1beta3`
and moving to using `nunjucks` instead.

This provides us a lot of built in `filters` (`handlebars` helpers), that as
Template authors will give you much more flexibility out of the box, and also
open up sharing of filters in the Entity and the actual `skeleton` too, and
removing the slight differences between the two languages.

We've also removed a lot of the built in helpers that we shipped with
`handlebars`, as they're now supported as first class citizens by either
`nunjucks` or the new `scaffolder` when using `scaffolder.backstage.io/v1beta3`
`apiVersion`

The migration path is pretty simple, and we've removed some of the pain points
from writing the `handlebars` templates too. Let's go through what's new and how
to upgrade.

## Add the Processor to the `plugin-catalog-backend`

An important change is to add the required processor to your `packages/backend/src/plugins/catalog.ts`

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-next-line */
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();

  // ..
}
```

## `backstage.io/v1beta2` -> `scaffolder.backstage.io/v1beta3`

The most important change is that you'll need to switch over the `apiVersion` in
your templates to the new one.

```yaml
  kind: Template
  # highlight-remove-next-line
  apiVersion: backstage.io/v1beta2
  # highlight-add-next-line
  apiVersion: scaffolder.backstage.io/v1beta3
```

## `${{ }}` instead of `"{{ }}"`

One really big readability issue and cause for confusion was the fact that with
`handlebars` and `yaml` you always had to wrap your templating strings in quotes
in `yaml` so that it didn't try to parse it as a `json` object and fail. This
was pretty annoying, as it also meant that all things look like strings. Now
that's no longer the case, you can now remove the `""` and take advantage of
writing nice `yaml` files that just work.

```yaml
spec:
  steps:
      input:
        allowedHosts: ['github.com']
        # highlight-remove-next-line
        description: 'This is {{ parameters.name }}'
        # highlight-add-next-line
        description: This is ${{ parameters.name }}
        # highlight-remove-next-line
        repoUrl: '{{ parameters.repoUrl }}'
        # highlight-add-next-line
        repoUrl: ${{ parameters.repoUrl }}
```

## No more `eq` or `not` helpers

These helpers are no longer needed with the more expressive `api` that
`nunjucks` provides. You can simply use the built-in `nunjucks` and `jinja2`
style operators.

```yaml
spec:
  steps:
      input:
        # highlight-remove-next-line
        if: '{{ eq parameters.value "backstage" }}'
        # highlight-add-next-line
        if: ${{ parameters.value === "backstage" }}
```

And then for the `not`

```yaml
spec:
  steps:
      input:
        # highlight-remove-next-line
        if: '{{ not parameters.value "backstage" }}'
        # highlight-add-next-line
        if: ${{ parameters.value !== "backstage" }}
```

Much better right? ✨

## No more `json` helper

This helper is no longer needed, as we've added support for complex values and
supporting the additional primitive values now rather than everything being a
`string`. This means that now that you can pass around `parameters` and it
should all work as expected and keep the type that has been declared in the
input schema.

```yaml
spec:
  parameters:
    test:
      type: number
      name: Test Number
    address:
      type: object
      required:
        - line1
      properties:
        line1:
          type: string
          name: Line 1
        line2:
          type: string
          name: Line 2

  steps:
    - id: test step
      action: run:something
      input:
        # highlight-remove-next-line
        address: '{{ json parameters.address }}'
        # highlight-add-next-line
        address: ${{ parameters.address }}
        # highlight-remove-next-line
        test: '{{ parameters.test }}'
        # highlight-add-next-line
        test: ${{ parameters.test }} # this will now make sure that the type of test is a number 🙏
```

## `parseRepoUrl` is now a `filter`

All calls to `parseRepoUrl` are now a `jinja2` `filter`, which means you'll need
to update the syntax.

```yaml
spec:
  steps:
      input:
        # highlight-remove-next-line
        repoUrl: '{{ parseRepoUrl parameters.repoUrl }}'
        # highlight-add-next-line
        repoUrl: ${{ parameters.repoUrl | parseRepoUrl }}
```

Now we have complex value support here too, expect that this `filter` will go
away in future versions and the `RepoUrlPicker` will return an object so
`parameters.repoUrl` will already be a
`{ host: string; owner: string; repo: string }` 🚀

## Links should be used instead of named outputs

Previously, it was possible to provide links to the frontend using the named output `entityRef` and `remoteUrl`.
These should be moved to `links` under the `output` object instead.

```yaml
output:
  # highlight-remove-start
  remoteUrl: {{ steps['publish'].output.remoteUrl }}
  entityRef: {{ steps['register'].output.entityRef }}
  # highlight-remove-end
  # highlight-add-start
  links:
    - title: Repository
      url: ${{ steps['publish'].output.remoteUrl }}
    - title: Open in catalog
      icon: catalog
      entityRef: ${{ steps['register'].output.entityRef }}
      # highlight-add-end
```

## Watch out for `dash-case`

The nunjucks compiler can run into issues if the `id` fields in your template steps use dash characters, since these IDs translate directly to JavaScript object properties when accessed as output. One possible migration path is to use `camelCase` for your action IDs.

```yaml
  steps:
    # highlight-remove-start
    id: my-custom-action
    ...

    id: publish-pull-request
    input:
      repoUrl: {{ steps.my-custom-action.output.repoUrl }} # Will not recognize 'my-custom-action' as a JS property since it contains dashes!
      # highlight-remove-end

  steps:
    # highlight-add-start
    id: myCustomAction
    ...

    id: publishPullRequest
    input:
      repoUrl: ${{ steps.myCustomAction.output.repoUrl }}
      # highlight-add-end
```

Alternatively, it's possible to keep the `dash-case` syntax and use brackets for property access as you would in JavaScript:

```yaml
input:
  repoUrl: ${{ steps['my-custom-action'].output.repoUrl }}
```

### Summary

Of course, we're always available on [discord](https://discord.gg/backstage-687207715902193673) if
you're stuck or something's not working as expected. You can also
[raise an issue](https://github.com/backstage/backstage/issues/new/choose) with
feedback or bugs!
