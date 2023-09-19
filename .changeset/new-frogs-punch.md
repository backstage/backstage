---
'@backstage/plugin-kubernetes-backend': minor
---

Integrators can now bring their own auth strategies through the use of the `addAuthStrategy` method on `KubernetesBuilder`.

**BREAKING** on the slight chance you were using the `setAuthTranslatorMap` method on `KubernetesBuilder`, it has been removed along with the entire `KubernetesAuthTranslator` interface. This notion has been replaced with the more focused concept of an `AuthenticationStrategy`. Converting a translator to a strategy should not be especially difficult.
