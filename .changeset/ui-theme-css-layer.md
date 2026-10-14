---
'@backstage/ui': patch
---

Added a `theme` CSS cascade layer between `components` and `utilities`. BUI leaves it empty: put your app's brand overrides in `@layer theme` to win over component styles without raising specificity, while utility props still take precedence. Existing styles are unaffected.

If your app already declares its own layer named `theme`, its rules now sit below BUI's utility classes instead of above them.
