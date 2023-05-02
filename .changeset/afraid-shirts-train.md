---
'@backstage/plugin-tech-insights': patch
---

Added the possibility to customize the check description in the scorecard component.

- The `CheckResultRenderer` type now exposes an optional `description` method that allows to overwrite the description with a different string or a React component for a provided check result.

Until now only the `BooleanCheck` element could be overridden, but from now on it's also possible to override the description for a check.
As an example, the description could change depending on the check result. Refer to the [README](https://github.com/backstage/backstage/blob/master/plugins/tech-insights/README.md#adding-custom-rendering-components) file for more details
