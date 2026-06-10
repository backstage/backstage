---
'@backstage/backend-test-utils': patch
---

Updated `MockActionsRegistry` to support the new secrets schema. The mock now validates secrets against the declared schema, rejects missing secrets for actions that require them, and forwards secrets to the action handler.
