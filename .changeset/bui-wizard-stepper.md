---
'@backstage/plugin-scaffolder-react': minor
---

Replaced the MUI-based Stepper and Workflow components with BUI-native equivalents. The wizard now features a numbered progress bar with an animated gradient indicator, a card-based form layout, and a table-based review step.

**Breaking changes (alpha API):**

- `BackstageTemplateStepperClassKey` type has been removed. MUI theme overrides for `BackstageTemplateStepper` no longer apply.
- `ReviewState` now renders a BUI table instead of `StructuredMetadataTable`. All review logic (`ui:backstage.review` options) is preserved.
- The `Workflow` component no longer wraps content in `Content > InfoCard`. Template title and description are rendered via a new `WizardTemplateHeader`.

**Additions:**

- `previewMode` prop on `StepperProps` for template editor embedding

All existing `StepperProps` and `WorkflowProps` remain compatible.
