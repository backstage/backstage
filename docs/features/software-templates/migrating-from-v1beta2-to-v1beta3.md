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

## `backstage.io/v1beta2` -> `scaffolder.backstage.io/v1beta3`

The most important change is that you'll need to switch over the `apiVersion` in
your templates to the new one.

```diff
  kind: Template
- apiVersion: backstage.io/v1beta2
+ apiVersion: scaffolder.backstage.io/v1beta3
```

## `${{ }}` instead of `"{{ }}"`

One really big readability issue and cause for confusion was the fact that with
`handlebars` and `yaml` you always had to wrap your templating strings in quotes
in `yaml` so that it didn't try to parse it as a `json` object and fail. This
was pretty annoying, as it also meant that all things look like strings. Now
that's no longer the case, you can now remove the `""` and take advantage of
writing nice `yaml` files that just work.

```diff
  spec:
    steps:
        input:
          allowedHosts: ['github.com']
-         description: 'This is {{ parameters.name }}'
+         description: This is ${{ parameters.name }}
-         repoUrl: '{{ parameters.repoUrl }}'
+         repoUrl: ${{ parameters.repoUrl }}
```

## No more `eq` or `not` helpers

These helpers are no longer needed with the more expressive `api` that
`nunjucks` provides. You can simply use the built-in `nunjucks` and `jinja2`
style operators.

```diff
  spec:
    steps:
        input:
-         if: '{{ eq parameters.value "backstage" }}'
+         if: ${{ parameters.value === "backstage" }}
          ...
```

And then for the `not`

```diff
  spec:
    steps:
        input:
-         if: '{{ not parameters.value "backstage" }}'
+         if: ${{ parameters.value !== "backstage" }}
          ...
```

Much better right? ✨

## No more `json` helper

This helper is no longer needed, as we've added support for complex values and
supporting the additional primitive values now rather than everything being a
`string`. This means that now that you can pass around `parameters` and it
should all work as expected and keep the type that has been declared in the
input schema.

```diff
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
          line1:🙏
            type: string
            name: Line 1
          line2:
            type: string
            name: Line 2

    steps:
      - id: test step
        action: run:something
        input:
-         address: '{{ json parameters.address }}'
+         address: ${{ parameters.address }}
-         test: '{{ parameters.test }}'
+         test: ${{ parameters.test }} # this will now make sure that the type of test is a number 🙏
```

## `parseRepoUrl` is now a `filter`

All calls to `parseRepoUrl` are now a `jinja2` `filter`, which means you'll need
to update the syntax.

```diff
  spec:
    steps:
        input:
-         repoUrl: '{{ parseRepoUrl parameters.repoUrl }}'
+         repoUrl: ${{ parameters.repoUrl | parseRepoUrl }}
          ...
```

Now we have complex value support here too, expect that this `filter` will go
away in future versions and the `RepoUrlPicker` will return an object so
`parameters.repoUrl` will already be a
`{ host: string; owner: string; repo: string }` 🚀

### Summary

Of course, we're always available on [discord](https://discord.gg/MUpMjP2) if
you're stuck or something's not working as expected. You can also
[raise an issue](https://github.com/backstage/backstage/issues/new/choose) with
feedback or bugs!
