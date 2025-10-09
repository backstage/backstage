---
'@backstage/theme': minor
---

**BREAKING**: Removed the built-in `CssBaseline` from `UnifiedThemeProvider`. If your Backstage instance looks broken after this update, you likely forgot to add our new Backstage UI global CSS. To do that, please import `@backstage/ui/css/styles.css` in `packages/app/src/index.tsx`:

```tsx
import '@backstage/ui/css/styles.css';
```

This change also removes the `noCssBaseline` prop, which became redundant.
