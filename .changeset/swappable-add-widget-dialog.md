---
'@backstage/plugin-home': patch
---

The add widget dialog of the customizable home page grid can now be replaced. It is exported as `AddWidgetDialog` from `@backstage/plugin-home/alpha` and can be overridden in apps using the new frontend system, for example to show widget previews, without copying the home page grid. The default dialog is unchanged.
