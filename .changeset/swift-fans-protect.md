---
'@backstage/backend-common': patch
---

- Add `updateCorsOptions` method to merge new options with existent ones
- extract the app creation from the setup to an isolate method to simplify service testing
