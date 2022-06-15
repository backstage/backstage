---
'@backstage/plugin-catalog': patch
---

Previously, the color of the Entity Context Menu (in the Entity Page Header) was hardcoded as `white`.

This was an issue for themes that use a header with a white background. By default, the color of the icon is now `theme.palette.bursts.fontColor`.

It can now also be overridden in the theme, which is only necessary if the header title, subtitle and three-dots icon need to have different colors. For example:

```typescript
export function createThemeOverrides(theme: BackstageTheme): Overrides {
  return {
    PluginCatalogEntityContextMenu: {
      button: {
        color: 'blue',
      },
    },
    ...
  },
  ...
  }
```
