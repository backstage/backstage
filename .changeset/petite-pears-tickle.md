---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-home': patch
---

Fixed an issue where the `Top Visited` and `Recently Visited` cards displayed a generic title (`Create a new component`) instead of the specific template name. Titles are now shown as `Template ${templateTitle}`.
