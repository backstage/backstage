---
'@backstage/frontend-plugin-api': patch
---

Fixed a bug where overriding a plugin extension with `withOverrides` moved the overridden extension to the end of the plugin's extension list. This caused overridden extensions to lose their original position, for example making an overridden sub page tab move to the end of the tabs on its page. Overridden extensions now keep their original order, while extensions that don't override an existing one are appended at the end.
