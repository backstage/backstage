---
'@backstage/cli': minor
---

**BREAKING**: The CLI templates for frontend plugins have been renamed:

- `new-frontend-plugin` → `frontend-plugin`
- `new-frontend-plugin-module` → `frontend-plugin-module`
- `frontend-plugin` (legacy) → `legacy-frontend-plugin`

To smooth out this breaking change, the CLI now auto-detects which frontend system your app uses based on the dependencies in `packages/app/package.json`. When using the default templates (no explicit `templates` configuration):

- Apps using `@backstage/frontend-defaults` will see the new frontend system templates (`frontend-plugin`, `frontend-plugin-module`)
- Apps using `@backstage/app-defaults` will see the legacy template (displayed as `frontend-plugin`)

This means existing projects that haven't migrated to the new frontend system will continue to create legacy plugins by default, while new projects will get the new frontend system templates. If you have explicit template configuration in your `package.json`, it will be used as-is without any auto-detection.
