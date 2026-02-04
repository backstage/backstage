---
'@backstage/plugin-catalog': patch
---

The default entity content layout still supports rendering summary cards at runtime for backward compatibility, but logs a console warning when they are detected to help identify where migration is needed.
