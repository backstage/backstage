---
'@backstage/plugin-scaffolder-react': patch
---

The `value` sent on the `create` analytics event (fired when a Scaffolder template is executed) is now set to the number of minutes saved by executing the template. This value is derived from the `backstage.io/time-saved` annotation on the template entity, if available.

Note: the `create` event is now captured in the `<Workflow>` component. If you are directly making use of the alpha-exported `<Stepper>` component, an analytics `create` event will no longer be captured on your behalf.
