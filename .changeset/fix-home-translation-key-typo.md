---
'@backstage/plugin-home': patch
---

Added the correctly-spelled `'widgetSettingsOverlay.editSettingsTooltip'` translation key in `homeTranslationRef` and deprecated the previous typoed `'widgetSettingsOverlay.editSettingsTooptip'` key. Existing references to the old key continue to work; switch to the new key to avoid future removal.
