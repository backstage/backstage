---
'@backstage/plugin-catalog': minor
---

Allow `EntitySwitch` to render all cases that match the condition.

This change introduces a new parameter for the `EntitySwitch` component
`renderMultipleMatches`. In case the parameter value is `all`, the `EntitySwitch`
will render all `EntitySwitch.Case` that contain `if` parameter, and it
evaluates to true. In case none of the cases match, the default case will be
rendered, if any.

This means for example in the CI/CD page you can now do the following:

```tsx
<EntitySwitch renderMultipleMatches="all">
  <EntitySwitch.Case if={isJenkinsAvailable}>Jenkins</EntitySwitch.Case>
  <EntitySwitch.Case if={isCodebuildAvailable}>CodeBuild</EntitySwitch.Case>
  <EntitySwitch.Case>No CI/CD</EntitySwitch.Case>
</EntitySwitch>
```

This allows the component to have multiple CI/CD systems and all of those are
rendered on the same page.
