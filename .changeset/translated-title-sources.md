---
'@backstage/frontend-plugin-api': patch
---

Page and sub-page blueprints now accept typed translation message selections in their `title` parameter. Titles follow the selected language while preserving page state, and messages requiring replacement values or plural counts are rejected by TypeScript.
