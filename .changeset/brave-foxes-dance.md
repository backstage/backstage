---
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder': minor
---

Added experimental BUI (Backstage UI) form theme for scaffolder forms. All default field extensions render BUI variants when enabled.

**Extension config:**

```yaml
app:
  extensions:
    - sub-page:scaffolder/templates:
        config:
          enableBackstageUi: true
```

**JSX props:**

```tsx
<ScaffolderPage formProps={{ EXPERIMENTAL_theme: 'bui' }} />
```
