---
'@backstage/frontend-plugin-api': patch
---

Page and sub-page blueprints now accept typed translation message selections in their `title` parameter. Translated title groups wait for their first selected-language translations before rendering. Later language changes update each group together while retaining previous titles and page state. Messages requiring replacement values or plural counts are rejected by TypeScript.
