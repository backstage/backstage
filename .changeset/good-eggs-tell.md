---
'@backstage/frontend-app-api': patch
---

Updated error reporting and app tree resolution logic to attribute errors to the correct extension and allow app startup to proceed more optimistically:

- If an attachment fails to provide the required input data, the error is now attributed to the attachment rather than the parent extension.
- Singleton extension inputs will now only forward attachment errors if the input is required.
