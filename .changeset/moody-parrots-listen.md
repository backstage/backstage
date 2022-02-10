---
'@backstage/plugin-bazaar': patch
'@backstage/plugin-ilert': patch
---

Rolling back the `@date-io/luxon` bump as this broke both packages, and we need it for `@material-ui/pickers`
