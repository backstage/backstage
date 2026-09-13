---
'@backstage/plugin-catalog-backend': patch
---

Fixed catalog model relations to inherit the source entity namespace when no default namespace is configured, as documented. Explicit namespaces in entity references and explicitly configured default namespaces continue to take precedence.
