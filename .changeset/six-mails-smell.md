---
'@backstage/frontend-plugin-api': patch
---

Support merging of `inputs` in extension blueprints, but stop merging `output`. In addition, the original factory in extension blueprints now returns a data container that both provides access to the returned data, but can also be forwarded as output.
