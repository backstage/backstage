---
'@backstage/backend-defaults': patch
---

Reduced PostgreSQL connection churn during backend startup when many plugins initialize databases or schemas.
