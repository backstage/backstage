---
'@backstage/plugin-catalog': minor
---

Accept customised fields in `EntityAboutCard`. The custom field should use `useEntity` hook to access the entity provided by the context.

`AboutCardDefaultFields` is an array of default fields that is displayed in the `EntityAboutCard`. It's useful when you just want to extend the fields.

```typescript
<EntityAboutCard>
  {AboutCardDefaultFields}
  <MyCustomAboutField1 />
</EntityAboutCard>
```

`AboutCardBuiltInFields` contains the built-in fields to be used individually. It provides a more granular control of fields to be displayed in the `EntityAboutCard`.

```typescript
<EntityAboutCard>
  <AboutCardBuiltInFields.Description />
  <MyCustomAboutField1 />
  <AboutCardBuiltInFields.Owner />
</EntityAboutCard>
```
