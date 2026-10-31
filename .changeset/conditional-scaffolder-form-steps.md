---
'@backstage/plugin-scaffolder-react': minor
---

Support conditionally displaying parameter steps using a `ui:backstage.visibleWhen` JSON Schema evaluated against the current form data. Hidden steps are skipped during navigation, frontend validation, and review; their existing values are retained for submission and remain subject to backend schema validation.
