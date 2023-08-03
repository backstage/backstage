---
'@backstage/plugin-home': patch
---

Make sure the widget name is never empty in the `AddWidgetDialog`. If the title was set to "", the entry would contain an empty string. Use the name as a fallback
