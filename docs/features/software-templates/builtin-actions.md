---
id: builtin-actions
title: Builtin actions
description: Documentation describing the built-in template actions.
---

The scaffolder comes with several built-in actions for fetching content,
registering in the catalog and of course actions for creating and publishing a
git repository.

There are several repository providers supported out of the box such as GitHub,
Azure, GitLab and Bitbucket.

A list of all registered actions can be found under `/create/actions`. For local
development you should be able to reach them at
`http://localhost:3000/create/actions`.

### Migrating from `fetch:cookiecutter` to `fetch:template`

The `fetch:template` action is a new action with a similar API to
`fetch:cookiecutter` but no dependency on `cookiecutter`. There are two options
for migrating templates that use `fetch:cookiecutter` to use `fetch:template`:

#### Using `cookiecutterCompat` mode

The new `fetch:template` action has a `cookiecutterCompat` flag which should
allow most templates built for `fetch:cookiecutter` to work without any changes.

1. Update action name in `template.yaml`. The name should be changed from
   `fetch:cookiecutter` to `fetch:template`.
2. Set `cookiecutterCompat` to `true` in the `fetch:template` step input in
   `template.yaml`.

```diff
  steps:
    - id: fetch-base
      name: Fetch Base
-     action: fetch:cookiecutter
+     action: fetch:template
      input:
        url: ./skeleton
+       cookiecutterCompat: true
        values:
```

#### Manual migration

If you prefer, you can manually migrate your templates to avoid the need for
enabling cookiecutter compatibility mode, which will result in slightly less
verbose template variables expressions.

1. Update action name in `template.yaml`. The name should be changed from
   `fetch:cookiecutter` to `fetch:template`.
2. Update variable syntax in file names and content. `fetch:cookiecutter`
   expects variables to be enclosed in `{{` `}}` and prefixed with
   `cookiecutter.`, while `fetch:template` expects variables to be enclosed in
   `${{` `}}` and prefixed with `values.`. For example, a reference to variable
   `myInputVariable` would need to be migrated from
   `{{ cookiecutter.myInputVariable }}` to `${{ values.myInputVariable }}`.
3. Replace uses of `jsonify` with `dump`. The
   [`jsonify` filter](https://cookiecutter.readthedocs.io/en/latest/advanced/template_extensions.html#jsonify-extension)
   is built in to `cookiecutter`, and is not available by default when using
   `fetch:template`. The
   [`dump` filter](https://mozilla.github.io/nunjucks/templating.html#dump) is
   the equivalent filter in nunjucks, so an expression like
   `{{ cookiecutter.myAwesomeList | jsonify }}` should be migrated to
   `${{ values.myAwesomeList | dump }}`.
