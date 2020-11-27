---
'@backstage/plugin-catalog-backend': patch
---

Ignore empty YAML documents. Having a YAML file like this is now ingested without an error:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: web
spec:
  type: website
---

```

This behaves now the same way as Kubernetes handles multiple documents in a single YAML file.
