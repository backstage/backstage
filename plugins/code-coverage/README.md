# code-coverage

This is the frontend part of the code-coverage plugin. It takes care of processing various coverage formats and standardizing them into a single json format, used by the frontend.

## Configuring your entity

In order to use this plugin, you must set the `backstage.io/code-coverage` annotation.

```yaml
backstage.io/code-coverage: enabled
```

There's a feature to only include files that are in VCS in the coverage report, this is helpful to not count generated files for example. To enable this set the `backstage.io/code-coverage` annotation to `scm-only`.

```yaml
backstage.io/code-coverage: scm-only
```

Note: It may be required to set the [`backstage.io/source-location` annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiosource-location), however this should generally not be needed.
