---
'@backstage/frontend-plugin-api': patch
---

Page and sub-page blueprints now accept typed translation message selections in their `title` parameter. Groups of titles update together once their required translation resources are ready, preserving page state. Messages requiring replacement values or plural counts are rejected by TypeScript.
