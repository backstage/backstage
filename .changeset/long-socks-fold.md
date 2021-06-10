---
'@backstage/integration-react': patch
'@backstage/plugin-catalog': patch
---

Move `ScmIntegrationIcon` from `@backstage/plugin-catalog` to
`@backstage/integration-react` and make it customizable using
`app.getSystemIcon()`.
